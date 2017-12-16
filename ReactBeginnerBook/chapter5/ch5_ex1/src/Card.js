import React, { Component } from 'react';
import './Card.css';
import Square from './Square';
import Label from './Label';

const Card = class extends Component{
    render() {
      return (
        <div className='card'>
          <Square backColor={this.props.backColor}/>
          <Label backColor={this.props.backColor}/>
        </div>
      );   
    };
  }

  export default Card;