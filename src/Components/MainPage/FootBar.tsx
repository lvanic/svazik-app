import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/esm/Card';
import Nav from 'react-bootstrap/Nav';


export const FootBar = () => {
    return (
        <Nav className="justify-content-center navbar navbar-fixed-bottom" fill variant="tabs">
            <Nav.Item>
                <Nav.Item>
                    <Card.Title>
                        <h6>
                            Один
                        </h6>
                    </Card.Title>
                </Nav.Item>
                <Nav.Link className='text-muted'>1.1</Nav.Link>
                <Nav.Link className='text-muted'>1.2</Nav.Link>
                <Nav.Link className='text-muted'>1.3</Nav.Link>
                <Nav.Link className='text-muted'>1.4</Nav.Link>
                <Nav.Link className='text-muted'>1.5</Nav.Link>
                <Nav.Link className='text-muted'>1.6</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Card.Title>
                    <h6>
                        Два
                    </h6>
                </Card.Title>
                <Nav.Link className='text-muted'>2.1</Nav.Link>
                <Nav.Link className='text-muted'>2.2</Nav.Link>
                <Nav.Link className='text-muted'>2.3</Nav.Link>
                <Nav.Link className='text-muted'>2.4</Nav.Link>
                <Nav.Link className='text-muted'>2.5</Nav.Link>
                <Nav.Link className='text-muted'>2.6</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Card.Title>
                    <h6>
                        Три
                    </h6>
                </Card.Title>
                <Nav.Link className='text-muted'>3.1</Nav.Link>
                <Nav.Link className='text-muted'>3.2</Nav.Link>
                <Nav.Link className='text-muted'>3.3</Nav.Link>
                <Nav.Link className='text-muted'>3.4</Nav.Link>
                <Nav.Link className='text-muted'>3.5</Nav.Link>
                <Nav.Link className='text-muted'>3.6</Nav.Link>
            </Nav.Item>


        </Nav>
    );
}