import { useEffect, useState } from "react";

export const useCount = (finalCount: number, {delay} : {delay?: number} = {}) => {
      const [count, setCount] = useState(0);
      const totalFrames = 120;
    
      useEffect(() => {
    let frame = 0;

    const timer = setTimeout(() => {
          countUp(); 
        }, delay || 0)

    const countUp = () => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(finalCount * progress);
      setCount(current);

      if (frame < totalFrames) {
        requestAnimationFrame(countUp);
      }
    };

    return () => clearTimeout(timer);
  }, [finalCount, delay]);

      return count;
}