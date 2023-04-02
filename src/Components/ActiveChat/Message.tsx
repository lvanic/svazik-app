import { Card } from "react-bootstrap"
import './Message.css'
import { useEffect, useState } from "react";
export const Message = (props: any) => {
    const [position, setPosition] = useState<any>(1);
    useEffect(() => {
        if (props.location == "end") {
            setPosition(2)
        } else {
            setPosition(3)
        }
    }, [])

    return (
        <div key={props.key} className={`d-flex justify-content-${props.location}`}>
            <Card className={`ps-${5-position} pe-${position} pt-2 pb-2 mb-1 d-flex align-items-${props.location}`}>
                <Card.Text className="mb-0">{props.name}</Card.Text>
                <Card.Text className="mb-0">{props.text}</Card.Text>
            </Card>
        </div>
    )
}