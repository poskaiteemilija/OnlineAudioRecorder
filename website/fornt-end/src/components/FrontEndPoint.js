import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";


const FrontEndPoint = () =>{
    //const http = axios.create({
    //    baseURL: "http://localhost:8000/api",
    //    headers: {
    //        "Content-type": "application/json"
    //    }
    //});

    const test = useCallback(() => {
        //http.get(`/back/`, "hello this works");
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/back/',
            data: {
                message: "labai gera z",
            }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {
    
        });
    });

    const testPut = useCallback( async () => {
        let db = new Localbase('db');
        const data = await retrieveData(db);
        console.log(data[0]);
        let formData = new FormData();
        formData.append("session", 12345);
        formData.append("audio_file", data[0]);
        
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/back/',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {});
    });
    

    return(
        <div>
            <button onClick = {test}>test</button>
            <button onClick = {testPut}>testPut</button>
        </div>
    );
}

export default FrontEndPoint;