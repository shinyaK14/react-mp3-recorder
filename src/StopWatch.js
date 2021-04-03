import React, { useState, useRef, useEffect } from 'react';

const StopWatch = props => {
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null)

  useEffect(() => {
    return () => {
      handleReset()
    };
  }, []);

  useEffect(() => {
    if(props.isRecording === 1) {
      handleStart()
    } else {
      handlePause()
    }
  }, [ props.isRecording ]);

  useEffect(() => {
    props.secondRef.current = timer
  }, [ timer ]);

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)

    setTimeout(() => {
      if(!isPaused) {
        props.stopRecording()
        handlePause()
      }
    }, 31000);
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  const format = num => {
    return ( '00' + num ).slice(-2)
  }

  return(
    <div>
      <div className='stop_watch'>{format(timer)}</div>
      <div className='error'>
        * 最大３０秒まで
      </div>
    </div>
  )

}

export default StopWatch

