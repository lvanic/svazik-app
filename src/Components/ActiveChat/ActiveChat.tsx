import { ActiveChatHeader } from "./ActiveChatHeader";
import { MessageArea } from "./MessageArea";
import './ActiveChat.css'
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { useEffect, useRef, useState } from "react";
import { socketState } from "../../Atoms/SocketState";
import { VideoCall } from "../VideoCall";

export const ActiveChat = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState);
    const [isVideo, setIsVideo] = useState(false);
    const [isAudio, setIsAudio] = useState(false);

    const webcamRef = useRef<HTMLVideoElement>(null);
    const micRef = useRef<HTMLVideoElement>(null);
    const screenShareRef = useRef(null);
    
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [isCallStarted, setIsCallStarted] = useState(false);
    useEffect(() => {
        if (isCallStarted) {
            getVideo();
        }
    }, [isVideo, isAudio, isCallStarted]);


    const StartCall = async () => {
        setIsCallStarted(true);
    }

    const getVideo = () => {

        //record audio and video from a webcam into localStream


        // navigator.mediaDevices
        //     .getUserMedia({
        //         video: isVideo,
        //         audio: isAudio,
        //     })
        //     .then(stream => {
        //         if (!isAudio && !isVideo) {
        //             stream.getTracks().forEach(track => track.stop());
        //         }
        //         else {
        //             const video: any = videoRef.current;
        //             video.srcObject = stream;
        //             setLocalStream(stream)
        //             video.play();
        //         }
        //     })
        //     .catch(err => {
        //         console.error("error:", err);
        //     });

    };


    return (
        <div className="chat-place-holder">
            {
                activeChat.id != -1 ?
                    <ActiveChatHeader StartCall={StartCall} isSideBarOpen={props.isSideBarOpen} setSideBarOpen={props.setSideBarOpen} />
                    :
                    null
            }
            <MessageArea />
            {
                isCallStarted ?
                    <VideoCall
                        webcamRef={webcamRef}
                        micRef={micRef}
                        setIsAudio={setIsAudio}
                        setIsVideo={setIsVideo}
                        isVideo={isVideo}
                        isAudio={isAudio}
                        localStream={localStream}
                    />
                    :
                    null
            }
        </div>
    );
}