import { useReducer } from "react";
import { io } from "socket.io-client";
import { SocketReducer } from "../Reducers/SocketReducer";

//Establish a peer to peer connection between multiple clients


export async function CreateAnswer(videoRef: MediaStream) {
    var pc = new RTCPeerConnection();//создаем connection
    var peerConnectionConfig = { //конфигурация ice server
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    }
    pc.onicecandidate = function (event) {
        console.log('new ice candidate', event.candidate);

        if (event.candidate !== null) {
            //отправляем ice пакеты
        }
    };


    // pc.setRemoteDescription(new RTCSessionDescription(data.offer), function () {
    //     pc.createAnswer(function (answer) {
    //         pc.setLocalDescription(answer, function () {
    //             //отправляем ответ
    //         }, e => console.log(e));
    //     }, e => console.log(e));
    // }, e => console.log(e));
}
export const configRTC = {
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
}