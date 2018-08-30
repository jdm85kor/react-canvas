import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ControlPanel extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const {
      colorOption,
      handleChangeColorOption,
      handleClickMerge,
      handleClickClear
    } = this.props;
    return (
      <div>
        <form>
          <label>
            <input
              type='radio'
              value='black'
              checked={colorOption === 'black'}
              onChange={handleChangeColorOption}
            />
            Black
          </label>
          <label>
            <input
              type='radio'
              value='red'
              checked={colorOption === 'red'}
              onChange={handleChangeColorOption}
            />
            Red
          </label>
          <label>
            <input
              type='radio'
              value='green'
              checked={colorOption === 'green'}
              onChange={handleChangeColorOption}
            />
            Green
          </label>
          <label>
            <input
              type='radio'
              value='blue'
              checked={colorOption === 'blue'}
              onChange={handleChangeColorOption}
            />
            Blue
          </label>
          <button onClick={handleClickMerge}>Merge</button>
          <button onClick={handleClickClear}>Clear</button>
        </form>
      </div>
    );
  }
};

ControlPanel.propTypes = {
  colorOption: PropTypes.string,
  handleChangeColorOption: PropTypes.func,
  handleClickMerge: PropTypes.func,
  handleClickClear: PropTypes.func,
};
