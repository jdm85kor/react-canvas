import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const StyledControlPanel = Styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 500px;
  margin-left: 20px;
  font-size: 20px;
`;

const StyledColorOptions = Styled.div`
  margin-bottom: 129px;
  width: 180px;
`;

const StyledDiv = Styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  border: 1px solid;
  margin-bottom: 10px;
  padding-left: 5px;
  &:hover {
    color: ${props => props.bgColor === 'black' ? 'white' : 'black'};
    background-color: ${props => props.bgColor};
  }
`;

const StyledLabel = Styled.label `
  display: flex;
  align-items: center;
  cursor: pointer;
  > input {
    align-items: center;
    width: 30 px;
    height: 30 px;
    margin: 0 px;
    cursor: pointer;
  }
`;

const StyledButtonPanel = Styled.div`
  width: 150px;
`;

const StyledButton = Styled.div`
  width: 100%;
  height: 50px;
  border: 1px solid;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 35px;
  vertical-align: middle;
  line-height: 50px;
  cursor: pointer;
`;

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
    this.props.handleMerge();
  }

  handleClickClear(e) {
    this.props.handleClear();
  }

  render() {
    const {
      colorOption,
    } = this.props;
    return (
      <StyledControlPanel>
        <StyledColorOptions>
          <StyledDiv bgColor='black'>
            <StyledLabel>
              <input
                type='radio'
                value='black'
                checked={colorOption === 'black'}
                onChange={this.handleChangeOption}
              />
              Black
            </StyledLabel>
          </StyledDiv>
          <StyledDiv bgColor='red'>
            <StyledLabel>
              <input
                type='radio'
                value='red'
                checked={colorOption === 'red'}
                onChange={this.handleChangeOption}
              />
              Red
            </StyledLabel>
          </StyledDiv>
          <StyledDiv bgColor='green'>
            <StyledLabel>
              <input
                type='radio'
                value='green'
                checked={colorOption === 'green'}
                onChange={this.handleChangeOption}
              />
              Green
            </StyledLabel>
          </StyledDiv>
          <StyledDiv bgColor='blue'>
            <StyledLabel>
              <input
                type='radio'
                value='blue'
                checked={colorOption === 'blue'}
                onChange={this.handleChangeOption}
              />
              Blue
            </StyledLabel>
          </StyledDiv>
        </StyledColorOptions>
        <StyledButtonPanel>
          <StyledButton onClick={this.handleClickMerge}>Merge</StyledButton>
          <StyledButton onClick={this.handleClickClear}>Clear</StyledButton>
        </StyledButtonPanel>
      </StyledControlPanel>
    );
  }
};

ControlPanel.propTypes = {
  colorOption: PropTypes.string,
  handleChangeColorOption: PropTypes.func,
  handleMerge: PropTypes.func,
  handleClear: PropTypes.func,
};
