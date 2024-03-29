import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [timeState, setTimeState] = useState();

  // Initialize the time on component mount
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const date: any = new Date();
      setTimeState(date.toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Prevent memory leaks (if needed)
    };
  }, []);

  return <p className="text-2xl absolute right-4 top-[42px]">{timeState}</p>;
};

export default Clock;
