import react from 'react';
import {useEffect, useCallback, useState} from "react";
import "../style/CustomMenu.css";

const CustomMenu = (props) => {
    //this class is created with reference to this article: https://blog.logrocket.com/creating-context-menu-react/

    if(props.showMenu){
        const items = ["Copy", "Cut", "Paste", "Delete", "silence"];
        return(
            <ul id='contextMenu' style={{top: props.anchorPoint.x, left: props.anchorPoint.y}}>
                <li key="copy" onClick={() => props.setOption("copy")}>Copy</li>
                <li key="cut" onClick={() => props.setOption("cut")}>Cut</li>
                <li key="paste" onClick={() => props.setOption("paste")}>Paste</li>
                <li key="delete" onClick={() => props.setOption("delete")}>Delete</li>
                <li key="silence" onClick={() => props.setOption("silence")}>Silence</li>
            </ul>
        );
    }

    return(
        <></>
    );
}

export default CustomMenu