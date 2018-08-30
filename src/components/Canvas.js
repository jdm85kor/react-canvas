import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
import Color from '../constants/color';
// import Styled from 'styled-components';

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.merge = this.merge.bind(this);
    this.clear = this.clear.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown() {
  }

  onMouseMove() {
  }

  onMouseOut() {
  }

  onMouseUp() {
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
