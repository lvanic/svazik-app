import { useReducer, useState, useRef, useEffect } from "react"
import { CreateOffer, CreateAnswer, configRTC } from "../Services/VideoCallService";
import io from 'socket.io-client';
import { SocketReducer } from "../Reducers/SocketReducer";
export const VideoCall = () => {
    const [socket, dispatch] = useReducer(SocketReducer, io(`${process.env.REACT_APP_SERVER_NAME}`, {
        extraHeaders: {
            authorization: `${localStorage.getItem('access_token')}`
        }
    }));

    const [isVideo, setIsVideo] = useState(false);
    const [isAudio, setIsAudio] = useState(false);
    const videoRef = useRef(null);

    const fun = async () => {

        console.log(socket);

    }
    useEffect(() => {
        try {
            fun()
        } catch (error) {
            console.log(error);

        }

        socket.on('call', (data) => {
            alert(data)
        })
    }, [])


    useEffect(() => {
        getVideo();
    }, [videoRef, isVideo, isAudio]);

    const callRequest = () => {

        console.log(socket)
        socket.emit('call', 'Egor');
    }
    const getVideo = () => {

        navigator.mediaDevices
            .getUserMedia({
                video: isVideo,
                audio: isAudio
            })
            .then(stream => {
                const video: any = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
    };

    return (
        <div className="container">
            <div className="webcam-video">
                <video ref={videoRef}
                    className="player"
                />
            </div>
            <button onClick={() => setIsAudio(!isAudio)}>Micro</button>
            <button onClick={() => setIsVideo(!isVideo)}>Video</button>

            <button onClick={() => {
                callRequest()
            }}>Call</button>
        </div>
    );
} 