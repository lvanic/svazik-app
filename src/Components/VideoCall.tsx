import { useReducer, useState, useRef, useEffect } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from 'socket.io-client';
import { socketState } from "../Atoms/SocketState";
export const VideoCall = (props: any) => {
    const [socket, setSocket] = useRecoilState(socketState);
    const [isVideo, setIsVideo] = useState(true);
    const [isAudio, setIsAudio] = useState(true);
    const [localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
    //generate and send SDP packet to the other peer
    const establishConnection = () => {
        const peerConnection = new RTCPeerConnection();
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        }
        peerConnection.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        }
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
            peerConnection.addTrack(track, localStream);
        });
        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);
            socket.emit('offer', offer);
        });
        socket.on('answer', (answer) => {
            peerConnection.setRemoteDescription(answer);
        });
        socket.on('candidate', (candidate) => {
            peerConnection.addIceCandidate(candidate);
        });
    }

    return (
        <Card className="container position-absolute d-flex" style={{ top: '20px' }}>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="outline-danger" onClick={() => { setIsVideo(!isVideo) }}>
                            {
                                isVideo ?
                                    <i className="fas fa-video"></i>
                                    :
                                    <i className="fas fa-video-slash"></i>
                            }
                        </Button>
                        <Button variant="outline-danger" onClick={() => { setIsAudio(!isAudio) }}>
                            {
                                isAudio ?
                                    <i className="fas fa-microphone"></i>
                                    :
                                    <i className="fas fa-microphone-slash"></i>
                            }
                        </Button>
                    </div>
                    <Button variant="outline-danger" onClick={() => { }}>
                        <i className="fas fa-phone-slash"></i>
                    </Button>
                </div>
                <div className="d-flex justify-content-center">
                    <video className="video" autoPlay muted ref={ref => { if (ref) { ref.srcObject = localStream } }}></video>
                    <video className="video" autoPlay ref={ref => { if (ref) { ref.srcObject = remoteStream } }}></video>
                </div>
            </Card.Body>
        </Card>
    );
} 