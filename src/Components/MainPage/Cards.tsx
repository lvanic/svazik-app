import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Cards.css'
import { cards } from '../../data/cards';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { languageState } from '../../Atoms/LanguageState';
export const Cards = () => {
    const [language, setLanguage] = useRecoilState(languageState)
    const [slidesToShow, setSlidesToShow] = useState(1)
    useEffect(() => {
        window.innerWidth < 400 ?
            setSlidesToShow(1)
            :
            window.innerWidth < 600 ?
                setSlidesToShow(2)
                :
                setSlidesToShow(3)
    }, [])
    return (
        <div className="slide-container">
            <Slide slidesToScroll={1} slidesToShow={slidesToShow} indicators={true} cssClass='slide'>
                {cards.map((card, index) => (
                    <Col className='h-100' key={index} onClick={() => card.link != undefined ? window.open(card.link) : null}>
                        <Card className="p-3 h-100">
                            <Card.Img variant='top' src={card.img} />
                            <Card.Body >
                                <Card.Title>{language.words?.CardInfo[index].name}</Card.Title>
                                <Card.Text>
                                    {language.words?.CardInfo[index].description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )
                )}
            </Slide>
        </div>
    );
}