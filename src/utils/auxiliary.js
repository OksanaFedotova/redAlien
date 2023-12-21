import Phaser from 'phaser';
export const getRange = (arr) => {
  let inner = [];
  let res = [];
  arr
    .flatMap((el) => el[0])
    .map((el, i, a) => {
      if (el + 128 === a[i + 1]) {
        inner.push(el);
      } else {
        inner.push(a[i]);
        res.push(inner);
        inner = [];
      }
    });
  return res.map((inner) => {
    return [inner[0], inner[inner.length - 1] + 128];
  });
};

export const getOverlap = (obj, coord) => {
  if (obj.x >= coord[0][0] && obj.y >= coord[0][1] && obj.x <= coord[coord.length - 1][0]) {
    return true;
  }
};
export const isClose = (obj, coord) => {
  return coord.some((inner) => {
    const start = inner[0];
    const end = inner[1];
    if (obj.x >= start && obj.x <= end) return true;
  });
};
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function getSlopes(array) {
  let inner = [];
  console.log(array);
  return array
    .map((line, i, arr) => {
      if (arr[i + 1]) {
        if (line.x2 === arr[i + 1].x1) {
          inner.push(line);
          inner.push(arr[i + 1]);
        } else if (line.x2 !== arr[i + 1].x1) {
          console.log(inner)
        //  if (inner[0].x1 && inner[0].y1 && inner[inner.length - 1].x2 && inner[inner.length - 1].y2) {
          const newLine = new Phaser.Geom.Line(
            inner[0].x1,
            inner[0].y1,
            inner[inner.length - 1].x2,
            inner[inner.length - 1].y2
          );
          inner = [];
          return newLine;
         // }
        }
      } else {
        if (inner.length) {
          const newLine = new Phaser.Geom.Line(
            inner[0].x1,
            inner[0].y1,
            inner[inner.length - 1].x2,
            inner[inner.length - 1].y2
          );
          inner = [];
          return newLine;
        }
      }
    })
    .filter((line) => line);
}
