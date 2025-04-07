export const Trees = ({ fullWidth = 600 }: { fullWidth?: number }) => {
  const width = fullWidth / 6;
  return (
    <div className="treeWrapper">
      <img className="tablet" src="/tree-1.png" width={width} />
      <img src="/tree-2.png" width={width} />
      <img className="desktop" src="/tree-3.png" width={width} />
      <img src="/tree-4.png" width={width} />
      <img className="desktop" src="/tree-6.png" width={width} />
      <img src="/tree-5.png" width={width} />
    </div>
  );
};
