import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { socketState } from "../Atoms/SocketState";
import { userState } from "../Atoms/UserState";
import { UserService } from "../Services/AuthentificationService";

export const Authorize = (props: any) => {  
    const [user, setUser] = useRecoilState(userState);

    const navigator = useNavigate();

    useEffect(() => {
        if(!user.isAuthorized){
            navigator('/authentification')
        }
    }, [])
      
    return (
        props.Component
    );
}