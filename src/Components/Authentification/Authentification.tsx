import { useEffect, useState } from "react"
import { Button, Nav } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { io } from "socket.io-client"
import { socketState } from "../../Atoms/SocketState"
import { userState } from "../../Atoms/UserState"
import { UserService } from "../../Services/AuthentificationService"
import { Loading } from "../Loading"
import { AuthorizationForm } from "./AuthorizationForm"
import { RegistrationForm } from "./RegistrationForm"

export const Authentification = () => {
    const [isAuthorization, setIsAuthorization] = useState(true);
    const [user, setUser] = useRecoilState(userState);
    const [socket, setSocket] = useRecoilState(socketState)
    const navigator = useNavigate();
    useEffect(() => {
        if (user.isAuthorized) {
            setSocket(io(`${process.env.REACT_APP_SERVER_NAME}`, {
                extraHeaders: {
                    authorization: `${localStorage.getItem('access_token')}`
                }
            }))
            navigator('/web')
        }
    }, [user])
    return (
        <main>
            {
                isAuthorization ?
                    <AuthorizationForm setIsAuthorization={setIsAuthorization} />
                    :
                    <RegistrationForm setIsAuthorization={setIsAuthorization} />
            }

        </main>
    )
}