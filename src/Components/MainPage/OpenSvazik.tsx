import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './OpenSvazik.css';
import { useRecoilState } from 'recoil';
import { languageState } from '../../Atoms/LanguageState';
export const OpenSvazik = () => {
    const [language, setLanguage] = useRecoilState(languageState);
    const navigator = useNavigate();
    return (
        <Card style={{ margin: 'auto' }} className="text-left w-75 p-3 border-0" >
            <Card.Body className="border-0">
                <Card.Text className='text-left my-4'>
                    <h1>
                        <b style={{maxWidth:'360px', display:'block'}}>
                            {language.words?.Tagline} <span className='gradientSvazik'> Sviazik </span>
                        </b>
                    </h1>
                </Card.Text>
                <Card.Text>
                    {language.words?.LittleTagline}
                </Card.Text>
                <Button variant="primary" onClick={() => navigator('/authentification')}>{language.words?.OpenSviazik}</Button>
            </Card.Body>
            <Card.Text className="text-primary border-0 mb-2">
                <Button variant="link" >{language.words?.Download}</Button>
            </Card.Text>
        </Card>
    );
}