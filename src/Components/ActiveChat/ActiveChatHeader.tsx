import { useEffect, useReducer, useRef, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Form } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { ChatModel } from "../../models/ChatModel";
import './ChatHeader.css'

export const ActiveChatHeader = (props: any) => {
    const [activeChat, setActiveChar] = useRecoilState(activeChatState);
    const openHandler = () => {
        props.setSideBarOpen(true)
    }
    const StartCall = async () => {
        props.StartCall();
    }
    return (
        <Navbar bg="light" expand="lg" className="border d-dlex justify-content-start" id="chat-header">
            {
                props.isSideBarOpen ?
                    null
                    :
                    <Button variant="light" onClick={openHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                        </svg>
                    </Button>
            }
            <Nav>
                {/* <img src="../img/yahorka.jpg" style={{width:'80px', height:'80px'}}/> */}
                <Nav className="d-flex flex-column">
                    <Navbar.Brand className="ms-5">{activeChat.name}</Navbar.Brand>
                    {/* <Navbar.Text className="ms-5 p-0">{activeChat}</Navbar.Text> */}
                </Nav>
            </Nav>
            <Nav className="me-auto">

            </Nav>
            <Button variant="light" className="me-5" onClick={StartCall}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                </svg>
            </Button>
        </Navbar>
    );
}