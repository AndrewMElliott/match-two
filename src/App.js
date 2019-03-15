import React, { Component } from 'react';
import MatchTwo from './MatchTwoModule/MatchTwoModule'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      
    }
   
  }

  
  render() {
    return (
      <div className="App">
        <MatchTwo/>
      </div>
    );
  }
}

export default App;
