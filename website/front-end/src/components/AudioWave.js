import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import "../style/Wave.css";

import WaveWrapper from "./WaveWrapper";

//import ControlDiv from "./ControlDiv";

/*
        TO DO:
        delete a track
        mute a track
        -- synchronized playback
        -- don't streach the wave to fit the screen (or don't resize other waves in the process of it)
*/

let AudioWave = (props) => {
    //const { playbackTime, setPlaybackTime } = useContext(PlaybackContext);

    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState({value: []});
    const [region, setRegion] = useState(false);

    useEffect(() => {
      let wave = document.getElementById("wave");
      wave.innerHTML = "";


      if(waveformRef.current) {
        const audioRecs = props.audio.value;
        let maxVal = 0;

        audioRecs.forEach(rec => {
          if(maxVal <= rec.dur){
            maxVal = rec.dur;
          }
        });
        
        let count = 0;
        
        let newList = [];

        audioRecs.forEach(recording => {
          const duration = recording.dur;
          //const baseDiv = document.createElement("div");

          /*let controlDiv = document.createElement("div");
          controlDiv.className = "track-control-div";
        
          let addRegionButton = document.createElement("button");
          addRegionButton.innerHTML = "Add Selection"
          addRegionButton.id = count + "b";
          addRegionButton.onclick = onRegionSelect;
        
          controlDiv.appendChild(addRegionButton);
          
          baseDiv.appendChild(controlDiv);*/
          
          const parentDiv = document.createElement("div");

          let wavesurfertemp = WaveSurfer.create({
            container: parentDiv,
            fillParent: true,
            minPxPerSec: 200,
            backgroundColor: "#ffffff",
            plugins:[
              RegionsPlugin.create({
                regions:[
                  
                ]
              })
            ]
          });

          wavesurfertemp.load(recording.rec);
          wavesurfertemp.setCursorColor('#fa95d0');
          wavesurfertemp.setHeight("200");

          if(duration !== maxVal){
            const percentage = duration/maxVal;
            parentDiv.style.width = (wave.clientWidth*percentage) + "px";
          }
          
          //baseDiv.append(parentDiv);
          wave.appendChild(parentDiv);

          newList.push(wavesurfertemp);
          
          count++;
        }); 
        //setBackgroundColor()
        
        setWaveSurfer({value: newList});
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

    const onRegionSelect = useCallback((trackIndex) => {
      console.log(trackIndex);
      //let wave = wavesurfer.value[trackIndex];
      console.log(wavesurfer.value)
      //console.log(wave);
      //temp code to test function taken from https://stackoverflow.com/questions/60503478/how-do-i-play-a-region-and-only-the-region-on-wavesurfer-js
      /*wave.addRegion(
        {
          id: trackIndex + "smt",   
          start: 0,
          end: 1,
          loop: false,
          color: '#cccccc'
        }
      );*/
    });
    
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
      <div>
        <div ref={waveformRef} id="wave"></div>       
        <WaveWrapper audio={props.audio.value[0]}></WaveWrapper>
      </div>
      
    );
}

export default AudioWave;