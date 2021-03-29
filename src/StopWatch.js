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

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      if(timer < 10) {
        setTimer((timer) => timer + 1)
      } else {
        clearInterval(countRef.current)
        props.stopRecording()
        handlePause()
      }
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
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
    <div className='stop_watch'>{format(timer)}</div>
  )

}

export default StopWatch

