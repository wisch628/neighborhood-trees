import { Tree } from "./types";
import { Trees } from "./Trees";
import { useCount } from "./useCounter";
import { SubTree } from "./SubTree";
import { useEffect, useState } from "react";

export const TreeDisplay = ({
  trees,
  clearResults,
}: {
  trees: Tree[];
  clearResults: () => void;
}) => {
  const [showTrees, setShowTrees] = useState(false);
  const [selectedTree, setSelectedTree] = useState(trees[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTrees(true); // Set state to true after 3 seconds
    }, 3000); // 3000ms = 3 seconds

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const [topTree, ...otherTrees] = trees;
  const count = useCount(topTree.count);
  return (
    <div className="flex-col">
      <Trees fullWidth={300} />
      <h3>Your zip code has...</h3>
      <h1>
        <span className="tree-count">{count} </span>
        {topTree?.common}s
      </h1>
      <div className="other-trees">
        <div className="flex twenty-gap">
          {otherTrees.map((tree, idx) => {
            return (
              <SubTree
                tree={tree}
                idx={idx}
                onClick={() => setSelectedTree(tree)}
              />
            );
          })}
        </div>
      </div>
      <img src={selectedTree.image} height={300} />
      <figcaption>
        {selectedTree.species}, better known as {selectedTree.common}
      </figcaption>
      {showTrees && (
        <>
          <h3>
            Click on the tree name to see a photo of it generated from the
            Wikipedia API, or <a onClick={clearResults}>try a new zip code.</a>
          </h3>
        </>
      )}
    </div>
  );
};
