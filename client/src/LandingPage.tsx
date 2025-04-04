export const LandingPage = ({
  zipcode,
  setZipcode,
  callData,
}: {
  zipcode: string;
  setZipcode: React.Dispatch<React.SetStateAction<string>>;
  callData: () => void;
}) => {
  return (
    <>
      <h1>Welcome!</h1>
      <h3>Enter your zip code to get tree stats for your neighborhood</h3>

      <div className="flex">
        <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
        <button onClick={callData}>Go</button>
      </div>
      <div className="treeWrapper">
        <img src="/tree-1.png" width={100} />
        <img src="/tree-2.png" width={100} />
        <img src="/tree-3.png" width={100} />
        <img src="/tree-4.png" width={100} />
        <img src="/tree-6.png" width={100} />
        <img src="/tree-5.png" width={100} />
      </div>
    </>
  );
};
