let tiles = {
  rowGrass: [2, 6, 7, 8, 9],
  soil: 20,
  soilRight: 21,
  soilLeft: 25,
  grass: 35,
  grassBottomLeft: 36,
  grassBottom: 37,
  grassRight: 38,
  grassLeft: 39,
  grassBottomRight: 40,
  slope: {
    slopeLeft: [3, 1],
  },
};
export const createRowGrass = (
  x,
  y,
  layer,
  length = 5,
  indices = tiles.rowGrass
) => {
  const tiles = [];
  indices.map((index, i) => {
    if (i > length - 1) {
      return;
    }
    const tile = layer.putTileAtWorldXY(index, x, y, true);
    tile.properties = {
      collides: true,
    };
    x += tile.width / 2;
    tiles.push(tile);
  });
  return tiles;
};

export const createSoilRow = (layer, index, x, y, length = 1) => {
  for (let i = 0; i < length; i++) {
    const tile = layer.putTileAtWorldXY(index, x, y);
    x += tile.width / 2;
  }
};

export const createLeftSlope = (
  layer,
  indices,
  x,
  y,
  scene,
  height = 1,
  soilIndex = 20,
  grassIndex = 2
) => {
  let diff;
  const xLeft = x;
  const yLeft = y;
  for (let i = height; i > 0; i--) {
    indices.map((index) => {
      const tile = layer.putTileAtWorldXY(index, x, y);
      diff = tile.width / 2;
      y -= diff;
    });
    x += diff;
    y += diff;
    let length = 3;
    createRowGrass(x, y, layer, length);
    createSoilRow(layer, soilIndex, x, y + diff, i + length - 1);
  }
  const line = new Phaser.Geom.Line(xLeft - 44, yLeft, x - 44, y);
  var graphics = scene.add.graphics({
    lineStyle: { width: 2, color: "black" },
  });
  graphics.strokeLineShape(line);
  return line;
};

export const createRightSlope = (
  layer,
  indices,
  x,
  y,
  scene,
  height = 1,
  soilIndex = 20,
  grassIndex = 2
) => {
  let diff;
  const xLeft = x;
  const yLeft = y;
  for (let i = height; i > 0; i--) {
    indices.map((index) => {
      const tile = layer.putTileAtWorldXY(index, x, y);
      diff = tile.width / 2;
      y -= diff;
    });
    x += diff;
    y += diff;
    let length = 3;
    createRowGrass(x, y, layer, length);
    createSoilRow(layer, soilIndex, x, y + diff, i + length - 1);
  }
  const line = new Phaser.Geom.Line(xLeft - 44, yLeft, x - 44, y);
  var graphics = scene.add.graphics({
    lineStyle: { width: 2, color: "black" },
  });
  graphics.strokeLineShape(line);
  return line;
};
