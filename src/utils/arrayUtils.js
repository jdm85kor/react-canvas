const hasPointInArray = (targetArray, point) => { // point: {x, y}
  for (let t of targetArray) {
    let cnt = 0;
    for (let k of Object.keys(point)) {
      if (t[k] === point[k]) cnt++;
    }
    if (cnt === Object.keys(point).length) return true;
  }
  return false;
};

const getCoordinates = (start, dest, xSpacing, ySpacing) => {
  if (!xSpacing && !ySpacing) return;

  const points = [];
  let { x, y } = start;
  let xDirection = 1, yDirection = 1;
  let diagonal = 0, quotient = 0;
  let reminder = 0, reminderInterval = 0;

  if (xSpacing && ySpacing) {
    if (xSpacing < 0) xDirection *= -1;
    if (ySpacing < 0) yDirection *= -1;
    diagonal = Math.min(Math.abs(xSpacing), Math.abs(ySpacing));

    if (Math.abs(xSpacing) - Math.abs(ySpacing) === 0) {
      for (let i = 0 ; i < diagonal -1 ; i++) {
        x += xDirection;
        y += yDirection;
        points.push({x, y, color: start.color});
      }
    } else if (diagonal - Math.abs(ySpacing) === 0) {
      quotient = Math.floor((Math.abs(xSpacing) - diagonal - 1) / diagonal);
      reminder = (Math.abs(xSpacing) - diagonal - 1) % diagonal;
      reminderInterval = reminder > 0 ? Math.floor(diagonal / reminder) : 1;
      for (let i = 0; i < diagonal ; i++) {
        x += xDirection;
        y += yDirection;
        points.push({x, y, color: start.color});
        for (let j = 0; j < quotient ; j++) {
          x += xDirection;
          points.push({x, y, color: start.color});
        }
        if (reminder > 0 && i % reminderInterval === 0) {
          x += xDirection;
          points.push({x, y, color: start.color});
          reminder--;
        }
      }
    } else {
      quotient = Math.floor((Math.abs(ySpacing) - diagonal - 1) / diagonal);
      reminder = (Math.abs(ySpacing) - diagonal - 1) % diagonal;
      reminderInterval = reminder > 0 ? Math.floor(diagonal / reminder) : 1;
      for (let i = 0; i < diagonal; i++) {
        x += xDirection;
        y += yDirection;
        points.push({ x, y, color: start.color });
        for (let j = 0; j < quotient; j++) {
          y += yDirection;
          points.push({ x, y, color: start.color });
        }
        if (reminder > 0 && i % reminderInterval === 0) {
          y += yDirection;
          points.push({ x, y, color: start.color });
          reminder--;
        }
      }
    }
  } else if (!ySpacing) {
    if (xSpacing < 0) xDirection *= -1;
    for (let i = 1 ; i < Math.abs(xSpacing) ; i++) {
      x += xDirection;
      points.push({ x, y, color: start.color});
    }
  } else if (!xSpacing) {
    if (ySpacing < 0) yDirection *= -1;
    for (let i = 1 ; i < Math.abs(ySpacing) ; i++) {
      y += yDirection;
      points.push({ x, y, color: start.color });
    }
  }

  return points;
};

export {
  hasPointInArray,
  getCoordinates,
}
