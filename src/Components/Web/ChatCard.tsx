import { Card } from "react-bootstrap";
import './Chat.css'
export const ChatCard = (props: any) => {
    return (
        <Card className="mb-0 border rounded chat-item border-0" onClick={props.onClick}>
            <Card.Body className="d-sm-flex align-items-center flex-row pt-1 pb-1">
                <Card.Img variant="left" src="../img/yahorka.jpg" className='rounded-circle ' style={{ width: '65px' }} />
                <Card.Text>
                    <Card.Text className="mb-1 text-dark ont-weight-bold fs-5">
                        {props.title}
                    </Card.Text>
                    <Card.Text className="text-muted mb-0">
                        {props.description}
                    </Card.Text>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}