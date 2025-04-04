import { useEffect } from "react";
import { Trees } from "./Trees";

export const LandingPage = ({
  zipcode,
  setZipcode,
  callData,
}: {
  zipcode: string;
  setZipcode: React.Dispatch<React.SetStateAction<string>>;
  callData: () => void;
}) => {
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        callData();
      }
    };

    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [callData]);
  return (
    <div className="centered">
      <div>
        <h1>Welcome!</h1>
        <h3>Enter your NYC zip code to get tree stats for your neighborhood</h3>

        <div className="flex five-gap">
          <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
          <button onClick={callData}>Go</button>
        </div>
        <Trees />
      </div>
    </div>
  );
};
