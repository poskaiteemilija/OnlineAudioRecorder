import React, { useCallback, useState, useEffect } from 'react';

import axios from 'axios';
import Localbase from 'localbase'; //local storage database api for IndexDB

//the code in record button is referenced from sample code on https://www.npmjs.com/package/audio-react-recorder    

let RecordButton = () =>{
    //commented for further editing

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


    //const [audioState, setAudio] = useState();

    console.log("rerender");
    return(
        <div className="recordButton"> 

        </div>
    );
}




export default RecordButton;