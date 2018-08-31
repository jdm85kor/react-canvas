import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
import Color from '../constants/color';
import { hasPointInArray, getCoordinates } from '../utils/arrayUtils';
// import Styled from 'styled-components';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      numberOfPolygon: 0,
    };

    this.canvas = null;
    this.ctx = null;

    this.pointsOfPolygons = [];
    this.pointsAll = null;
    this.pointsOfIntersection = [];

    this.merge = this.merge.bind(this);
    this.clear = this.clear.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.drawLine = this.drawLine.bind(this);
    this.makeMoreCoordinates = this.makeMoreCoordinates.bind(this);
    this.getPointsOfMergedPolygons = this.getPointsOfMergedPolygons.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('shouldComponentUpdate');
  //   return ;
  // }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');

    const { width, height } = this.props;
    this.pointsAll = new Array(height);
    for (let i = 0 ; i < height ; i++) {
      this.pointsAll[i] = new Array(width).map(() => new Object());
      for (let j = 0 ; j < width ; j++) {
        this.pointsAll[i][j] = {
          cnt: 0,
          color: [],
          orderOfPolygon: [],
        }
      }
    }
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
    const nop = this.state.numberOfPolygon;
    const p = this.pointsAll[y][x];

    this.pointsOfPolygons[nop] = [{ x, y, color: this.props.colorOption}];
    p.cnt += 1;
    p.color.push(this.props.colorOption);
    p.orderOfPolygon.push(nop);
    if (p.cnt === 2) {
      this.pointsOfIntersection.push({ x, y });
    }

    this.setState({ isClicked: true });
  }

  onMouseMove(e) {
    if (!this.state.isClicked) return [];
    const ctx = this.ctx;
    const { x, y } = this.getCursorPosition(e);

    if (!hasPointInArray(this.pointsOfPolygons[this.state.numberOfPolygon], {x, y})) {
      const start = this.pointsOfPolygons[this.state.numberOfPolygon].slice(-1)[0];
      this.drawLine(ctx, start, { x, y });

      this.pointsOfPolygons[this.state.numberOfPolygon].push({ x, y, color: this.props.colorOption });

      const p = this.pointsAll[y][x];
      p.cnt += 1;
      p.color.push(this.props.colorOption);
      p.orderOfPolygon.push(this.state.numberOfPolygon);
      if (p.cnt === 2) {
        this.pointsOfIntersection.push({ x, y });
      }
    }
  }

  onMouseOut(e) {
    if (!this.state.isClicked) return [];
    const ctx = this.ctx;
    let { x, y } = this.getCursorPosition(e);
    const start = this.pointsOfPolygons[this.state.numberOfPolygon][0];
    x = x > 500 ? 499 : x;
    y = y > 500 ? 499 : y;
    this.pointsOfPolygons[this.state.numberOfPolygon].push({ x, y, color: this.props.colorOption });
    this.drawLine(ctx, start, { x, y });

    this.setState((state) => ({
      isClicked: false,
      numberOfPolygon: ++state.numberOfPolygon,
    }));
  }

  onMouseUp(e) {
    const ctx = this.ctx;
    const { x, y } = this.getCursorPosition(e);
    const start = this.pointsOfPolygons[this.state.numberOfPolygon][0];
    this.pointsOfPolygons[this.state.numberOfPolygon].push({ x, y, color: this.props.colorOption });

    this.drawLine(ctx, start, { x, y });

    this.setState((state) => ({
      isClicked: false,
      numberOfPolygon: ++state.numberOfPolygon,
    }));
  }

  drawLine(ctx, start, dest) {
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = Color[this.props.colorOption];
    ctx.globalCompositeOperation = 'source-over';
    ctx.moveTo(dest.x, dest.y);
    ctx.lineTo(start.x, start.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  makeMoreCoordinates() {
    const tempPointsOfPolygons = [];
    for (let orderOfPolygon in this.pointsOfPolygons) {
      const points = this.pointsOfPolygons[orderOfPolygon];
      const tempPoints = [];
      for (let index in points) {
        if (Number(index) === points.length-1) break;
        tempPoints.push(points[index]);

        const xSpacing = points[index*1+1].x - points[index].x;
        const ySpacing = points[index*1+1].y - points[index].y;

        if (Math.abs(xSpacing) > 1 || Math.abs(ySpacing) > 1) {
          for (let newPoint of getCoordinates(points[index], points[index*1+1], xSpacing, ySpacing)) {
            tempPoints.push(newPoint);
            const p = this.pointsAll[newPoint.y][newPoint.x];
            p.cnt += 1;
            p.color.push(newPoint.color);
            p.orderOfPolygon.push(Number(orderOfPolygon));
            if (p.cnt === 2) {
              const { x, y } = newPoint;
              this.pointsOfIntersection.push({ x, y });
            }
          }
        }
      }
      tempPoints.push(points[points.length-1]);

      // make last line. there was only visible line.
      const xSpacing = points[0].x - points[points.length-1].x;
      const ySpacing = points[0].y - points[points.length-1].y;

      for (let newPoint of getCoordinates(points[points.length-1], points[0], xSpacing, ySpacing)) {
        tempPoints.push(newPoint);
        this.pointsAll[newPoint.y][newPoint.x].cnt += 1;
      }

      tempPointsOfPolygons.push(tempPoints);
    }
    this.pointsOfPolygons = tempPointsOfPolygons;
  }

  getPointsOfMergedPolygons() {
    
  }

  merge() {
    this.makeMoreCoordinates();
    this.pointsOfPolygons = this.getPointsOfMergedPolygons();
    // this.reDraw();
    console.log('pointsOfIntersection', this.pointsOfIntersection);
  }

  clear() {
    const { width, height } = this.props;
    this.pointsOfPolygons = [];
    this.pointsAll = new Array(height);
    for (let i = 0; i < height; i++) {
      this.pointsAll[i] = new Array(width).map(() => new Object());
      for (let j = 0; j < width; j++) {
        this.pointsAll[i][j] = {
          cnt: 0,
          color: [],
          orderOfPolygon: [],
        }
      }
    }
    this.ctx.clearRect(0, 0, width, height);
    this.setState({
      isClicked: false,
      numberOfPolygon: 0,
    });
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
        <div>현재 도형 갯수: {this.state.numberOfPolygon}</div>
      </div>
    );
  }
};

Canvas.protoTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  colorOption: PropTypes.string,
};
