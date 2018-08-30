const hasPointInArray = (targetArray, point) => { // point: {x, y}
  for (let t of targetArray) {
    let cnt = 0;
    for (let k of Object.keys(point)) {
      if (t[k] === point[k]) cnt++;
    }
    if (cnt === Object.keys(point).length) return true;
  }
  return false;
}

export {
  hasPointInArray,
}
