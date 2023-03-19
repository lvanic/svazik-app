import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './OpenSvazik.css';
export const OpenSvazik = () => {
    const navigator = useNavigate();
    return (
        <Card style={{margin: 'auto' }} className="text-left w-75 p-3 border-0" >
            <Card.Body className="border-0">
                <Card.Text className='text-left my-4'>
                    <h1>
                        <b>
                            Будьте всегда<br /> 
                            на связи<br />
                            со своими близкими<br /> 
                            вместe с <span className='gradientSvazik'> Sviazik </span>
                        </b>
                    </h1>
                </Card.Text>
                <Card.Text>
                    Мы постоянно улучшаем качество предоставляемых услуги
                </Card.Text>
                <Button variant="primary" onClick={() => navigator('/authentification')}>Открыть web-svazik</Button>
            </Card.Body>
            <Card.Text className="text-primary border-0 mb-2">
                <Button variant="link" >Скачать svazik</Button>
            </Card.Text>
        </Card>
    );
}