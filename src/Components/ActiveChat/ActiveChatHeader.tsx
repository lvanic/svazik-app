import { useEffect, useReducer, useRef, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Form, Offcanvas } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { ChatModel } from "../../models/ChatModel";
import './ChatHeader.css'

export const ActiveChatHeader = (props: any) => {
    const [activeChat, setActiveChat] = useRecoilState(activeChatState);
    const [show, setShow] = useState(false)
    console.log(activeChat);
    const openHandler = (e: any) => {
        props.setSideBarOpen(true)
    }
    const StartCall = async (e: any) => {
        props.StartCall(e);
    }
    useEffect(() => {
        return (() => {
            props.setIsModalOpen(false)
        })
    }, [])
    const handleClose = (e: any) => {
        setShow(false)
    }
    const handleOpen = (e: any) => {
        setShow(true)
    }
    return (
        <>
            <Navbar bg="light" expand="lg" className="border d-dlex justify-content-start" id="chat-header">
                {
                    props.isSideBarOpen ?
                        null
                        :
                        <Button variant="light" className="button-change-theme" onClick={openHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                            </svg>
                        </Button>
                }
                <Nav onClick={handleOpen}>
                    <Nav className="d-flex flex-column">
                        <Navbar.Brand className="ms-5 text-change-theme">{activeChat.name}</Navbar.Brand>
                    </Nav>
                </Nav>
                <Nav className="me-auto">
                </Nav>
                <Button variant="light" className="me-5 button-change-theme" onClick={StartCall}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                    </svg>
                </Button>
            </Navbar>

            <Offcanvas show={show} placement="end" onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{activeChat.name}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>{activeChat.description}</div>
                    {activeChat.users.map(user => {
                        if (activeChat.admins.find(x => x.email == user.email)) {
                            return (

                                <div>
                                    {user.username}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-patch-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                        <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                                    </svg>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div>{user.username}</div>
                            )
                        }
                    })}

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}