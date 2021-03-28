import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import vmsg from './vmsg'
import offMicIcon from './off_mic.svg'
import onMicIcon from './on_mic.svg'
import wasmURL from './vmsg.wasm'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export default class Recorder extends Component {
  static propTypes = {
    recorderParams: PropTypes.object,
    onRecordingComplete: PropTypes.func,
    onRecordingError: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    recorderParams: { },
    onRecordingComplete: () => { },
    onRecordingError: () => { }
  }

  state = {
    isRecording: false
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
      className,
      ...rest
    } = this.props

    return (
      <div className='recorder_container'>

      { this.state.isRecording
          ? (
            <div className='recorder_button recorder_on'
            onMouseDown={this.stopRecording}>
              <img src={onMicIcon} width={24} height={24}
              className='mic_icon' />
            </div>
          )
          : (
            <div className='recorder_button recorder_off'
            onMouseDown={this.startRecording}>
              <img src={offMicIcon} width={24} height={24}
              className='mic_icon' />
            </div>
          )
      }
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
        this.setState({ isRecording: true })
      })
      .catch((err) => this.props.onRecordingError(err))
  }

  stopRecording = () => {
    if (this._recorder) {
      this._recorder.stopRecording()
        .then((blob) => {
          this.props.onRecordingComplete(blob)
          this.setState({ isRecording: false })
        })
        .catch((err) => this.props.onRecordingError(err))
    }
  }

}
