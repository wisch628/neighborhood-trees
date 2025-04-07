import { useState } from "react";
import "./App.css";
import { LandingPage } from "./LandingPage";
import { Loading } from "./Loading";
import { TreeDisplay } from "./TreeDisplay";
import { Tree } from "./types";

function App() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [error, setError] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);

  const clearResults = () => {
    setTrees([]);
    setZipcode("");
  };

  const callData = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:5000/get-nyc-data?postcode=${zipcode}`)
      .then((response) => response.json())
      .then((data) => {
        setTrees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });

        setError(err);
      });
  };
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div>
        <h1>Error, please refresh</h1>
        <button onClick={clearResults}>Refresh</button>
      </div>
    );
  }
  return (
    <>
      {trees?.length ? (
        <TreeDisplay trees={trees} clearResults={clearResults} />
      ) : (
        <LandingPage
          zipcode={zipcode}
          setZipcode={setZipcode}
          callData={callData}
        />
      )}
    </>
  );
}

export default App;
