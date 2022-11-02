import Home from './Pages/HomePage/Home';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Pages/ProfilePage/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Project from './Pages/ProjectPage/Project';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile />}/>
          <Route path={"/project/:projectId"} element={<Project/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
