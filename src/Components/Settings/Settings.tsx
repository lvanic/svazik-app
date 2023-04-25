import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { useRecoilState, useRecoilValue } from "recoil";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { LanguageSelector } from "../Utils/LanguagesSelector";
import { UsernameUpdate } from "./UsernameUpdate";
import './Settings.css'
import { themeState } from "../../Atoms/ThemeState";
import { languageState } from "../../Atoms/LanguageState";
import { Languages } from "../../Languages/Languages";
import { useNavigate } from "react-router-dom";

export const Settings = (props: any) => {
    const [user, setUser] = useRecoilState(userState)
    const [theme, setTheme] = useRecoilState(themeState)
    const [language, setLanguage] = useRecoilState(languageState)
    const navigator = useNavigate();
    const applySettings = async (e: any) => {
        props.handleClose()
    }

    const changeTheme = (e: any) => {
        var theme = localStorage.getItem('theme')
        if (theme == 'dark') {
            localStorage.setItem('theme', 'light')
            document.documentElement.dataset.theme = 'light'
            setTheme('light')
        } else {
            localStorage.setItem('theme', 'dark')
            document.documentElement.dataset.theme = 'dark'
            setTheme('dark')
        }
    }

    const onExit = (e: any) => {
        localStorage.removeItem('access_token')
        setUser({ ...user, isAuthorized: false })
        navigator('/')
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header className="modal-settings-header" closeButton>
                <Modal.Title>{language.words?.Settings}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-settings-body">
                <Form className="d-flex flex-column">
                    <UsernameUpdate />
                    <div>
                        <Form.Text>{language.words?.SelectAppLanguage}</Form.Text>
                        <LanguageSelector />
                    </div>
                    <div>
                        <Form.Text>{language.words?.SelectAppTheme}</Form.Text>
                        <Form.Switch onClick={changeTheme} defaultChecked={theme == 'dark' ? true : false} />
                    </div>
                    <div>
                        <Form.Text>{language.words?.UploadBackground}</Form.Text>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className='modal-settings-footer'>
                <Button variant="danger" onClick={onExit}>
                    {language.words?.LogOut}
                </Button>
                <div>
                    <Button variant="secondary" className="me-2" onClick={props.handleClose}>
                        {language.words?.Close}
                    </Button>
                    <Button variant="primary" onClick={applySettings}>
                        {language.words?.Apply}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}