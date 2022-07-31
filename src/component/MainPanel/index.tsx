import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import {LoginPanel} from "../LoginPanel";
import {RegisterPanel} from "../RegisterPanel";
import {Home} from "../Home";
import {getUserId} from "../../utils/user";
import {retrieveMessage} from "../../net";
import {Message, Resp} from "../../net/interfaces";



export default function MainPanel() {

    const navigate = useNavigate()


    useEffect(() => {
        if (getUserId() != null) {
            navigate('/home');
        } else {
            navigate('/login')
        }
    }, [])




    return (
        <div style={{width: '100%', height: '100%'}}>
            <Routes>
                <Route path={'login'} element={<LoginPanel/>}/>
                <Route path={'register'} element={<RegisterPanel/>}/>
                <Route path={'home/*'} element={<Home/>}/>
            </Routes>
        </div>
    )

}