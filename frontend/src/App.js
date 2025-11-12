import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
import Register from './components/Register';

import ThreeDModel from "./components/ThreeDModel";
import Questions from "./components/Questions";
import MediQAdd from "./components/MediQAdd";
import PatientData from "./components/PatientData";
import PrintMed from "./components/PrintMed";
import DashboardU from "./components/DashboardU";
import Profile from "./components/Profile";
import UserRecord from "./components/UserRecord";
import AboutUs from "./components/AboutUs";
import Combine from "./components/Combine";

function App() {
  
  return (
    //<Router>
    <div className="App">
      {/*<Nav/>*/}
      
      
      {/*<Stock/>*/}
      
      
        <Routes>
        <Route path = "/" element ={< DashboardU/>}/>
       
        <Route path = "/Login" element ={<Login />}/>
        
        <Route path = "/Register" element ={<Register />}/>
      
        <Route path = "/ThreeDModel" element ={<ThreeDModel />}/>
        <Route path="/MediQAdd/:partName" element={<MediQAdd />} />
        <Route path = "/PrintMed" element ={<PrintMed />}/>
        <Route path="/PatientData" element={<PatientData />} />
        <Route path="/DashboardU" element={<DashboardU />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/AboutUs" element={<AboutUs />} />
         <Route path="/Combine" element={<Combine />} />
          <Route path="/UserRecord/:userId/:itemId" element={<UserRecord />} />
        {/*<Route
           path="/viewer" element={<ThreeDModel modelUid="edff2cf5209d467abc19e16c0d82cf56" />}/>*/}
           <Route path="/main" element={<ThreeDModel />} />

        <Route path="/questions/:partName" element={<Questions />} />
        
        </Routes>
      
    </div>
    //</Router>
  );
}

export default App;
 