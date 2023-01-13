import React, { useState } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './component/LoginPage';
import Register from './component/Register';
import MainPage from './component/MainPage';

export const App = () => ( 
  <>
    <Routes>
      <Route path='/' element = {<LoginPage/>} />
      <Route path='/login' element = {<LoginPage/>} />
      <Route path='/register' element = {<Register/>} />
      <Route path='/main' element = {<MainPage/>} />
    </Routes>
  </>
);

