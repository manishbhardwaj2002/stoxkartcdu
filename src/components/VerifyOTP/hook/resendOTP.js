import { useState, useEffect, useRef } from "react";

const useResendOTP = ({
  maxTime,
  onTimerComplete,
  timeInterval,
  onResendClick
}) => {
  const timeout = useRef();

  const [remainingTime, setRemainingTime] = useState(maxTime);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {

    if (timeout.current && remainingTime === 0) {
      clearTimeout(timeout.current);
      setTimeUp(true)
      if (onTimerComplete) {
        onTimerComplete();
      
      }
    } else {
      timeout.current = setTimeout(() => {
        setRemainingTime(t => t - 1);
        setTimeUp(false)
      }, timeInterval);
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [onTimerComplete, remainingTime, timeInterval]);

  const handelResendClick = () => {
    setTimeUp(false)
    if (onResendClick) {
      onResendClick(remainingTime === 0); 
    }
    setRemainingTime(maxTime);
  };

  return {
    handelResendClick,
    remainingTime,
    timeUp
  };
};

export default useResendOTP;