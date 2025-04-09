from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from collections import Counter
import re
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://neighborhood-trees.vercel.app"])

tree_cache = dict()

def get_new_tree_image(tree_name):
    cached = tree_cache.get(tree_name)
    if cached and cached != "":
        return tree_cache.get(tree_name)
    transform = tree_name.replace(' x ', ' ')
    trimmed_name = re.split(r'\bvar\.', transform, flags=re.IGNORECASE)[0].strip()
    key = os.environ.get("VITE_PERENUAL_KEY")
    fetch_page_id = f"https://perenual.com/api/species-list?key={key}&q={trimmed_name}"
    id_response = requests.get(fetch_page_id)

    if id_response.status_code == 200:
        search_results = id_response.json()
        data = search_results.get("data", [])
        if len(data) == 0 or data[0].get('default_image') is None:
            return ''
        tree_image = data[0].get('default_image')
        if tree_image.get('regular_url'):
            url = tree_image.get('regular_url')
        else:
            url = tree_image.get('original_url', '')       
        tree_cache[tree_name] = url
        return url
 
    return ''

def calculate_health(health):
    if health == "Good":
        return 3
    if health == "Fair":
        return 2
    return 1

def call_endpoint(postcode, offset = 0):
    url = f"https://data.cityofnewyork.us/resource/uvpi-gqnh.json?postcode={postcode}&$offset={offset}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return jsonify({"error": "There was an error with the tree census api"}), 500


@app.route('/get-nyc-data')
def get_nyc_data():
    postcode = request.args.get('postcode')
    if postcode is None:
        return jsonify({"error": "Please add a postcode"}), 500
    all_data = []
    request_number = 0

    while True:
        offset = request_number * 1000
        batched_data = call_endpoint(postcode, offset)
        if not batched_data:
            break

        all_data += batched_data
        request_number += 1

        if len(batched_data) < 1000:
            break
    print("total", len(all_data))
    species_counts = Counter()
    common_names = dict()
    widest_tree = None
    skinniest_tree = None
    total_health = 0
    def create_tree_list(tree_list):
        return [{"species": species.title(), "count": count, "common":  common_names.get(species, '').title(), "image": get_new_tree_image(species)} for species, count in tree_list]

    for entry in all_data:
        spc_latin = entry.get('spc_latin')
        spc_common = entry.get('spc_common')
        width = int(entry.get('tree_dbh', 0) or 0)
        health = entry.get('health')
        total_health += calculate_health(health)
        is_stump = entry.get('status') == "Stump"
        if widest_tree is None or width > int(widest_tree.get('tree_dbh')):
            widest_tree = entry
        if skinniest_tree is None or width < int(skinniest_tree.get('tree_dbh')) and is_stump is False:
            skinniest_tree = entry
        if spc_latin:
            species_counts[spc_latin] += 1
            common_names[spc_latin] = spc_common
    
    top_5_species = species_counts.most_common(5)
    bottom_5_species = species_counts.most_common()[::-1][:5]

    top_5 = create_tree_list(top_5_species)
    bottom_5 = create_tree_list(bottom_5_species)

    result = {"top_5": top_5, "bottom_5": bottom_5, "widest_tree": widest_tree, "skinniest_tree": skinniest_tree, "health": round(total_health/len(all_data))}
    return jsonify(result)

@app.route('/')
def test():
    return 'Testing123'
