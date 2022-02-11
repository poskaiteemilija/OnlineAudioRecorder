import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import "../style/Wave.css";

/*
        TO DO:
        delete a track
        mute a track
        synchronized playback
        don't streach the wave to fit the screen (or don't resize other waves in the process of it)
*/

let AudioWave = (props) => {
    //const { playbackTime, setPlaybackTime } = useContext(PlaybackContext);

    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState({value: []});

    useEffect(() => {
      document.getElementById("wave").innerHTML = "";
      if(waveformRef.current) {
        const audioRecs = props.audio.value;
        audioRecs.forEach(recording => {
          let wavesurfertemp = WaveSurfer.create({
            container: waveformRef.current,
            backgroundColor: "#ffffff",
          });
          wavesurfertemp.load(recording.rec);
          wavesurfertemp.setCursorColor('#fa95d0');
          wavesurfertemp.setHeight("200");
          let newList = wavesurfer.value;
          newList.push(wavesurfertemp);
          setWaveSurfer({value: newList});
        }); 
        //setBackgroundColor()
        
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
      wavesurfer.value.forEach(track => {
        track.play();
      });
        //wavesurfer.play();
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