import React, { useCallback, useState, useEffect } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'; //audio recording npm library
import ReactHowler from 'react-howler';
import Playback from './Playback';
import axios from 'axios';

//the code in record button is referenced from sample code on https://www.npmjs.com/package/audio-react-recorder    

let RecordButton = () =>{
    const [recState, setRecord] = useState("");
    //const [audioState, setAudio] = useState();

    const onStop = useCallback((audioData) => {
        console.log('audio', audioData, audioData.url);
        localStorage.setItem('bloblink', audioData.url);
    });

    /*useEffect(() => {
        setAudio(localStorage.getItem('bloblink'));
        console.log(audioState);
    });*/

    /*useEffect(() => {
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/session',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET, POST PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': true,
            },
            data: {
                session: '',
                audiourl: localStorage.getItem('bloblink')
            }
        }).then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }, [localStorage.getItem('bloblink')]); */

    return(
        <div className="recordButton">
            
            <AudioReactRecorder state={ recState } onStop={ onStop }/>
            <button onClick={() => setRecord(RecordState.START)}>Record</button>
            <button onClick={() => setRecord(RecordState.STOP)}>Stop</button>
            <Playback newRec={localStorage.getItem('bloblink')} />
        </div>
    );
}



export default RecordButton;