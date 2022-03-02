import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Uploader from './components/Uploader'
import { Routes, Route } from 'react-router';
const App = () => {
	return (
		<Routes>
			<Route  path = '/' element = {<Uploader/>}/>
			<Route  path = '/search' element = {<Map/>}/>	
		</Routes>
	);
  }
  
  
  

export default App;