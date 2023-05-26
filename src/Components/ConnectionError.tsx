import { Offcanvas, Spinner } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { socketState } from "../Atoms/SocketState"
import { useEffect } from "react"
import { joinRoom } from "../Services/ChatServices"
import { activeChatState } from "../Atoms/ActiveChat"

export const ConnectionError = (props: any) => {
    const [socket, setSocket] = useRecoilState(socketState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)

    useEffect(() => {
        const connect = setInterval(() => {
            socket.connect()
            console.log('socket is disconnect:', socket.disconnected);
        }, 2000)
        return () => {
            joinRoom(activeChat.id, socket, 1)
            clearInterval(connect)
        }
    }, [socket, activeChat.id])

    return (
        <Offcanvas show={props.show} placement="top">
            <Offcanvas.Header className="d-flex justify-content-start">
                <Offcanvas.Title className="me-3">Error: disconnecting web socket, please wait or reload the page</Offcanvas.Title>
                <Spinner />
            </Offcanvas.Header>
        </Offcanvas>
    )
}