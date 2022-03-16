import Localbase from 'localbase';
import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import "../style/Wave.css";

import CustomMenu from "./CustomMenu.js";
import ConcatenateBlobs from "concatenateblobs";

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
    const db = new Localbase("db");

    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState({value: []});
    const [region, setRegion] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({x:0, y:0});
    const [showMenu, setMenu] = useState(false);
    const [option, setOption] = useState("");
    const [currentTrack, setCurrentTrack] = useState({});

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

          wavesurfertemp.on("seek", () => {
            //wavesurfertemp.clearRegions();
            if(showMenu == true){
              console.log("im here");
              setMenu(false);
            }
          });

          wavesurfertemp.enableDragSelection(
            {
              id: "selected",   
              start: 0,
              end: 1,
              loop: false,
              color: '#cccccc'
            }
          );

          wavesurfertemp.on("region-mouseenter", (region, mouseenter) => {
            console.log("region event");
            console.log(region);
            console.log(mouseenter);
            document.addEventListener("contextmenu", (event) => {
              event.preventDefault();
              setAnchorPoint({x: event.pageY, y: event.pageX});
              setCurrentTrack(region);
              setMenu(true);
            });
            //wavesurfertemp.clearRegions();
          });

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

    useEffect(() => {
      if(option != ""){
        console.log("in useEffect");
        console.log(currentTrack);
        switch(option){
          case "copy":

            break;
          case "cut":
            break;
          case "paste":
            break;
          case "delete":
            onDelete();
            break;
        }
      }

      setOption("");
      setMenu(false);
    }, [option]);

    const onCopy = useCallback(() => {

    });

    const onCut = useCallback(() => {

    });

    const onPaste = useCallback(() => {

    });

    const onDelete = useCallback(async () => {
      //https://mitya.uk/articles/concatenating-audio-pure-javascript
      //https://github.com/streamproc/MediaStreamRecorder
      const cT = currentTrack;
      const startTime = cT.start;
      const endTime = cT.end;
      
      let count = 0;
      let tc = 0;
      wavesurfer.value.forEach(track => {
        console.log(track);
        console.log(track.regions.list);
        if(track.regions.list.selected != undefined){
          tc = count
        }
        count++;
      });

      let tempBlob = props.audio.value[tc].rec.src;
      let dur = props.audio.value[tc].rec.duration;
      console.log(tempBlob);
      let blob = await fetch(tempBlob).then(r => r.blob());
      let recData = [];
      let newBlob = blob.slice( 0, startTime*10000, {type: "audio/webm;codecs=opus"});
      let newBlob2 = blob.slice(endTime*10000, dur, {type: "audio/webm;codecs=opus"});
      console.log(newBlob);
      console.log(newBlob2);
      recData.push(newBlob);
      recData.push(newBlob2);
      let joinedBlob = new Blob(recData, {type: "audio/webm;codecs=opus"});
      let link = URL.createObjectURL(joinedBlob);
      let audio = new Audio();
      audio.src = link;
      console.log(joinedBlob, audio);
      console.log(audio.duration);
      db.collection("audio").add(joinedBlob);
      let list = props.audio.value;
      list[tc] = {
        rec: audio.cloneNode(),
        dur: audio.duration
      };
      props.setAudio({value: list});
    });
    
    const onPlay = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.play();
      });
    });

    const onPause = useCallback(() =>{
      wavesurfer.value.forEach(track => {
        track.pause();
      });
    });

    const skipToFront = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.pause();
        track.seekTo(0);
        track.play();
      });
    });

    const onStop = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
      });
    });

    const skipToBack = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
        track.seekTo(1);
      });
    });

    return(
      <div>
        <CustomMenu showMenu = {showMenu} anchorPoint = {anchorPoint} setOption = {setOption}></CustomMenu>
        <div ref={waveformRef} id="wave"></div>
      </div>
      
    );
}

export default AudioWave;