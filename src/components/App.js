import React, { Component } from 'react';
import Canvas from './Canvas';
import ControlPanel from './ControlPanel';
// import Styled from 'styled-components';

export default class App extends Component {
constructor(props) {
    super(props);
    this.state = {
      width: 500,
      height: 500,
      colorOption: 'black',
    };

    this.handleChangeColorOption = this.handleChangeColorOption.bind(this);
    this.handleClickMerge = this.handleClickMerge.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
  }

  handleChangeColorOption(e) {
    // e.preventDefault();
    this.setState({
      colorOption: e.target.value,
    });
  }

  handleClickMerge(e) {
    e.preventDefault();
    this.canvasRef.merge();
  }

  handleClickClear(e) {
    e.preventDefault();
    this.canvasRef.clear();
  }

  render() {
    const style = {
      width: '800px',
      height: '600px',
    }
    return (
      <div style={style}>
        <Canvas
          ref={(Canvas) => { this.canvasRef = Canvas }}
          width={this.state.width}
          height={this.state.height}
          colorOption={this.state.colorOption}
        />
        <ControlPanel
          colorOption={this.state.colorOption}
          handleChangeColorOption={this.handleChangeColorOption}
          handleClickMerge={this.handleClickMerge}
          handleClickClear={this.handleClickClear}
        />
      </div>
    );
  }
};
