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
import { Settings } from "../Settings/Settings";

export const Chats = (props: any) => {
    const navRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [socket, setSocket] = useRecoilState(socketState)

    const modalClose = () => setModalOpen(false);
    const modalOpen = () => setModalOpen(true);
    const settingsClose = () => setSettingsOpen(false);
    const settingsOpen = () => setSettingsOpen(true);

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (event.currentTarget.scrollTop > event.currentTarget.scrollHeight - event.currentTarget.clientHeight) {
            props.setPage(props.page + 1)
        }
    };

    useEffect(() => {
        let wrapper: any = navRef.current;
        wrapper?.classList.toggle('is-nav-open')
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
                            {/* new room */}
                            <Button
                                variant="light"
                                className="pt-1 button-change-color"
                                onClick={modalOpen}
                                style={{ transition: 'none' }}>
                                +
                            </Button>
                            <Search />
                            {/* settings */}
                            <Button variant="light"
                                className="position-relative border-left-0 pt-0 button-change-color settings-icon"
                                onClick={settingsOpen}
                                style={{ transition: 'none' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                </svg>
                            </Button>
                        </Form>
                        <CardGroup className="d-flex flex-column" style={{ marginTop: '40px' }}>
                            {
                                props.chatList.map((item: IChat) => (
                                    <ChatCard key={item.id}
                                        title={item.name}
                                        description={item.description}
                                        onClick={() => chatSelect(item.id, item.name, item.description)}
                                    />
                                ))
                            }
                        </CardGroup>
                    </Nav.Item>
                </Nav.Item>
            </Nav>
            <CreateRoom show={isModalOpen} handleClose={modalClose} />
            <Settings show={isSettingsOpen} handleClose={settingsClose} />
        </>
    );
}