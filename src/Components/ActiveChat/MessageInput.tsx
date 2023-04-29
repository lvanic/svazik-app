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
import { inputState } from "../../Atoms/InputState";
import { languageState } from "../../Atoms/LanguageState";


export const MessageInput = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [inputHandler, setInputState] = useRecoilState(inputState)
    const [language, setLanguage] = useRecoilState(languageState)
    const socket = useRecoilValue(socketState);
    const inputRef = useRef<any>(null)

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    const MessageSend = (e: any) => {
        if (inputHandler.message != null) {
            if (inputHandler.isUpdate) {

                socket.emit('updateMessage', {
                    message: {
                        text: inputHandler.message,
                        id: inputHandler.idUpdateMessage
                    }
                });
                console.log('Update message');
            } else {
                socket.emit('addMessage', {
                    text: inputHandler.message,
                    room: {
                        id: activeChat.id,
                        name: activeChat.name
                    }
                });
            }
            setInputState({
                ...inputHandler,
                message: '',
                isUpdate: false,
                idUpdateMessage: -1
            })
        }
    }

    const SecureMessageSend = (e: any) => {
        if (inputHandler.message != null) {
            socket.emit('addMessageSecure', {
                text: inputHandler.message,
                room: {
                    id: activeChat.id,
                    name: activeChat.name
                }
            });

            setInputState({
                ...inputHandler,
                message: '',
                isUpdate: false,
                idUpdateMessage: -1
            })
        }
    }

    const MessageChange = (e: any) => {
        setInputState({ ...inputHandler, message: e.target.value })
    }
    return (
        <div className="message-input d-flex align-items-center justify-content-end" style={{ height: '50px' }}>
            <div className="d-flex w-100 h-100"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        MessageSend(e);
                    }
                }}>
                <Form.Control
                    ref={inputRef}
                    type="search"
                    placeholder={language.words?.TypeMessage}
                    className="me-2"
                    aria-label="Search"
                    value={inputHandler.message}
                    onChange={MessageChange}
                />
                <Button onClick={MessageSend} variant="success">{language.words?.Send}</Button>
                {
                    inputHandler.isUpdate ?
                        null
                        :
                        <DropdownButton className="h-100" id="dropdown-variants-success" variant="" drop="up" title="">
                            <Dropdown.Item onClick={SecureMessageSend}>{language.words?.SecretMessage}</Dropdown.Item>
                            <Dropdown.Item>{language.words?.PlannedMesssage}</Dropdown.Item>
                        </DropdownButton>
                }
            </div>
        </div>
    )
}