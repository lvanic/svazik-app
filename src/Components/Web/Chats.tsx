import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navbar, Container, Offcanvas, Nav, NavDropdown, Button, Card, CardGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { IChat } from "../../Interfaces/IChat";
import { ChatCard } from "./ChatCard";
import './Chats.css'
import { CreateRoom } from "./CreateRoom";

export const Chats = (props: any) => {
    const navRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const modalClose = () => setModalOpen(false);
    const modalOpen = () => setModalOpen(true);
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
    const chatSelect = (id: number) => {
        props.setActiveChatId(id)
        if (window.innerWidth < 800) {
            handleClose()
        }
    }
    return (
        <>
            <Nav className="d-flex flex-row mh-100 is-nav-open" id="side-bar-handler" ref={navRef} style={{ height: '100vh' }}>
                <Nav.Item className="min-vh-100 w-100 p-0">
                    <Nav.Item id="chat-cards" className="p-0 border-0 h-100 pt-2 w-100">
                        <Form className="d-flex position-fixed" style={{ zIndex: '5' }}>
                            <Button variant="light" className="pt-1" onClick={modalOpen}>
                                +
                            </Button>
                            <Button variant="light" className="pt-1" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search-heart" viewBox="0 0 16 16">
                                    <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018Z"></path>
                                    <path d="M13 6.5a6.471 6.471 0 0 1-1.258 3.844c.04.03.078.062.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1.007 1.007 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5ZM6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"></path>
                                </svg>
                            </Button>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2 pr-0 rounded"
                                aria-label="Search"
                            />
                            <Button variant="light"
                                className="position-relative border-left-0 rounded-circle "
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
                                    <ChatCard key={item.id} title={item.name} description={item.description} onClick={() => chatSelect(item.id)}/>
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