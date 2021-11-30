import React, { useRef, useEffect, useCallback, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

let AudioWave = (props) => {
    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState();

    useEffect(() => {
      document.getElementById("wave").innerHTML = "";
      if(waveformRef.current) {
        let wavesurfertemp = WaveSurfer.create({
          container: waveformRef.current,
        });
        wavesurfertemp.load(props.audio);
        setWaveSurfer(wavesurfertemp);
        setState(true);
      }
    }, [props.audio]);

    useEffect(() => {
      if(state === true){
        switch(props.playback){
          case "play":
            onPlay();
            break;
          case "pause":
            onPause();
            break;
          case "stop":
            onStop();
            break;
          case "skipToFront":
            skipToFront();
            break;
          case "skipToBack":
            skipToBack();
            break;
        }
      }
      
    }, [props.playback]);
    
    const onPlay = useCallback(() => {
      console.log(wavesurfer);
        wavesurfer.play();
    });

    const onPause = useCallback(() =>{
      wavesurfer.pause();
    });

    const skipToFront = useCallback(() => {
      wavesurfer.pause();
      wavesurfer.seekTo(0);
      wavesurfer.play();
    });

    const onStop = useCallback(() => {
      wavesurfer.stop();
    });

    const skipToBack = useCallback(() => {
      wavesurfer.stop();
      wavesurfer.seekTo(1);
    });
    
    return(
      <div ref={waveformRef} id="wave"></div>       
    );
}

export default AudioWave;