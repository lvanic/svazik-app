import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const ConnectToRoom = () => {
    const location = useLocation()
    useEffect(() => {
        // if(location.search.fi)
        const requestConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${localStorage.getItem('access_token')}`,
            },
        }
        fetch(process.env.REACT_APP_SERVER_NAME + `/chat/connect${location.search}`, { ...requestConfig, redirect: 'manual' })
            .then((res) => {
                window.location.href = '/web'
            })

    }, [])
    return (
        null
    )
}