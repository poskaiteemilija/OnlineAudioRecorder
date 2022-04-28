import react, { useCallback, useState } from 'react';
import audioEncoder from 'audio-encoder';
import Localbase from 'localbase';
import "../style/Playback.css";

const Import = (props) => {
    const db = new Localbase("db");

    //const [lastUplaod, setLastUpload] = useState({last: []});
    const handleEvent = useCallback((event) =>{
        const fileList = event.target.files;
        //console.log(fileList)
        if(fileList.length !== 0){
            console.log(fileList)
            for(let i = 0; i<fileList.length; i++) {
                if(fileList[i].type.includes("mpeg") || fileList[i].type.includes("mp3") || fileList[i].type.includes("webm") || fileList[i].type.includes("wav")){
                    console.log("yess")
                    const fileReader = new FileReader();
                    const audioCont = new AudioContext();
                    fileReader.onloadend = () => {
                        const arrayBuffer = fileReader.result;
                        audioCont.decodeAudioData(arrayBuffer, (audioBuffer) => {
                            const dur = audioBuffer.duration;
                            audioEncoder(audioBuffer, 0, null, function onComplete(finalBlob){
                                console.log(finalBlob);
                                /*let audio = new Audio();
                                const blobURL = URL.createObjectURL(finalBlob);
                                audio.src = blobURL;*/
                                //audio.play();

                                
                                db.collection("audio").add({count: props.trackCount.value.length+1, blob: finalBlob, volume: 1, duration: dur*1000}).then(() =>{
                                    props.setVersionControl(true);
                                    props.setUpdateList(true);
                                    let nl = props.trackCount.value;
                                    nl.push(0);
                                    props.setTrackCount({value: nl});
                                });
                            });
                        });
                    }

                    fileReader.readAsArrayBuffer(fileList[i])
                }
                else{
                    console.log("sorry nope")
                }
    
            }
        }
        /**/

    });

    return(<button id="sound-import" className="function-button" onClick={() => {document.getElementById("import-but").click()}} title="Import">
        <img src={require("../style/assets/upload.png").default} alt="Import" ></img>
        <input type="file" id="import-but" name="import-but" onChange={handleEvent} accept='.mp3, .wav, .webm'></input>
    </button>)
}

export default Import;