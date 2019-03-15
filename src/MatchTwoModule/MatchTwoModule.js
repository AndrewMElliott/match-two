import React, { Component } from 'react';
import Card from './Components/cards';
import './match.css';

class MatchTwo extends Component {

  constructor(props){
    super(props)
    this.mainDeck = React.createRef()
    this.state = {
      values: [],
      timer: 0,
      totalMatched: 0,
      score: [],
      started: false
    }
    this.suit = ["♠","♥","♣","♦"]
    this.firstSelect = null
    this.timer = null
    this.reshuffle = Math.random()
    this.dealDelay = 1500
    
    this.deckCoords = {left: 0, top: 0}
  }

  componentDidMount(){
    
    this.generateCards()
    this.getDeckRect()
  }

  generateCards = () => {
    this.reshuffle = Math.random()
    let temp = []
    for(let v = 1; v <= 10; v++){    
      let suit = Math.floor(Math.random() * 4)
      temp.push({value: v, suit: this.suit[suit], matched: false, flipped:false})
      temp.push({value: v, suit: this.suit[suit], matched: false, flipped:false})
    }
    return this.shuffle(temp)
  }
  shuffle = (deck) => {
    let deckShuffle = deck
    let length = deckShuffle.length - 1;
    for(let i = length; i >= 0; i--){
      let r = Math.floor(Math.random()*(i + 1))
      
      let rand = deckShuffle[r]
      let end = deckShuffle[i]
      deckShuffle[i] = rand
      deckShuffle[r] = end 
    }
    //console.log("output: ", deckShuffle)
    this.firstSelect = null
    this.stopTimer()
    this.setState({
      values: deckShuffle,
      totalMatched: 0,
      timer: 0,
      started: false
    })

  }
  clock = () => {
      let time = this.state.timer
      let minutes = Math.floor(time / 60) < 10 ? '0' + Math.floor(time / 60) : Math.floor(time / 60)
      let seconds = time % 60 < 10 ? '0' + time % 60 : time % 60
      return minutes + ':' + seconds
  }
  stopTimer = () => {
    clearInterval(this.timer)
    this.setState({started: false})
  }
  startTimer = () => {
    this.setState({started: true})
    this.timer = setInterval(() => {
      this.setState({timer: this.state.timer + 1})
    },1000)
  }
  handleCardClick = (card) => {
    if(!this.state.started && this.state.totalMatched !== this.state.values.length) 
      this.startTimer()
    if(card.matched) return
    if(this.firstSelect && this.firstSelect.index === card.index) return
    if(!this.firstSelect){
      this.setState(state => {
        let tempDeck = this.state.values
        tempDeck[card.index].flipped = true
        this.firstSelect = card
        return { ...state, values: tempDeck}
      })
    } else {
        if((this.firstSelect.value === card.value) 
          && (this.firstSelect.suit === card.suit)){
            this.setState(state => {
              let temp = this.state.values
              temp[this.firstSelect.index].matched = true
              temp[card.index].flipped = true
              temp[card.index].matched = true
              this.firstSelect = null
              return {totalMatched: this.state.totalMatched += 2,
                values: temp
              }
            }, () => {
              if(this.state.totalMatched === this.state.values.length){
                this.stopTimer()
                let newScore = this.state.score
                newScore.push(this.clock())
                newScore.sort()
                this.setState({
                  timer: 0,
                  score: newScore
                })
              }
            })
      } else {
        let prevFirst = this.firstSelect
        this.setState(state => {
          let tempDeck = this.state.values
          tempDeck[card.index].flipped = true
          this.firstSelect = null
          return {...state, values: tempDeck}
          
        }, () => {
          setTimeout(() => {
            this.setState(state => {
              let tempDeck = this.state.values
              tempDeck[prevFirst.index].flipped = false
              tempDeck[card.index].flipped = false
              return {...state, values: tempDeck}
            })
          },800)
          
        })
      }
    }
    
  }
  getDeckRect = () => {
   
    
    console.log(this.mainDeck)
    let coords = this.mainDeck.getBoundingClientRect()
    this.deckCoords.left = coords.left
    this.deckCoords.top = coords.top
    console.log(this.deckCoords)
    
  }
  renderCards = () => {
    let delay = this.dealDelay
    return (
      this.state.values.map((item, index) => {
        delay -= this.dealDelay / this.state.values.length
        //console.log(this.deckCoords)
        return <Card 
                  key={index + this.reshuffle}
                  dealDelay={delay}
                  deckCoord={this.deckCoords}
                  flipped={item.flipped} 
                  value={item.value} 
                  suit={item.suit}
                  index={index}
                  matched={item.matched}
                  onClick={this.handleCardClick.bind(this)} 
                />
      })
    )
  }
  renderScore = () => {
    return (
      <table className="board-container">
        <tbody>
        <tr>
          <td>Name</td>
          <td>Score</td>
        </tr>
        {this.state.score.map((item, index) => {
        return  <tr>
                  <td>Unknown</td>
                  <td>{item}</td>
                </tr>
        })}
        </tbody>
      </table>
      
    )
  }

  render() {
    return (
      <div className="primary">
        <div className="menu">
          <div ref={el =>{this.mainDeck = el}}>
            <div className='card' onClick={() => {this.generateCards()}}>shuffle</div>
          </div>
          
          <span>{this.clock()}</span>
        </div>
        
        <div className="container">
          
          {this.renderCards()}
        </div>
        {this.renderScore()}
      </div>
    );
  }
}

export default MatchTwo;
