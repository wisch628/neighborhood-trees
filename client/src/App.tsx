import { useState } from "react";
import "./App.css";

interface TreeStats {
  count: number;
  species: string;
  common: string;
  image: string;
}

function App() {
  const [mostCommon, setMostCommon] = useState<TreeStats[]>([]);
  const [error, setError] = useState("");
  const [zipcode, setZipcode] = useState("");
  const callData = () => {
    console.log(zipcode);
    fetch(`http://127.0.0.1:5000/get-nyc-data?postcode=${zipcode}`)
      .then((response) => response.json())
      .then((data) => setMostCommon(data))
      .catch((err) => setError(err));
  };
  return (
    <>
      {mostCommon?.length ? (
        <>
          <img src="/tree-1.png" />
          <h1>
            The most common tree in your zipcode is: {mostCommon[0]?.common}{" "}
          </h1>{" "}
          <img src={mostCommon[0].image} />
          <h1>with {mostCommon[0]?.count} trees</h1> <br />
          <h3>Followed by:</h3>
          {mostCommon.map(({ common, image, count }, idx) => {
            return idx !== 0 ? (
              <>
                <li>{common + " " + count}</li> <img src={image} />{" "}
              </>
            ) : null;
          })}
        </>
      ) : (
        <>
          <h1>Enter your zipcode</h1>
          <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
          <button onClick={callData}>Submit</button>
        </>
      )}
    </>
  );
}

export default App;
