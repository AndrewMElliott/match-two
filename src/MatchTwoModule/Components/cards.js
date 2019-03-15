import React, { Component } from 'react';
import './cards.css'

class Card extends Component {
  constructor(props){
    super(props)
    this.state = {
      flipped: props.flipped || false,
      matched: props.matched || false,
      index: props.index || 0,
      value: props.value || 'we',
      suit: props.suit || '♠',  
      dealt: false,
      animCoords: {}
    }
    //console.log(props.deckCoord)
    this.delay = props.dealDelay
    this.coords = props.deckCoord 
    this.start = React.createRef()
    //this.animCoords ={}
  }
  getCoords = () => {
    
    
    let c = this.start.getBoundingClientRect()
    let animCoords = {left: 0, top:0}
    //console.log(c, this.coords)
    animCoords.left = this.coords.left - c.left
    animCoords.top  = this.coords.top - c.top  
    //console.log(this.state.index, animCoords)
    this.setState({animCoords: animCoords}, () => {
      setTimeout(() => {
        this.setState({dealt: true})
      }, this.delay)
    })
  }
  componentDidMount(){
    this.getCoords() 
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props !== prevProps){
      this.setState({
        value: this.props.value, 
        suit:this.props.suit, 
        index: this.props.index,
        matched: this.props.matched,
        flipped: this.props.flipped,
        coords: this.props.deckCoord

      }) 
    }
  }
  

  render(){
    //console.log('render')
    return (
       
      <div ref={el => {this.start = el}} className={this.state.flipped ? 'flip-container hover' : 'flip-container'} style={!this.state.dealt ? {transform:`translate(${this.state.animCoords.left}px, ${this.state.animCoords.top}px)`, opacity:0} : {transition: `transform 0.5s linear`}} >
          <div className={'flipper'} onClick={() => this.props.onClick(this.state)}>
            <div className="front">
            </div>
            <div className="back">
              <div>{this.state.value}</div>
              <div>{this.state.suit}</div>
            </div>
          </div>
        </div>
      
      
      
    )
  }

}

export default Card;