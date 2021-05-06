import React, { useEffect, useRef, useState } from "react";
import playIcon from './play.svg'
import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#656565",
  progressColor: "#AF2796",
  cursorColor: "#AF2796",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 80,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true
});

export default function Waveform({ url }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function() {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    <div>
      <div className="recorder_button recorder_play" onClick={handlePlayPause}>
        <img src={playIcon} width={24} height={24}
        className='play_icon' />

        {/* <input */}
        {/*   type="range" */}
        {/*   id="volume" */}
        {/*   name="volume" */}
        {/*   // waveSurfer recognize value of `0` same as `1` */}
        {/*   //  so we need to set some zero-ish value for silence */}
        {/*   min="0.01" */}
        {/*   max="1" */}
        {/*   step=".025" */}
        {/*   onChange={onVolumeChange} */}
        {/*   defaultValue={volume} */}
        {/* /> */}
        {/* <label htmlFor="volume">Volume</label> */}
      </div>
      <div id="waveform" ref={waveformRef} />
    </div>
  );
}


