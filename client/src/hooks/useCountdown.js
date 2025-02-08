import { useState, useEffect } from 'react';

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isClosed: false
  });

  useEffect(() => {
    // Convert target date to timestamp once
    const target = targetDate.getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeRemaining = target - now;

      // Only update if the time has actually changed
      if (timeRemaining <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isClosed: true
        });
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isClosed: false
      });
    };

    // Set up the interval
    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial calculation
    
    // Cleanup
    return () => clearInterval(timerInterval);
  }, [targetDate]); // Only re-run if targetDate changes

  return timeLeft;
};

export default useCountdown;