import React, { useCallback } from "react";
import axios from "axios";



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
    

    return(
        <button onClick = {test()}>test</button>
    );
}

export default FrontEndPoint;