import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HeadBar from './Components/HeadBar';
import MainPage from './Components/MainPage/MainPage';
import { VideoCall } from './Components/VideoCall';
import { FootBar } from './Components/FootBar';
import { Authentification } from './Components/Authentification/Authentification';
import { Chats } from './Components/Web/Chats';
import { Web } from './Components/Web/Web';



function App() {
  return (
    <Router>

      <Routes>
        <Route path='/' element=
          {
            <>
              <HeadBar />
              <MainPage />
              <FootBar />
            </>
          }
        />
        <Route path='/authentification' element={
          <>
            <HeadBar />
            <Authentification />
          </>
        } />
        <Route path='/web' element={<Web />} />

        <Route path='/call' element={<VideoCall />} />
      </Routes>

    </Router>
  );
}

export default App;
