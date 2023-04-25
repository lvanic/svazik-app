import { Modal, Button, Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { languageState } from "../../Atoms/LanguageState";
import { Languages } from "../../Languages/Languages";

export const LanguageSelector = (props: any) => {
    const [language, setLanguage] = useRecoilState(languageState)
    const onLanguageSelect = (e: any) => {
        var newLanguage = e.target.value;
        document.documentElement.lang = newLanguage
        localStorage.setItem('language', newLanguage)
        setLanguage({ name: newLanguage, words: Languages.find(x => x.name == newLanguage)?.words })
    }

    return (
        <Form.Select onChange={onLanguageSelect}>
            {langArray.map((lang) => (
                <option value={lang.val} selected={language.name == lang.val ? true : false}>{lang.desk}</option>
            ))}
        </Form.Select>
    )
}

const langArray = [
    {
        val: 'ru',
        desk: 'Russian'
    },
    {
        val: 'en',
        desk: 'English'
    },
]