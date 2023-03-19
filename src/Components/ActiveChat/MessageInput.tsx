import { useReducer, useState } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { IMessage } from "../../Interfaces/IMessage";
import { SocketReducer } from "../../Reducers/SocketReducer";

//a component that sends an addMessage request with a text over a web socket
export const MessageInput = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [message, setMessage] = useState('');
    const socket = useRecoilValue(socketState);

    const MessageSend = () => {
        if (message != '') {
            socket.emit('addMessage', {
                text: message,
                room: {
                    id: activeChat.id
                }
            });
            setMessage('')
        }
    }
    const SecureMessageSend = () => {
        if (message != '') {
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
        <div className="message-input d-flex align-items-center justify-content-end" style={{height:'50px'}}>
            {/* <input className="w-75" type="text" value={message} placeholder="Type a message..." onChange={MessageChange} /> */}
            <Form className="d-flex w-75 h-100">
                <Form.Control
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
            </Form>

        </div>
    )
}