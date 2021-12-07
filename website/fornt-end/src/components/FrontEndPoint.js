import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";


const FrontEndPoint = () =>{
    //const test = useCallback(() => {
    //    //http.get(`/back/`, "hello this works");
    //    axios({
    //        method: 'post',
    //        url: 'http://localhost:8000/api/back/',
    //        data: {
    //            message: "labai gera z",
    //        }
    //    })
    //    .then(resp => {
    //        console.log(resp);
    //    })
    //    .catch(error => {
    //
    //    });
    //});

    const testPut = useCallback( async () => {
        let db = new Localbase('db');
        const data = await retrieveData(db);
        console.log(data[0]);
        const file = new File([data[0].blob], "r.webm", {type: "audio/webm"});
        console.log(file);
        let formData = new FormData();
        formData.append("session", 12345);
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
    
    const createSes = useCallback(() => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/api/csrf/',
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {});
    });

    return(
        <div>
            <button onClick = {createSes}>testCSRF</button>
            <button onClick = {testPut}>testPut</button>
        </div>
    );
}

export default FrontEndPoint;