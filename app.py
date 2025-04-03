from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from collections import Counter

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

def get_tree_image(tree_name):
    fetch_page_id = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={tree_name}&utf8=&format=json"
    id_response = requests.get(fetch_page_id)

    if id_response.status_code == 200:
        data = id_response.json()
        search_results = data.get('query', {}).get('search', {})
             # Get the first page's data (no loop)
        page_id = search_results[0].get('pageid', '')
        url = f"http://en.wikipedia.org/w/api.php?action=query&pageids={page_id}&prop=pageimages&format=json&pithumbsize=200"
        image_response = requests.get(url)
        if image_response.status_code == 200:
            image_data = image_response.json()
            image = image_data.get('query', {}).get('pages', {}).get(str(page_id), {}).get('thumbnail', {}).get('source', '')
            return image
 
    return ''  # Return empty string if no image is found

@app.route('/get-nyc-data')
def get_nyc_data():
    postcode = request.args.get('postcode')
    if postcode is None:
        return jsonify({"error": "Please add a postcode"}), 500

    url = f"https://data.cityofnewyork.us/resource/uvpi-gqnh.json?postcode={postcode}"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        species_counts = Counter()
        common_names = dict()

        for entry in data:
            spc_latin = entry.get('spc_latin')
            spc_common = entry.get('spc_common')

            if spc_latin:
                species_counts[spc_latin] += 1
                common_names[spc_latin] = spc_common
        
        # Get the top 5 most common species
        top_5_species = species_counts.most_common(5)

        result = [{"species": species, "count": count, "common":  common_names.get(species, ''), "image": get_tree_image(species)} for species, count in top_5_species]
        
        return jsonify(result)  # Return the top 5 species as a JSON response

    else:
        return jsonify({"error": "Failed to fetch data from NYC API"}), 500

if __name__ == '__main__':
    app.run(debug=True)