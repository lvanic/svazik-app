import { useReducer, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { useRecoilState, useRecoilValue } from "recoil"
import { io } from "socket.io-client"
import { socketState } from "../../Atoms/SocketState"
import { languageState } from "../../Atoms/LanguageState"
import "./CreateRoom.css"
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
            if (name != '' && description != '') {
                socket.emit('createRoom', object)
                setName('')
                setDescription('')
                props.handleClose()
            }else{
                throw Error('Заполните все поля')
            }
        } catch { }
    }
    return (
        <Modal show={props.show} onHide={props.handleClose} className="create-room-modal-content">
            <div className="create-room-modal">
                <Modal.Header className="create-room-modal-header">
                    <Modal.Title className="text-color-change">{language.words?.CreateRoom}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-room-modal-body">
                    <Form>
                        <Form.Text className="text-color-change">{language.words?.RoomName}</Form.Text>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <Form.Text className="text-color-change">{language.words?.RoomDescription}</Form.Text>
                        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form>
                </Modal.Body>
                <Modal.Footer className="create-room-modal-footer">
                    <Button variant="secondary" onClick={props.handleClose}>
                        {language.words?.Close}
                    </Button>
                    <Button variant="primary" className="create-room-create" onClick={(e) => createRoom()}>
                        {language.words?.CreateRoom}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    )
}