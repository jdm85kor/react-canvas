import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Styled from 'styled-components';

export default class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleClickMerge = this.handleClickMerge.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
  };

  handleChangeOption(e) {
    this.props.handleChangeColorOption(e.target.value);
  }

  handleClickMerge(e) {
    e.preventDefault();
    this.props.handleMerge();
  }

  handleClickClear(e) {
    e.preventDefault();
    this.props.handleClear();
  }

  render() {
    const {
      colorOption,
    } = this.props;
    return (
      <div>
        <form>
          <label>
            <input
              type='radio'
              value='black'
              checked={colorOption === 'black'}
              onChange={this.handleChangeOption}
            />
            Black
          </label>
          <label>
            <input
              type='radio'
              value='red'
              checked={colorOption === 'red'}
              onChange={this.handleChangeOption}
            />
            Red
          </label>
          <label>
            <input
              type='radio'
              value='green'
              checked={colorOption === 'green'}
              onChange={this.handleChangeOption}
            />
            Green
          </label>
          <label>
            <input
              type='radio'
              value='blue'
              checked={colorOption === 'blue'}
              onChange={this.handleChangeOption}
            />
            Blue
          </label>
          <button onClick={this.handleClickMerge}>Merge</button>
          <button onClick={this.handleClickClear}>Clear</button>
        </form>
      </div>
    );
  }
};

ControlPanel.propTypes = {
  colorOption: PropTypes.string,
  handleChangeColorOption: PropTypes.func,
  handleMerge: PropTypes.func,
  handleClear: PropTypes.func,
};
