import React from 'react';
import { FormEventHandler, useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { userState } from '../../Atoms/UserState';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { AuthorizationService, UserService } from '../../Services/AuthentificationService';
import { socketState } from '../../Atoms/SocketState';
import { io } from 'socket.io-client';

export const AuthorizationForm = (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const [socket, setSocket] = useRecoilState(socketState)
    const navigator = useNavigate();

    const Authorization = async () => {
        const userHandler = await AuthorizationService(email, password);
        if (userHandler.isAuthorized) {
            setUser(userHandler);
            navigator('/web')
        }
    }

    return (
        <Nav className='justify-content-center'>
            <Form className='w-25-sm-  p-3'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" id='auth-email' onChange={(e) => setEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                        Мы не передаем вашу почту 3 лицам
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="button" className='mt-2' onClick={Authorization}>
                    Войти
                </Button>
                <Button variant='link' type="button" onClick={() => props.setIsAuthorization(false)} className='mt-2 ml-3'>
                    Создать аккаунт
                </Button>
            </Form>
        </Nav>
    );
}
