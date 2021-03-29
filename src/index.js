import React, { useState, useEffect } from 'react';
import vmsg from './vmsg'
import offMicIcon from './off_mic.svg'
import onMicIcon from './on_mic.svg'
import wasmURL from './vmsg.wasm'
import Waveform from "./Waveform";

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export const Recorder = props =>{
  const [recording, setRecording] = useState(0);
  const [recorder, setRecorder] = useState();

  useEffect(() => {
    return () => {
      cleanup()
    };
  }, []);

  const cleanup = () =>{
    if (recorder) {
      recorder.stopRecording()
      recorder.close()
      setRecorder(null)
    }
  }

  const startRecording = () => {
    const {
      recorderParams
    } = props

    cleanup()

    setRecorder(
      new vmsg.Recorder({
      wasmURL,
      shimURL,
      ...recorderParams
      })
    )

    recorder.init()
      .then(() => {
        recorder.startRecording()
        setRecording(1)
      })
      .catch((err) => props.onRecordingError(err))
  }

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording()
        .then((blob) => {
          props.onRecordingComplete(blob)
          setRecording(2)
          cleanup()
        })
        .catch((err) => props.onRecordingError(err))
    }
  }

  return (
    <div className='recorder_container'>

      { recording === 0 &&
          <div className='recorder_button recorder_off'
          onMouseDown={startRecording}>
            <img src={offMicIcon} width={24} height={24}
            className='mic_icon' />
          </div>
      }
      { recording === 1 &&
          <div className='recorder_button recorder_on'
          onMouseDown={stopRecording}>
            <img src={onMicIcon} width={24} height={24}
            className='mic_icon' />
          </div>
      }
          { props.audioUrl &&
              <Waveform url={props.audioUrl} period={props.period}/>
          }
    </div>
  )
}

export default Recorder
