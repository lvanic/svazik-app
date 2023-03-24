import { useEffect, useReducer, useRef, useState } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { IMessage } from "../../Interfaces/IMessage";
import { ValidateMessage } from "../../Utils/ValidateMessage";

//a component that sends an addMessage request with a text over a web socket
export const MessageInput = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [message, setMessage] = useState('');
    const socket = useRecoilValue(socketState);
    const inputRef = useRef<any>(null)
    useEffect(() => {
        console.log(inputRef.current);
        
        inputRef.current.focus();
    }, [])
    const MessageSend = (e: any) => {
        if (message != null) {
            socket.emit('addMessage', {
                text: message,
                room: {
                    id: activeChat.id
                }
            });
            setMessage('')
        }
    }
    const SecureMessageSend = (e: any) => {
        if (message != null) {
            socket.emit('addMessageSecure', {
                text: message,
                room: {
                    id: activeChat.id
                }
            });
            setMessage('')
        }
    }
    const MessageChange = (e: any) => {
        setMessage(e.target.value);
    }
    return (
        <div className="message-input d-flex align-items-center justify-content-end" style={{ height: '50px' }}>
            {/* <input className="w-75" type="text" value={message} placeholder="Type a message..." onChange={MessageChange} /> */}
            <div className="d-flex w-100 h-100"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        MessageSend(e);
                    }
                }}
            >
                <Form.Control
                    ref={inputRef}
                    type="search"
                    placeholder="Type a message..."
                    className="me-2"
                    aria-label="Search"
                    value={message}
                    onChange={MessageChange}
                />
                <Button onClick={MessageSend} variant="success">Send</Button>
                <DropdownButton className="h-100" id="dropdown-variants-success" variant="" drop="up" title="">
                    <Dropdown.Item onClick={SecureMessageSend}>Секретное сообщение</Dropdown.Item>
                    <Dropdown.Item>Запланнированное сообщение</Dropdown.Item>
                </DropdownButton>
            </div>

        </div>
    )
}