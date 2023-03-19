import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const HeadBar = () => {
    return (
        <Navbar bg="light" expand="lg" className='border border-left-0 border-right-0 border-top-0'>
            <Container>
                <Navbar.Brand href="#home">Sviazik</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavDropdown title="Остальные продукты" id="basic-nav-dropdown">
                            <NavDropdown.Item href="http://forumivanic.web.app">
                                Forum
                            </NavDropdown.Item>
                            <NavDropdown.Item href="http://familyhelp-f1e93.web.app">
                                Family Help
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeadBar;