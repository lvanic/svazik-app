import { useReducer, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { useRecoilState, useRecoilValue } from "recoil"
import { io } from "socket.io-client"
import { socketState } from "../../Atoms/SocketState"
import { languageState } from "../../Atoms/LanguageState"

export const CreateRoom = (props: any) => {
    const [language, setLanguage] = useRecoilState(languageState)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const socket = useRecoilValue(socketState);
    const createRoom = async () => {
        let object = {
            name: name,
            description: description,
            isCall: false
        }
        try {
            socket.emit('createRoom', object)
            props.handleClose()
        } catch { }
    }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{language.words?.CreateRoom}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Text>{language.words?.RoomName}</Form.Text>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <Form.Text>{language.words?.RoomDescription}</Form.Text>
                    <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    {language.words?.Close}
                </Button>
                <Button variant="primary" onClick={(e) => createRoom()}>
                    {language.words?.CreateRoom}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}