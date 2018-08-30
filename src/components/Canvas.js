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
