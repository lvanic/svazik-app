import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../Utils/LanguagesSelector';
import { useRecoilState } from 'recoil';
import { languageState } from '../../Atoms/LanguageState';
import SviazikLogo from '../../SviazikLogo.svg'
import './HeadBar.css'
const HeadBar = () => {
    const [language, setLanguage] = useRecoilState(languageState)
    const navigator = useNavigate()
    return (
        <Navbar bg="light" expand="lg" className='border border-left-0 border-right-0 border-top-0 p-0'>
            <Container>
                <Navbar.Brand style={{ cursor: 'pointer', padding:'0px' }} className='d-flex align-items-center sviazik-logo' onClick={() => navigator('/')}>
                    <img className='gradientSvazikLogo' style={{width:'60px'}} src={SviazikLogo}/>
                    <div className='sviazik-logo-name' style={{fontWeight:'600'}}>viazik</div>
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-between'>
                    <Nav className='d-flex justify-content-end'>
                        <NavDropdown title={language.words?.OtherProducts} id="basic-nav-dropdown">
                            <NavDropdown.Item href="http://forumivanic.web.app">
                                Forum
                            </NavDropdown.Item>
                            <NavDropdown.Item href="http://familyhelp-f1e93.web.app">
                                Family Help
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div>
                        <LanguageSelector />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeadBar;