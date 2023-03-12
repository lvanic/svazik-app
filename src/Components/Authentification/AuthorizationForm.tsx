import { FormEventHandler, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { AuthorizationRequest } from '../../DTO/AuthorizationRequest';
import { UserModel } from '../../models/UserModel';
import { UserReducer } from '../../Reducers/UserReducer';
import { AuthorizationService } from '../../Services/AuthentificationService';

export const AuthorizationForm = (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const initialState = new UserModel('', '', false);
    const navigator = useNavigate();
    const [user, dispatch] = useReducer(UserReducer, initialState);
    useEffect(() => {
        console.log(user);
        if (user.isAuthorized) {
            navigator('/web')
        }
    }, [user])
    const Authorization = async () => {
        dispatch({
            type: 'SET_USER',
            payload: await AuthorizationService(email, password)
        })
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