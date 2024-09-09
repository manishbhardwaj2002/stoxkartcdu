import React,{useState, useRef} from 'react';
import IIdleTimer, { IdleTimerProvider } from "react-idle-timer"

const IdealTimerConatiner = () => {
    const idleTimerRef = useRef(null);

const onIdle = ()=> {
    localStorage.remove()
}


  return (
    <div>
        <IdleTimerProvider ref={idleTimerRef} timeout={5*10000} onIdle={onIdle}></IdleTimerProvider>
    </div>
  )
}

export default IdealTimerConatiner