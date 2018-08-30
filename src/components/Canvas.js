import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
import Color from '../constants/color';
// import Styled from 'styled-components';

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = null;
    this.ctx = null;

    this.merge = this.merge.bind(this);
    this.clear = this.clear.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('shouldComponentUpdate');
  //   return ;
  // }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
  }

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - left,
      y: e.clientY - top,
    };
  }

  onMouseDown(e) {
    const { x, y } = this.getCursorPosition(e);
  }

  onMouseMove(e) {
    const { x, y } = this.getCursorPosition(e);
  }

  onMouseOut(e) {
  }

  onMouseUp(e) {
    const { x, y } = this.getCursorPosition(e);
  }

  merge() {
  }

  clear() {
  }

  render() {
    const { width, height } = this.props;
    return (
      <div>
        <canvas
          style={{ border: '0.5px solid', cursor: 'pointer' }}
          ref={(canvas) => { this.canvasRef = canvas; }}
          width={width}
          height={height}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseOut}
          onMouseUp={this.onMouseUp}
        />
      </div>
    );
  }
};

Canvas.protoTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  colorOption: PropTypes.string,
};
