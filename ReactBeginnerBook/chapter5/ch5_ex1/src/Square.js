import React, { Component } from 'react';

const Square = class extends Component {
    render() {
        const squareStyle = {
            backgroundColor: this.props.backColor,
            height: 150
        };
        return (<div style={squareStyle}></div>);
    }
}

export default Square;