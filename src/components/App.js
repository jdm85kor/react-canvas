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
    this.handleMerge = this.handleMerge.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChangeColorOption(value) {
    this.setState({
      colorOption: value,
    });
  }

  handleMerge() {
    this.canvasRef.merge();
  }

  handleClear() {
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
          handleMerge={this.handleMerge}
          handleClear={this.handleClear}
        />
      </div>
    );
  }
};
