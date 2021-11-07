import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

let AudioWave = (props) => {
    /*let WaveSurfer = require('wavesurfer.js');

    wavesurfer.load(props.audio);

    return(
        <div id="waveform"></div>
    );*/

    const waveformRef = useRef();
    let wavesurfer;

    useEffect(() => {
      document.getElementById("wave").innerHTML = "";
      if(waveformRef.current) {
        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
        });
        console.log(props.audio);
        wavesurfer.load(props.audio);
      }
    }, [props.audio]);    
    
    return(
        <div ref={waveformRef} id="wave">
        </div>
    );
}

export default AudioWave;