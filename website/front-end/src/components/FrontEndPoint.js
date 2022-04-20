import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";


export const putData = async (filename, format, setDownload) => {
    let db = new Localbase('db');
    const data = await retrieveData(db);
    console.log(data);
    const ses = localStorage.getItem("sessionID");
    let formData = new FormData();
    
    const prevRec = localStorage.getItem("previousRec");
    if(prevRec !== ""){
        await axios({
            method: "delete",
            url: prevRec,
            withCredentials: true,
            xsrfHeaderName: 'X-CSRFToken',
            xsrfCookieName: 'csrftoken',
        }).then(r => {
            console.log(r);
        });
    }
    
    for(let i = 0; i<data.length; i++){
        console.log(data[i]);
        let file = new File([""], filename);
        if(data[i].blob.type === "audio/x-wav"){
            console.log(data[i].blob, "THIS IS WAV")
            file = new File([data[i].blob], ses+"_"+data[i].count+".wav", {type: "audio/x-wav"});
        }
        else{
            console.log(data[i].blob, "THIS IS WEBM")
            file = new File([data[i].blob.blob], ses+"_"+data[i].count+".webm", {type: "audio/webm"});
        }
        console.log(file);
        formData.append("audio_file", file);
        formData.append("session", localStorage.getItem("sessionID"));

        let v = 1;
        if(data[i].volume == 1){
            v = 0;
        }
        else if(data[i].volume == 0){
            v = 100
        }
        else{
            v = 30-(30*data[i].volume);
        }
        
        formData.append("volume", v);
        await axios({
            method: 'post',
            url: 'http://localhost:8000/api/upload/',        //change to this url when running in docker http://127.0.0.1/api/upload/
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {
            return error;
        });
        console.log("sent 1");
    }
    console.log("after both requests");
    getData(filename, format, setDownload);
}

export const getData = (filename, format, setDownload) => {
    //TO DO implement data check before sending it to the server
    console.log("im already doing this");
    const ses = localStorage.getItem('sessionID');
    let form = new FormData();
    form.append('session', ses);
    form.append('format', format);
    axios({
        method: 'post',
        url: 'http://localhost:8000/api/export',     //change to this url when running in docker http://127.0.0.1/api/export
        data: form,
    })
    .then(resp =>{
        console.log(resp.data);
        /*setDownload({
            url: resp.data,
            name: filename+"."+format
        });*/
        localStorage.setItem("previousRec", "http://localhost:8000/api/delete/"+resp.data.id);
        axios({
            method: 'get',
            url: "http://localhost:8000"+resp.data.link,
            responseType: 'blob'
        })
        .then( r => {
            console.log(r);
            setDownload({
                resp: r.data,
                name: filename+"."+format,
                contentType: "audio/"+format
            });
        })
    })
    .catch(error => {})
}
