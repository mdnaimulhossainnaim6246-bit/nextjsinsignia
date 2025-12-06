// import { useState, useEffect } from 'react';

// const useCountUp = (end, duration) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const endValue = parseInt(end, 10);
//     if (start === endValue) return;

//     const range = endValue - start;
//     const increment = endValue > start ? 1 : -1;
//     const stepTime = Math.abs(Math.floor(duration / range));

//     const timer = setInterval(() => {
//       start += increment;
//       setCount(start);
//       if (start === endValue) {
//         clearInterval(timer);
//       }
//     }, stepTime);

//     return () => clearInterval(timer);
//   }, [end, duration]);

//   return count;
// };

// export default useCountUp;








import { useState, useEffect } from 'react';

const useCountUp = (end, duration = 5000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = 0;
    const endValue = Number(end);
    const range = endValue - start;

    if (range === 0) {
      setCount(endValue);
      return;
    }

    const maxDuration = 5000; // maximum 5s
    const totalDuration = Math.min(duration, maxDuration);
    const stepTime = 30; // update every 30ms for smooth animation
    const steps = Math.ceil(totalDuration / stepTime); // total steps
    const increment = range / steps; // increment per step

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((range > 0 && current >= endValue) || (range < 0 && current <= endValue)) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current)); // you can use Math.ceil or parseInt if needed
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

export default useCountUp;
