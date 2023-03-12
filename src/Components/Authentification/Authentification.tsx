import { useState } from "react"
import { Button, Nav } from "react-bootstrap"
import { Loading } from "../Loading"
import { AuthorizationForm } from "./AuthorizationForm"
import { RegistrationForm } from "./RegistrationForm"

export const Authentification = () => {
    const [isAuthorization, setIsAuthorization] = useState(true);
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