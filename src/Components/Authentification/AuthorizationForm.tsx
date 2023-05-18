import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { userState } from '../../Atoms/UserState';
import { useRecoilState } from 'recoil';
import { AuthorizationService } from '../../Services/AuthentificationService';
import { socketState } from '../../Atoms/SocketState';
import { io } from 'socket.io-client';
import { Alert } from 'react-bootstrap';
import { getError } from '../../Services/GetError';
import { languageState } from '../../Atoms/LanguageState';

export const AuthorizationForm = (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const [socket, setSocket] = useRecoilState(socketState);
    const [language, setLanguage] = useRecoilState(languageState);

    const Authorization = async (e: any) => {
        if (email != '' && password != '') {
            const userHandler = await AuthorizationService(email, password);
            if (userHandler.isAuthorized) {
                setSocket(io(`${process.env.REACT_APP_SERVER_NAME}`, {
                    // transports: ['websocket'],
                    extraHeaders: {
                        authorization: `${localStorage.getItem('access_token')}`
                    }
                }).connect());
                setUser(userHandler);
            }
            else {
                setErrorMessage(getError.userNotFound)
            }
        } else {
            setErrorMessage(getError.applyAllFields)
        }
    }

    return (
        <Nav className='justify-content-center'>
            <Form className='w-25-sm-  p-3'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{language.words?.Email}</Form.Label>
                    <Form.Control type="email" placeholder={language.words?.EnterEmail} id='auth-email' onChange={(e) => setEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                        {language.words?.ThirdPersons}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{language.words?.Password}</Form.Label>
                    <Form.Control type="password" placeholder={language.words?.EnterPassword} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="button" className='mt-2' onClick={Authorization}>
                    {language.words?.LogIn}
                </Button>
                {
                    errorMessage != '' ?
                        <Alert variant='danger'>
                            {errorMessage}
                        </Alert>
                        :
                        null
                }
                <Button variant='link' type="button" onClick={() => props.setIsAuthorization(false)} className='mt-2 ml-3'>
                    {language.words?.CreateAccount}
                </Button>
            </Form>
        </Nav>
    );
}
