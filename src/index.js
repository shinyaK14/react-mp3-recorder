import React, { Component } from 'react'
import vmsg from './vmsg'
import offMicIcon from './off_mic.svg'
import onMicIcon from './on_mic.svg'
import wasmURL from './vmsg.wasm'
import Waveform from "./Waveform";
import StopWatch from "./StopWatch";

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export default class Recorder extends Component {
  static defaultProps = {
    recorderParams: { },
    onRecordingComplete: () => { },
    onRecordingError: () => { }
  }

  state = {
    isRecording: 0
  }

  _recorder = null

  componentWillUnmount() {
    this._cleanup()
  }

  render() {
    const {
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      audioUrl,
      period
    } = this.props

    return (
      <div className='recorder_container'>

        { this.state.isRecording === 0 &&
            <div className='recorder_button recorder_off'
            onMouseDown={this.startRecording}>
              <img src={offMicIcon} width={24} height={24}
              className='mic_icon' />
            </div>
        }
        { this.state.isRecording === 1 &&
            <div className='recorder_button recorder_on'
            onMouseDown={this.stopRecording}>
              <img src={onMicIcon} width={24} height={24}
              className='mic_icon' />
            </div>
        }
        { audioUrl &&
            <Waveform url={audioUrl} period={period}/>
        }
            <StopWatch isRecording={this.state.isRecording}
           stopRecording={this.stopRecording}/>
      </div>
    )
  }

  _cleanup() {
    if (this._recorder) {
      this._recorder.stopRecording()
      this._recorder.close()
      delete this._recorder
    }
  }

  startRecording = () => {
    const {
      recorderParams
    } = this.props

    this._cleanup()

    this._recorder = new vmsg.Recorder({
      wasmURL,
      shimURL,
      ...recorderParams
    })

    this._recorder.init()
      .then(() => {
        this._recorder.startRecording()
        this.setState({ isRecording: 1 })
      })
      .catch((err) => this.props.onRecordingError(err))
  }

  stopRecording = () => {
    if (this._recorder) {
      this._recorder.stopRecording()
        .then((blob) => {
          this.props.onRecordingComplete(blob)
          this.setState({ isRecording: 2 })
          this._cleanup()
        })
        .catch((err) => this.props.onRecordingError(err))
    }
  }

}
