import { useReducer, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { io } from "socket.io-client"
import { SocketReducer } from "../../Reducers/SocketReducer"

export const CreateRoom = (props: any) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [socket, dispatch] = useReducer(SocketReducer, io(`${process.env.REACT_APP_SERVER_NAME}`, {
        extraHeaders: {
            authorization: `${localStorage.getItem('access_token')}`
        }
    }));
    const createRoom = async () => {
        console.log(socket)
        socket.on('createRoom', (data) => console.log(data));
        
        let object = {
            name: name,
            description: description
        }
        try {
            socket.emit('createRoom', object)
        } catch {
            

        }

    }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Text>Введите имя комнаты</Form.Text>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <Form.Text>Введите описание</Form.Text>
                    <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="secondary" onClick={props.handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={() => createRoom()}>
                    Создать
                </Button>
            </Modal.Footer>
        </Modal>
    )
}