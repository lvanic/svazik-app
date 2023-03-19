import { useReducer, useState, useRef, useEffect } from "react"
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import io from 'socket.io-client';
import { SocketReducer } from "../Reducers/SocketReducer";
export const VideoCall = (props: any) => {

    return (
        <Card className="container position-absolute d-flex" style={{ top: '20px' }}>
            <Card.Body className="webcam-video">
                <div>
                     <video
                    ref={props.webcamRef}
                    className="player"
                    width={"300px"}
                />
                <audio ref={props.micRef}/>
                </div>
               
            </Card.Body>
            <Card.Footer>
                <Button onClick={() => props.setIsAudio(!props.isAudio)}>Micro</Button>
                <Button onClick={() => props.setIsVideo(!props.isVideo)}>Video</Button>
            </Card.Footer>
        </Card>
    );
} 