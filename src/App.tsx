import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HeadBar from './Components/MainPage/HeadBar';
import MainPage from './Components/MainPage/MainPage';
import { VideoCall } from './Components/VideoCall';
import { FootBar } from './Components/MainPage/FootBar';
import { Authentification } from './Components/Authentification/Authentification';
import { Web } from './Components/Web/Web';
import { Authorize } from './Middleware/Authorize';
import { useEffect, useLayoutEffect } from 'react';
import { UserService } from './Services/AuthentificationService';
import { useRecoilState } from 'recoil';
import { userState } from './Atoms/UserState';
import { io } from 'socket.io-client';
import { socketState } from './Atoms/SocketState';
import process from 'process';
import { languageState } from './Atoms/LanguageState';
import { themeState } from './Atoms/ThemeState';
import { Languages } from './Languages/Languages';

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [socket, setSocket] = useRecoilState(socketState);
  const [language, setLanguage] = useRecoilState(languageState)
  const [theme, setTheme] = useRecoilState(themeState)
  useEffect(() => { //установка языка и темы 
    window.process = process;
    var lang = localStorage.getItem('language')
    if (lang) {
      setLanguage({
        name: lang,
        words: Languages.find(x => x.name == lang)?.words
      })
    }
    else{
      setLanguage({
        name: 'ru',
        words: Languages.find(x => x.name == 'ru')?.words
      })
    }
    var theme = localStorage.getItem('theme')
    if(theme){
      setTheme(theme)
      document.documentElement.dataset.theme = theme
    }
    else{
      setTheme('light')
      document.documentElement.dataset.theme = 'light'
    }
  }, []);

  useLayoutEffect(() => {
    UserService().then((userHandler) => {
      if (userHandler.isAuthorized) {
        setSocket(io(`${process.env.REACT_APP_SERVER_NAME}`, {
          extraHeaders: {
            authorization: `${localStorage.getItem('access_token')}`
          }
        }))
        setUser(userHandler);
      }
    });
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element=
          {
            <>
              <HeadBar />
              <MainPage />
            </>
          }
        />
        <Route path='/authentification' element={
          <>
            <HeadBar />
            <Authentification />
          </>
        } />
        <Route path='/web' element={<Authorize Component={<Web />} />} />

      </Routes>
    </Router>

  );
}

export default App;
