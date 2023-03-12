import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Cards.css'
export const Cards = () => {
    return (
        <Row xs={1} md={3} className="g-4 border-0  ">
            {Array.from({ length: 6 }).map((_, idx) => (
                <Col>
                    <Card  className="p-3 ">
                        <Card.Img variant="top" src="https://secure.skypeassets.com/content/dam/scom/grd/web_skype_image_big_screens_optimized.png"/>
                        <Card.Body >
                            <Card.Title>Информация</Card.Title>
                            <Card.Text>
                                Тут будет написаная очень важная информация, почему связик лучше других,
                                все его плюшки, про качество связи и тд...
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}