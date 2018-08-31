import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
import Color from '../constants/color';
import { hasPointInArray, getCoordinates } from '../utils/coordinatesUtils';
// import Styled from 'styled-components';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      numberOfPolygon: 0,
      numberOfIntersection: 0,
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
    this.getMiddleOfIntersections = this.getMiddleOfIntersections.bind(this);
    this.getOutlines = this.getOutlines.bind(this);
    this.reDraw = this.reDraw.bind(this);
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
      // eslint-disable-next-line
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
      this.drawLine(ctx, start, { x, y }, this.props.colorOption);

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
    this.drawLine(ctx, start, { x, y }, this.props.colorOption);

    this.setState((state) => ({
      isClicked: false,
      numberOfPolygon: ++state.numberOfPolygon,
    }));
  }

  onMouseUp(e) {
    const ctx = this.ctx;
    const that = this;
    const { x, y } = this.getCursorPosition(e);
    const start = this.pointsOfPolygons[this.state.numberOfPolygon][0];
    this.pointsOfPolygons[this.state.numberOfPolygon].push({ x, y, color: this.props.colorOption });

    this.drawLine(ctx, start, { x, y }, this.props.colorOption);
    this.setState((state) => ({
      isClicked: false,
      numberOfPolygon: ++state.numberOfPolygon,
    }));
  }

  drawLine(ctx, start, dest, color) {
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = Color[color];
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
        const p = this.pointsAll[newPoint.y][newPoint.x];
        p.cnt += 1;
        p.color.push(newPoint.color);
        p.orderOfPolygon.push(Number(orderOfPolygon));
        if (p.cnt === 2) {
          const { x, y } = newPoint;
          this.pointsOfIntersection.push({ x, y });
        }
      }
      tempPointsOfPolygons.push(tempPoints);
    }
    this.pointsOfPolygons = tempPointsOfPolygons;
  }

  getPointsOfMergedPolygons() {
    return this.getOutlines(this.getMiddleOfIntersections());
  }

  getMiddleOfIntersections() {
    const pointsOfPolygons = this.pointsOfPolygons;
    const intersectionOnPolygons = new Array(this.state.numberOfPolygon);
    const middleOfIntersections = [];

    for (let i in pointsOfPolygons) {
      intersectionOnPolygons[i] = [];
      for (let point of this.pointsOfIntersection) {
        const index = pointsOfPolygons[i].findIndex((v) => v.x === point.x && v.y === point.y);
        if (index > -1) intersectionOnPolygons[i].push(index);
      }
      intersectionOnPolygons[i].sort((a, b) => a - b);
    }

    for (let i in intersectionOnPolygons) {
      const middlePoints = [];
      for (let j in intersectionOnPolygons[i]) {
        if (Number(j) !== intersectionOnPolygons[i].length -1) {
          middlePoints.push(Math.floor((intersectionOnPolygons[i][j] + intersectionOnPolygons[i][j*1+1]) / 2));
        } else {
          const indexMiddlePoint = Math.floor((intersectionOnPolygons[i][0] + pointsOfPolygons[i].length - 1 - intersectionOnPolygons[i][j]) / 2);
          if (indexMiddlePoint + intersectionOnPolygons[i][j] < pointsOfPolygons[i].length) {
            middlePoints.push(indexMiddlePoint + intersectionOnPolygons[i][j]);
          } else {
            middlePoints.push(intersectionOnPolygons[i][j] + indexMiddlePoint - (pointsOfPolygons[i].length - 1));
          }
        }
      }
      middleOfIntersections.push(middlePoints);
    }
    return middleOfIntersections;
  }

  getOutlines(middleOfIntersections) {
    const newPointsOfPolygons = [];

    for (let i in middleOfIntersections) {
      let newPolygon = [];
      const originPolygon = this.pointsOfPolygons[i];
      for (let j in middleOfIntersections[i]) {
        const { x: xMiddle, y: yMiddle, color} = originPolygon[middleOfIntersections[i][j]];
        const xInCanvas = this.pointsAll[yMiddle];
        let polygonsOnLeftside = [];
        let polygonsOnRightside = [];

        for (let direction = 0; direction < 2; direction++) {
          const start = direction === 0 ? 0 : xMiddle + 1;
          const end = direction === 0 ? xMiddle : xInCanvas.length;
          for (let m = start; m < end ; m++) {
            const x_m = xInCanvas[m];
            if (x_m.cnt > 0
            && x_m.color.includes(color)
            && !x_m.orderOfPolygon.includes(i)) {
              if (direction === 0) {
                if (polygonsOnLeftside.includes(x_m.orderOfPolygon[0]) > -1) {
                  polygonsOnLeftside.splice(polygonsOnLeftside.indexOf(x_m.orderOfPolygon[0]), 1);
                } else {
                  polygonsOnLeftside.push(x_m.orderOfPolygon[0]);
                  // console.log('left');
                }
              } else {
                if (polygonsOnRightside.includes(x_m.orderOfPolygon[0]) > -1) {
                  polygonsOnRightside.splice(polygonsOnRightside.indexOf(x_m.orderOfPolygon[0]), 1);
                } else {
                  polygonsOnRightside.push(x_m.orderOfPolygon[0]);
                  // console.log('rigth');
                }
              }
            }
          }
        }
        console.log(polygonsOnLeftside, polygonsOnRightside);
        if (!polygonsOnLeftside.length || !polygonsOnRightside.length) {
          if (j < middleOfIntersections[i].length-1) {
            newPolygon = newPolygon.concat(originPolygon.slice(this.pointsOfIntersection[i][j], this.pointsOfIntersection[i][j*1+1]));
          } else {
            newPolygon = newPolygon.concat(originPolygon.slice(this.pointsOfIntersection[i][j]));
            if (this.pointsOfIntersection[i][0] > 0) {
              newPolygon = newPolygon.concat(originPolygon.slice(0, this.pointsOfIntersection[i][0]));
            }
          }
        }
      }
      newPointsOfPolygons.push(newPolygon);
    }
    return newPointsOfPolygons;
  }

  reDraw() {
    const ctx = this.ctx;
    const { width, height } = this.props;
    ctx.clearRect(0, 0, width, height);

    for (let polygon of this.pointsOfPolygons) {
      for (let indexPoint in polygon) {
        if (Number(indexPoint) !== polygon.length - 1) {
          this.drawLine(
            ctx,
            polygon[indexPoint],
            polygon[indexPoint*1+1],
            polygon[indexPoint].color
          );
        } else {
          this.drawLine(
            ctx,
            polygon[0],
            polygon[polygon.length - 1],
            polygon[0].color
          );
        }
      }
    }

  }

  merge() {
    this.makeMoreCoordinates();

    const poi = this.pointsOfIntersection;
    console.log('교차점 => ', poi.length);
    if (poi.length === 0 || poi.length % 2 !== 0) {
      alert('교차점이 제대로 형성되지 않았습니다. 천천히 다시 그려주세요.');
      this.clear();
      return;
    }

    this.pointsOfPolygons = this.getPointsOfMergedPolygons();
    this.reDraw();
  }

  clear() {
    const { width, height } = this.props;
    this.pointsOfPolygons = [];
    this.pointsAll = new Array(height);
    for (let i = 0; i < height; i++) {
      // eslint-disable-next-line
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
