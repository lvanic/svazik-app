import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { userState } from "../../Atoms/UserState"
import { languageState } from "../../Atoms/LanguageState"

export const UsernameUpdate = (props: any) => {
    const [language, setLanguage] = useRecoilState(languageState)
    const [user, setUser] = useRecoilState(userState)
    const [isUpdate, setUpdate] = useState(false)
    const [username, setUsername] = useState(user.username)
    const onUsernameChange = (e: any) => {
        setUsername(e.target.value)
    }
    const usernameUpdate = () => {
        if (isUpdate) {
            //TODO: change name to new query
            setUser({ ...user, username: username })
        }
        setUpdate(!isUpdate)
    }

    return (
        <div>
            <div>
                <Form.Text>{language.words?.Username}: </Form.Text>
                {
                    isUpdate ?
                        <Form.Control value={username} onChange={onUsernameChange} />
                        :
                        <Form.Text style={{color:'white'}}> {username}</Form.Text>
                }
            </div>
            <Button className="ps-1 pe-1" onClick={usernameUpdate} >{language.words?.Edit}</Button>
        </div>
    )
}