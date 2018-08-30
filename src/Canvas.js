import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'

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
    return ();
  }
};

Canvas.protoTypes = {
};
