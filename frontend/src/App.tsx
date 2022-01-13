import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import Uploader from './components/Uploader'
import { Routes, Route } from 'react-router';
const App = () => {
	return (
		<Routes>
			<Route  path = '/' element = {<Uploader/>}/>
			<Route  path = '/search' element = {<Search/>}/>	
		</Routes>
	);
  }
  
  
  

export default App;