import { Card } from "react-bootstrap"
import './Message.css'
export const Message = (props: any) => {
    
    return (
        <div key={props.key} className={`d-flex justify-content-${props.location}`}>
            <Card className="ps-3 pe-3 pt-2 pb-2 mb-1">{props.text}</Card>
        </div>
    )
}