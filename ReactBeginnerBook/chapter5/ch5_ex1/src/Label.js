import React, { Component } from 'react';
import './Label.css';


const Label = class extends Component {
    render() {
        return (
            <div className="label-style">{this.props.backColor}</div>
        );
    }
}

export default Label;