import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";



const FrontEndPoint = () =>{
    const testPut = useCallback( async () => {
        let db = new Localbase('db');
        const data = await retrieveData(db);
        console.log(data[0]);
        const file = new File([data[0].blob], "r.webm", {type: "audio/webm"});
        console.log(file);
        let formData = new FormData();
        formData.append("session", localStorage.getItem("sessionID"));
        formData.append("audio_file", file);

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/upload/',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {});
    });

    const testGet = useCallback(() => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/api/upload/'
        })
        .then(resp =>{
            console.log(resp);
        })
        .catch(error => {})
    });


    return(
        <div>
            <button onClick= {testGet}>testGet</button>
            <button onClick = {testPut}>testPut</button>
        </div>
    );
}

export default FrontEndPoint;