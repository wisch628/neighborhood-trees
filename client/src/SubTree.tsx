import { Tree } from "./types";
import { useCount } from "./useCounter";
import { capitalizeWords } from "./utils";

export const SubTree = ({
  tree,
  idx,
  hover,
  leave,
}: {
  tree: Tree;
  idx: number;
  hover: () => void;
  leave: () => void;
}) => {
  const { count, common } = tree;
  const delay = (idx + 1) * 1000;
  const treeCount = useCount(count, { delay });

  return (
    <div className="tree-wrapper" onMouseEnter={hover} onMouseLeave={leave}>
      <p>
        <span className="tree-count">{treeCount}</span>{" "}
        {capitalizeWords(common)}s
      </p>
    </div>
  );
};
