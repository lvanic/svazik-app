import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navbar, Container, Offcanvas, Nav, NavDropdown, Button, Card, CardGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { IChat } from "../../Interfaces/IChat";
import { ChatCard } from "./ChatCard";
import './Chats.css'
import { CreateRoom } from "./CreateRoom";
import { Search } from "./Search";

export const Chats = (props: any) => {
    const navRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [socket, setSocket] = useRecoilState(socketState)
    const modalClose = () => setModalOpen(false);
    const modalOpen = () => setModalOpen(true);

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (event.currentTarget.scrollTop > event.currentTarget.scrollHeight - event.currentTarget.clientHeight) {
            props.setPage(props.page + 1)
        }
    };

    useEffect(() => {
        let wrapper: any = navRef.current;
        wrapper?.classList.toggle('is-nav-open')
        // alert(activeChat.id)
    }, [props.isSideBarOpen])

    useEffect(() => {
        let wrapper: any = navRef.current;
        wrapper?.classList.add('is-nav-open')
    }, [])

    const handleClose = () => {
        props.setSideBarOpen(false)
    }

    const chatSelect = (_id: number, title: string, description: string) => {
        setActiveChat({ ...activeChat, id: _id, name: title, description: description })
        if (window.innerWidth < 800) {//CSS
            handleClose()
        }
    }
     
    return (
        <>
            <Nav onScroll={handleScroll} className="d-flex flex-row mh-100 is-nav-open" id="side-bar-handler" ref={navRef} style={{ height: '100vh' }}>
                <Nav.Item className="min-vh-100 w-100 p-0">
                    <Nav.Item id="chat-cards" className="p-0 border-0 h-100 pt-2 w-100">
                        <Form className="d-flex position-fixed" style={{ zIndex: '5' }}>
                            <Button variant="light" className="pt-1" onClick={modalOpen}>
                                +
                            </Button>
                            <Search />
                            <Button variant="light"
                                className="position-relative border-left-0 "
                                id="open-chat-list"
                                onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg>
                            </Button>
                        </Form>
                        <CardGroup className="d-flex flex-column" style={{ marginTop: '40px' }}>
                            {
                                props.chatList.map((item: IChat) => (
                                    <ChatCard key={item.id} title={item.name} description={item.description} onClick={() => chatSelect(item.id, item.name, item.description)} />
                                ))
                            }
                        </CardGroup>
                    </Nav.Item>
                </Nav.Item>
            </Nav>
            <CreateRoom show={isModalOpen} handleClose={modalClose} />
        </>
    );
}