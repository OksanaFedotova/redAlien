export const getRange = (arr) => {
    const result = [[arr[0][0], arr[0][1]], [arr[arr.length-1][0] + 64, arr[arr.length-1][1] + 64]];
    return result;
};

export const getOverlap = (obj, coord) => {
    if (obj.x >= coord[0][0] && obj.y >= coord[0][1] && obj.x <= coord[coord.length-1][0]) {
        return true;
    }
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
