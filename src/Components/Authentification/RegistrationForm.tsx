import { useReducer, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../../models/UserModel';
import { UserReducer } from '../../Reducers/UserReducer';
import { RegistrationService } from '../../Services/AuthentificationService';

export const RegistrationForm = (props: any) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const Register = async () => {
        let result = await RegistrationService(username, email, password)
        if (result) {
            props.setIsAuthorization(true)
        }
        else {
            setAlertMessage('Пользователь не зарегистрирован')
        }
    }
    return (
        <Nav className='justify-content-center'>
            <Form className='w-25 p-3' >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                        Почта будет использоваться для входа в ваш аккаунт
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                {
                    alertMessage == '' ?
                        null
                        :
                        <Alert>
                            {alertMessage}
                        </Alert>
                }
                <Button variant="primary" type="button" onClick={Register}>
                    Зарегистрироваться
                </Button>
                <Button variant='link' type="button" onClick={() => props.setIsAuthorization(true)} className='mt-2 ml-3'>
                    Уже есть аккаунт?
                </Button>
            </Form>
        </Nav>
    );
}