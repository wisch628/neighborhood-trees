import { Tree } from "./types";
import { capitalizeWords } from "./utils";
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
  const [selectedTree, setSelectedTree] = useState(trees[0].image);

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
      <h3>The most common tree in your zipcode is...</h3>
      <h1>{capitalizeWords(topTree?.common)}!</h1>
      <h3>
        with <span className="tree-count">{count} trees</span>
      </h3>
      <img src={selectedTree} height={200} />
      {showTrees && (
        <>
          <div className="other-trees">
            <h3>Your neighborhood also has...</h3>
            <div className="flex twenty-gap">
              {otherTrees.map((tree, idx) => {
                const hover = () => setSelectedTree(tree.image);
                const leave = () => setSelectedTree(topTree.image);

                return (
                  <SubTree tree={tree} idx={idx} hover={hover} leave={leave} />
                );
              })}
            </div>
          </div>
          <a onClick={clearResults}>Try a new zip code</a>
        </>
      )}
    </div>
  );
};
