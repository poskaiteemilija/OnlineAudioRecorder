import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import "../style/Wave.css";

/*
        TO DO:
        delete a track
        mute a track
        -- synchronized playback
        don't streach the wave to fit the screen (or don't resize other waves in the process of it)
*/

let AudioWave = (props) => {
    //const { playbackTime, setPlaybackTime } = useContext(PlaybackContext);

    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState({value: []});

    useEffect(() => {
      let wave = document.getElementById("wave");
      wave.innerHTML = "";


      if(waveformRef.current) {
        const audioRecs = props.audio.value;
        let maxVal = 0;

        audioRecs.forEach(rec => {
          console.log(rec.dur);
          if(maxVal <= rec.dur){
            console.log('what');
            maxVal = rec.dur;
          }
          console.log(maxVal);
        });
        console.log(maxVal);

        audioRecs.forEach(recording => {
          const duration = recording.dur;
          const parentDiv = document.createElement("div");

          let wavesurfertemp = WaveSurfer.create({
            container: parentDiv,
            fillParent: true,
            minPxPerSec: 200,
            backgroundColor: "#ffffff",
          });

          wavesurfertemp.load(recording.rec);
          wavesurfertemp.setCursorColor('#fa95d0');
          wavesurfertemp.setHeight("200");

          if(duration !== maxVal){
            const percentage = duration/maxVal;
            parentDiv.style.width = (wave.clientWidth*percentage) + "px";
          }
          
          wave.appendChild(parentDiv);

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
      wavesurfer.value.forEach(track => {
        track.pause();
      });
      
      //wavesurfer.pause();
    });

    const skipToFront = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.pause();
        track.seekTo(0);
        track.play();
      });

      //wavesurfer.pause();
      //wavesurfer.seekTo(0);
      //wavesurfer.play();
    });

    const onStop = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
      });
      
      //wavesurfer.stop();
    });

    const skipToBack = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
        track.seekTo(1);
      });

      //wavesurfer.stop();
      //wavesurfer.seekTo(1);
    });

    return(
      <div ref={waveformRef} id="wave"></div>       
    );
}

export default AudioWave;