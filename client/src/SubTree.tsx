import { Tree } from "./types";
import { useCount } from "./useCounter";

export const SubTree = ({
  tree,
  idx,
  onClick,
}: {
  tree: Tree;
  idx: number;
  onClick: () => void;
}) => {
  const { count, common } = tree;
  const delay = (idx + 1) * 1000;
  const treeCount = useCount(count, { delay });

  return (
    <div className="tree-wrapper" onClick={onClick}>
      <p>
        <span className="tree-count">{treeCount}</span> {common}s
      </p>
    </div>
  );
};
