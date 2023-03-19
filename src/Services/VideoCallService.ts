import { useReducer } from "react";
import { io } from "socket.io-client";
import { SocketReducer } from "../Reducers/SocketReducer";

//Establish a peer to peer connection between multiple clients

export const configRTC = {
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
}

//--------------------------------------------Caller--------------------------------------------

//Getting a local (own) media stream and setting it for transmission (getUserMediaStream)
// export const getUserMediaStream = async (videoRef: any) => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     videoRef.current.srcObject = stream;
//     return stream;
// }
//Offer to start video data transmission (createOffer)
export const createOffer = async (socket: any, stream: any) => {
    const peerConnection = new RTCPeerConnection(configRTC);
    stream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, stream);
    });
    peerConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);
    return peerConnection;
}
//Getting your SDP object and passing it through the signaling mechanism (SDP)

//Receiving your Ice candidate objects and passing them through the signaling mechanism (Ice candidate)
export const handleCandidate = async (candidate: any, peerConnection: any) => {
    await peerConnection.addIceCandidate(candidate);
}
//Receiving a remote (foreign) media stream and displaying it on the screen (onAddStream)
export const handleAddStream = (event: any, videoRef: any) => {
    videoRef.current.srcObject = event.streams[0];
}

//--------------------------------------------Callee--------------------------------------------
//Getting a local (own) media stream and setting it for transmission (getUserMediaStream)

//Receive an offer to start a video data transfer and create an answer (createAnswer)
export const createAnswer = async (socket: any, stream: any, offer: any) => {
    const peerConnection = new RTCPeerConnection(configRTC);
    stream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, stream);
    });
    peerConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
    }
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
    return peerConnection;
}
//Getting your SDP object and passing it through the signaling mechanism (SDP)
export const sendSDP = async (socket: any, peerConnection: any) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);
}