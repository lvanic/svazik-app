import { useEffect, useReducer, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../../models/UserModel';
import { RegistrationService } from '../../Services/AuthentificationService';
import { getError } from '../../Services/GetError';
import { useRecoilState } from 'recoil';
import { languageState } from '../../Atoms/LanguageState';

export const RegistrationForm = (props: any) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [canRegister, setCanRegister] = useState(false);
    const [language, setLanguage] = useRecoilState(languageState)

    useEffect(() => {
        if (password.trim() != '' && username.trim() != '' && email.trim() != '') {
            setCanRegister(true)
        }
        else {
            setCanRegister(false)
        }
    }, [password, username, email])

    useEffect(() => {
        if (confirmPassword != password) {
            setAlertMessage('Пароли не совпадают')
        }
        else {
            setAlertMessage('')
        }
    }, [confirmPassword, password])
    const Register = async () => {
        if (canRegister) {
            let result = await RegistrationService(username, email, password)
            if (result) {
                props.setIsAuthorization(true)
            }
            else {
                setAlertMessage(getError.registerNotSuscess)
            }
        }
        else {
            setAlertMessage(getError.applyAllFields)
        }
    }

    const passwordChange = (e: any) => {
        setPassword(e.target.value)
    }
    const confirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value)
    }
    const emailChange = (e: any) => {
        setEmail(e.target.value)
    }
    const usernameChange = (e: any) => {
        setUsername(e.target.value)
    }
    const selectNewsUpdate = (e: any) => {
        //рано еще
    }
    return (
        <Nav className='justify-content-center'>
            <Form className='' >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{language.words?.Username}</Form.Label>
                    <Form.Control type="text" placeholder={language.words?.EnterUsername} onChange={usernameChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={emailChange} />
                    <Form.Text className="text-muted">
                        {language.words?.EmailWillUse}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{language.words?.Password}</Form.Label>
                    <Form.Control type="password" placeholder={language.words?.EnterPassword} onChange={passwordChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{language.words?.RepeatPassword}</Form.Label>
                    <Form.Control type="password" placeholder={language.words?.EnterPassword} onChange={confirmPasswordChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check onClick={selectNewsUpdate} type="checkbox" label={language.words?.SubscribeUpdates} />
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
                    {language.words?.Register}
                </Button>
                <Button variant='link' type="button" onClick={() => props.setIsAuthorization(true)} className='mt-2 ml-3'>
                    {language.words?.AlreadyAccount}
                </Button>
            </Form>
        </Nav>
    );
}