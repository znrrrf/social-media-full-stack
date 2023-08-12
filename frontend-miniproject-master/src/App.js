// import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import RegisPage from './components/RegisPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import EmailVerified from './components/EmailVerified';
import ErrorToken from './components/ErrorToken';
import ForgorPass from './components/ForgotPass';
import ResetPass from './components/ResetPass';
import EditProfilePage from './components/EditProfilePage';
import CekMyContent from './components/CekMyContent';
import EditMyContent from './components/EditMyContent';
import DetileContent from './components/DetileContent';

function App() {
  return (
    <div className="App" style={{backgroundColor:'#EAFDFC'}}>
      {/* <RegisPage /> */}
      {/* <LoginPage /> */}
      <Navbar />
      {/* <EmailVerified /> */}
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route path='/verif' element={<EmailVerified />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/regis' element={<RegisPage />} />
        <Route path='/err-token' element={<ErrorToken />} />
        <Route path='/forgot-pass' element={<ForgorPass />} />
        <Route path='/reset-pass-page/:token' element={<ResetPass />} />
        <Route path='/edit' element={<EditProfilePage />} />
        <Route path='/my-content' element={<CekMyContent />} />
        <Route path='/edit-content' element={<EditMyContent />} />
        <Route path='/detile-content' element={<DetileContent />} />
      </Routes>
    </div>
  );
}

export default App;
