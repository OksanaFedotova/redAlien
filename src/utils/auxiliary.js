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
  const result = [];
  let inner = [];

  array.forEach((line, i) => {
    inner.push(line);
    const next = array[i + 1];
    const chains = next && line.x2 === next.x1;

    if (!chains) {
      const first = inner[0];
      const last = inner[inner.length - 1];
      result.push(new Phaser.Geom.Line(first.x1, first.y1, last.x2, last.y2));
      inner = [];
    }
  });

  return result;
}

export function slopeYAt(slope, x) {
  const t = Phaser.Math.Clamp((x - slope.x1) / (slope.x2 - slope.x1), 0, 1);
  return slope.y1 + (slope.y2 - slope.y1) * t;
}

export function findSlopeAt(slopes, x) {
  return slopes.find((s) => x >= Math.min(s.x1, s.x2) && x <= Math.max(s.x1, s.x2));
}

export function findSlopeOverlapping(slopes, body) {
  return slopes.find((s) => {
    const min = Math.min(s.x1, s.x2);
    const max = Math.max(s.x1, s.x2);
    return body.right > min && body.left < max;
  });
}
