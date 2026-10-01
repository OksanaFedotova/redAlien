/**
 * Процедурный генератор уровней для игры (Phaser + Tiled JSON).
 *
 * Совместим с текущими тайлсетами:
 * grassCliff / hills / special / water / grass / dirt
 *
 * Свойства тайлов:
 * collides / hill / dangerous / special
 *
 * Слои:
 * ground / checkpoints / enemies
 *
 * Запуск:
 * node generate-level.js [seed] [outputPath]
 *
 * Пример:
 * node generate-level.js 42 ./level_2.json
 */

import { writeFileSync } from 'fs';

// ============================================================
// НАСТРОЙКИ
// ============================================================

const CONFIG = {
  width: 75,
  height: 8,
  tileSize: 128,

  // Строка поверхности.
  // Чем меньше row — тем выше поверхность.
  minGroundRow: 3,
  maxGroundRow: 6,

  flatRunMin: 3,
  flatRunMax: 8,

  waterChance: 0.12,
  waterRunMin: 2,
  waterRunMax: 3,

  chestChance: 0.06,

  enemyEvery: [8, 16],

  // расстояние между checkpoint в пикселях
  checkpointEvery: 900,

  // безопасные начало и конец карты
  edgePadding: 4,
};

// ============================================================
// СИДИРУЕМЫЙ PRNG
// ============================================================

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ============================================================
// TILESETS
// ============================================================

const TILESETS = [
  // ----------------------------------------------------------
  // grassCliff
  // firstgid = 1
  // ----------------------------------------------------------
  {
    columns: 4,
    firstgid: 1,
    image: 'tiles/grassCliff.png',
    imageheight: 128,
    imagewidth: 512,
    margin: 0,
    name: 'grassCliff',
    spacing: 0,
    tilecount: 4,
    tileheight: 128,
    tilewidth: 128,

    tiles: [0, 1, 2, 3].map((id) => ({
      id,
      properties: [
        {
          name: 'collides',
          type: 'bool',
          value: true,
        },
      ],
    })),
  },

  // ----------------------------------------------------------
  // hills
  // firstgid = 5
  //
  // Реальные тайлы:
  //
  // 0 = hill left
  // 1 = внутренний/заполняющий
  // 2 = внутренний/заполняющий
  // 3 = плоский
  // 4 = плоский
  // 5 = плоский
  // 6 = плоский
  // 7 = hill right
  // ----------------------------------------------------------
  {
    columns: 8,
    firstgid: 5,
    image: 'tiles/hills.png',
    imageheight: 128,
    imagewidth: 1024,
    margin: 0,
    name: 'hills',
    spacing: 0,
    tilecount: 8,
    tileheight: 128,
    tilewidth: 128,

    tiles: [
      {
        id: 0,
        properties: [
          {
            name: 'hill',
            type: 'string',
            value: 'left',
          },
        ],
      },

      {
        id: 3,
        properties: [
          {
            name: 'collides',
            type: 'bool',
            value: true,
          },
        ],
      },

      {
        id: 4,
        properties: [
          {
            name: 'collides',
            type: 'bool',
            value: true,
          },
        ],
      },

      {
        id: 5,
        properties: [
          {
            name: 'collides',
            type: 'bool',
            value: true,
          },
        ],
      },

      {
        id: 6,
        properties: [
          {
            name: 'collides',
            type: 'bool',
            value: true,
          },
        ],
      },

      {
        id: 7,
        properties: [
          {
            name: 'hill',
            type: 'string',
            value: 'right',
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  // special
  // firstgid = 13
  // ----------------------------------------------------------
  {
    columns: 7,
    firstgid: 13,
    image: 'tiles/special.png',
    imageheight: 128,
    imagewidth: 896,
    margin: 0,
    name: 'special',
    spacing: 0,
    tilecount: 7,
    tileheight: 128,
    tilewidth: 128,

    tiles: [0, 1, 2, 3, 4, 5, 6].map((id) => ({
      id,

      properties: [
        {
          name: 'collides',
          type: 'bool',
          value: true,
        },
        {
          name: 'special',
          type: 'bool',
          value: true,
        },
      ],
    })),
  },

  // ----------------------------------------------------------
  // water
  // firstgid = 20
  // ----------------------------------------------------------
  {
    columns: 17,
    firstgid: 20,
    image: 'tiles/water.png',
    imageheight: 128,
    imagewidth: 2176,
    margin: 0,
    name: 'water',
    spacing: 0,
    tilecount: 17,
    tileheight: 128,
    tilewidth: 128,

    tiles: [
      {
        id: 0,

        animation: Array.from({ length: 17 }, (_, tileid) => ({
          duration: 150,
          tileid,
        })),

        properties: [
          {
            name: 'dangerous',
            type: 'bool',
            value: true,
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  // grass
  // firstgid = 37
  //
  // 0 = левый край
  // 1 = середина
  // 2 = правый край
  // ----------------------------------------------------------
  {
    columns: 3,
    firstgid: 37,
    image: 'tiles/grass.png',
    imageheight: 128,
    imagewidth: 384,
    margin: 0,
    name: 'grass',
    spacing: 0,
    tilecount: 3,
    tileheight: 128,
    tilewidth: 128,

    tiles: [0, 1, 2].map((id) => ({
      id,

      properties: [
        {
          name: 'collides',
          type: 'bool',
          value: true,
        },
      ],
    })),
  },

  // ----------------------------------------------------------
  // dirt
  // firstgid = 40
  //
  // 0,1 = верхние/обрезанные варианты
  // 2 = обычная середина
  // 3 = низ
  // 4 = левый низ
  // 5 = правый край
  // 6 = правый низ
  // ----------------------------------------------------------
  {
    columns: 8,
    firstgid: 40,
    image: 'tiles/dirt.png',
    imageheight: 128,
    imagewidth: 1024,
    margin: 0,
    name: 'dirt',
    spacing: 0,
    tilecount: 8,
    tileheight: 128,
    tilewidth: 128,
  },
];

// ============================================================
// FIRST GID
// ============================================================

const FG = {
  grassCliff: 1,
  hills: 5,
  special: 13,
  water: 20,
  grass: 37,
  dirt: 40,
};

// ============================================================
// GID
// ============================================================

// ============================================================
// GID
// ============================================================

const GID = {
  // ----------------------------------------------------------
  // Hills
  // ----------------------------------------------------------

  hillLeft: FG.hills + 0,

  hillLeftFill: FG.hills + 1,

  hillRightFill: FG.hills + 2,

  hillFlat: (rng) => {
    const variants = [FG.hills + 3, FG.hills + 4, FG.hills + 5, FG.hills + 6];

    return variants[randInt(rng, 0, variants.length - 1)];
  },

  hillRight: FG.hills + 7,

  // ----------------------------------------------------------
  // Special
  // ----------------------------------------------------------

  special: (rng) => FG.special + randInt(rng, 0, 6),

  // ----------------------------------------------------------
  // Water
  // ----------------------------------------------------------

  water: FG.water + 0,

  // ----------------------------------------------------------
  // Grass
  // ----------------------------------------------------------

  // id 0 — левый край
  grassLeft: FG.grass + 0,

  // id 1 — середина
  grassMid: FG.grass + 1,

  // id 2 — правый край
  grassRight: FG.grass + 2,

  // ----------------------------------------------------------
  // Dirt
  // ----------------------------------------------------------

  // id 2 — обычный центральный dirt
  dirtNone: FG.dirt + 2,

  // id 3 — нижняя граница
  dirtBottom: FG.dirt + 3,

  // id 4 — левый нижний вариант
  dirtLeft: FG.dirt + 4,

  // id 5 — левый нижний угол
  dirtLeftBottom: FG.dirt + 5,

  // id 6 — правая граница
  dirtRight: FG.dirt + 6,

  // id 7 — правый нижний угол
  dirtRightBottom: FG.dirt + 7,

  // Обычный dirt внутри земли.
  dirtFill: () => FG.dirt + 2,

  // Тайлы под склонами
  dirtSlopeUnder: FG.dirt + 0,

  dirtSlopeUnderMirror: FG.dirt + 1,
};

function getSurfaceGid(terrain, col, rng) {
  const { width } = CONFIG;

  const tile = terrain[col];

  // ----------------------------------------------------------
  // Специальные типы
  // ----------------------------------------------------------

  if (tile.type === 'water') {
    return GID.water;
  }

  if (tile.type === 'chest') {
    return GID.special(rng);
  }

  if (tile.type === 'hillLeft') {
    return GID.hillLeft;
  }

  if (tile.type === 'hillRight') {
    return GID.hillRight;
  }

  // ----------------------------------------------------------
  // Определяем границы участка поверхности
  // ----------------------------------------------------------

  const left = terrain[col - 1];
  const right = terrain[col + 1];

  const isLeftEdge = col === 0 || !left || left.type === 'water' || left.row !== tile.row;

  const isRightEdge =
    col === width - 1 || !right || right.type === 'water' || right.row !== tile.row;

  // ----------------------------------------------------------
  // Левая боковая граница
  // grass id 0
  // ----------------------------------------------------------

  if (isLeftEdge) {
    return GID.grassLeft;
  }

  // ----------------------------------------------------------
  // Правая боковая граница
  // grass id 2
  // ----------------------------------------------------------

  if (isRightEdge) {
    return GID.grassRight;
  }

  // ----------------------------------------------------------
  // Центральная часть
  //
  // hills 4,5,6,7
  // grass 1
  // ----------------------------------------------------------

  const centerVariants = [FG.hills + 3, FG.hills + 4, FG.hills + 5, FG.hills + 6, FG.grass + 1];

  return centerVariants[randInt(rng, 0, centerVariants.length - 1)];
}
function generateTerrain(rng) {
  const {
    width,
    minGroundRow,
    maxGroundRow,
    flatRunMin,
    flatRunMax,
    waterChance,
    waterRunMin,
    waterRunMax,
    chestChance,
    edgePadding,
  } = CONFIG;

  const terrain = new Array(width);

  let row = randInt(rng, minGroundRow, maxGroundRow);

  let col = 0;

  // ----------------------------------------------------------
  // Безопасное начало
  // ----------------------------------------------------------

  for (; col < edgePadding; col++) {
    terrain[col] = {
      row,
      type: 'flat',
    };
  }

  // ----------------------------------------------------------
  // Основная карта
  // ----------------------------------------------------------

  while (col < width - edgePadding) {
    const available = width - edgePadding - col;

    const runLen = Math.min(randInt(rng, flatRunMin, flatRunMax), available);

    // --------------------------------------------------------
    // Вода
    // --------------------------------------------------------

    if (rng() < waterChance && runLen > waterRunMin + 2) {
      const waterLen = Math.min(randInt(rng, waterRunMin, waterRunMax), runLen - 2);

      const start = col + randInt(rng, 1, runLen - waterLen - 1);

      for (let i = 0; i < runLen; i++) {
        const currentCol = col + i;

        const isWater = currentCol >= start && currentCol < start + waterLen;

        terrain[currentCol] = {
          row,
          type: isWater ? 'water' : 'flat',
        };
      }
    }

    // --------------------------------------------------------
    // Обычный участок
    // --------------------------------------------------------
    else {
      for (let i = 0; i < runLen; i++) {
        const currentCol = col + i;

        const isChest = rng() < chestChance;

        terrain[currentCol] = {
          row,

          type: isChest ? 'chest' : 'flat',
        };
      }
    }

    col += runLen;

    if (col >= width - edgePadding) {
      break;
    }

    // --------------------------------------------------------
    // Изменение высоты
    // --------------------------------------------------------

    const canGoUp = row > minGroundRow;

    const canGoDown = row < maxGroundRow;

    if ((canGoUp || canGoDown) && rng() < 0.7) {
      const goUp = canGoUp && (!canGoDown || rng() < 0.5);

      if (goUp) {
        terrain[col] = {
          row,
          type: 'hillLeft',
        };

        row -= 1;
      } else {
        terrain[col] = {
          row,
          type: 'hillRight',
        };

        row += 1;
      }

      col++;
    }
  }

  // ----------------------------------------------------------
  // Безопасный конец
  // ----------------------------------------------------------

  for (; col < width; col++) {
    terrain[col] = {
      row,
      type: 'flat',
    };
  }

  return terrain;
}

// ============================================================
// КОЛОНКИ РЯДОМ СО СКЛОНАМИ
// ============================================================

function markNearRamp(terrain) {
  const near = new Array(terrain.length).fill(false);

  terrain.forEach((tile, index) => {
    if (tile.type === 'hillLeft' || tile.type === 'hillRight') {
      if (index > 0) {
        near[index - 1] = true;
      }

      near[index] = true;

      if (index + 1 < terrain.length) {
        near[index + 1] = true;
      }
    }
  });

  return near;
}

// ============================================================
// GROUND LAYER
// ============================================================

function buildGroundData(terrain, rng) {
  const { width, height } = CONFIG;

  const data = new Array(width * height).fill(0);

  const nearRamp = markNearRamp(terrain);

  const set = (row, col, gid) => {
    if (row >= 0 && row < height && col >= 0 && col < width) {
      data[row * width + col] = gid;
    }
  };

  // ----------------------------------------------------------
  // Проверяем, есть ли ЗЕМЛЯ в конкретной колонке на строке.
  //
  // Вода землёй не считается.
  //
  // Для обычной колонки земля начинается с row + 1,
  // потому что row — это поверхность.
  // ----------------------------------------------------------

  const hasDirtAt = (col, row) => {
    if (col < 0 || col >= width) {
      return false;
    }

    const tile = terrain[col];

    if (!tile) {
      return false;
    }

    // Вода не содержит dirt
    if (tile.type === 'water') {
      return false;
    }

    // Ниже поверхности находится земля
    return row > tile.row;
  };

  // ----------------------------------------------------------
  // Определяем, какой dirt нужен для конкретной клетки.
  //
  // leftBoundary  = слева больше нет земли
  // rightBoundary = справа больше нет земли
  // bottomBoundary = ниже больше нет земли
  // ----------------------------------------------------------

  const getDirtGid = (col, row) => {
    const leftExists = hasDirtAt(col - 1, row);

    const rightExists = hasDirtAt(col + 1, row);

    const belowExists = hasDirtAt(col, row + 1);

    const leftBoundary = !leftExists;

    const rightBoundary = !rightExists;

    const bottomBoundary = !belowExists;

    // --------------------------------------------------------
    // Нижние углы
    // --------------------------------------------------------

    // Левая + нижняя граница
    if (leftBoundary && bottomBoundary) {
      return GID.dirtLeftBottom;
    }

    // Правая + нижняя граница
    if (rightBoundary && bottomBoundary) {
      return GID.dirtRightBottom;
    }

    // --------------------------------------------------------
    // Нижняя граница
    // --------------------------------------------------------

    if (bottomBoundary) {
      return GID.dirtBottom;
    }

    // --------------------------------------------------------
    // Левая граница
    // --------------------------------------------------------

    if (leftBoundary) {
      return GID.dirtLeft;
    }

    // --------------------------------------------------------
    // Правая граница
    // --------------------------------------------------------

    if (rightBoundary) {
      return GID.dirtRight;
    }

    // --------------------------------------------------------
    // Обычный центральный dirt
    // --------------------------------------------------------

    return GID.dirtNone;
  };

  // ==========================================================
  // ОСНОВНАЯ ГЕНЕРАЦИЯ
  // ==========================================================

  for (let col = 0; col < width; col++) {
    const { row, type } = terrain[col];

    let surfaceGid = null;

    let underFillGid = null;

    let underTaperGid = null;

    // --------------------------------------------------------
    // WATER
    // --------------------------------------------------------

    if (type === 'water') {
      surfaceGid = GID.water;
    }

    // --------------------------------------------------------
    // SPECIAL
    // --------------------------------------------------------
    else if (type === 'chest') {
      surfaceGid = GID.special(rng);
    }

    // --------------------------------------------------------
    // HILL LEFT
    // --------------------------------------------------------
    if (type === 'hillLeft') {
      surfaceGid = GID.hillLeft;

      underFillGid = GID.hillLeftFill;

      underTaperGid = GID.dirtSlopeUnder;
    } else if (type === 'hillRight') {
      surfaceGid = GID.hillRight;

      underFillGid = GID.hillRightFill;

      underTaperGid = GID.dirtSlopeUnderMirror;
    } else {
      surfaceGid = getSurfaceGid(terrain, col, rng);
    }

    // --------------------------------------------------------
    // Поверхность
    // --------------------------------------------------------

    set(row, col, surfaceGid);

    // --------------------------------------------------------
    // Заполнение непосредственно под склоном
    // --------------------------------------------------------

    if (underFillGid !== null) {
      set(row + 1, col, underFillGid);
    }

    // --------------------------------------------------------
    // Специальный dirt-тайл под склоном
    // --------------------------------------------------------

    if (underTaperGid !== null) {
      set(row + 2, col, underTaperGid);
    }

    // --------------------------------------------------------
    // Обычное заполнение землёй
    // --------------------------------------------------------

    let startFill;

    if (underTaperGid !== null) {
      startFill = row + 3;
    } else if (underFillGid !== null) {
      startFill = row + 2;
    } else {
      startFill = row + 1;
    }

    for (let r = startFill; r < height; r++) {
      set(r, col, getDirtGid(col, r));
    }
  }

  return data;
}

// ============================================================
// OBJECT LAYERS
// ============================================================

function buildObjectLayers(terrain, rng) {
  const { width, tileSize, enemyEvery, checkpointEvery } = CONFIG;

  const checkpoints = [];

  const enemies = [];

  let nextObjId = 1;

  let lastCheckpointX = 0;

  let colsSinceEnemy = randInt(rng, ...enemyEvery);

  for (let col = 0; col < width; col++) {
    const { row, type } = terrain[col];

    // На воде и склонах объекты
    // не размещаем
    if (type === 'hillLeft' || type === 'hillRight' || type === 'water') {
      continue;
    }

    const x = col * tileSize + tileSize / 2;

    const yTop = row * tileSize;

    // --------------------------------------------------------
    // Checkpoint
    // --------------------------------------------------------

    if (x - lastCheckpointX >= checkpointEvery) {
      checkpoints.push({
        class: '',
        height: 0,

        id: nextObjId++,

        name: '',

        point: true,

        rotation: 0,

        visible: true,

        width: 0,

        x,

        y: yTop - 40,
      });

      lastCheckpointX = x;
    }

    // --------------------------------------------------------
    // Enemy
    // --------------------------------------------------------

    colsSinceEnemy--;

    if (colsSinceEnemy <= 0) {
      enemies.push({
        class: '',
        height: 0,

        id: nextObjId++,

        name: '',

        point: true,

        rotation: 0,

        visible: true,

        width: 0,

        x,

        y: yTop - 60,
      });

      colsSinceEnemy = randInt(rng, ...enemyEvery);
    }
  }

  return {
    checkpoints,
    enemies,
    nextObjId,
  };
}

// ============================================================
// СОЗДАНИЕ TILED JSON
// ============================================================

function generateLevel(seed) {
  const rng = mulberry32(seed);

  // 1. Генерируем рельеф
  const terrain = generateTerrain(rng);

  // 2. Создаём ground
  const groundData = buildGroundData(terrain, rng);

  // 3. Создаём объекты
  const { checkpoints, enemies, nextObjId } = buildObjectLayers(terrain, rng);

  // 4. Tiled JSON
  return {
    compressionlevel: -1,

    height: CONFIG.height,

    infinite: false,

    layers: [
      {
        data: groundData,

        height: CONFIG.height,

        id: 1,

        name: 'ground',

        opacity: 1,

        type: 'tilelayer',

        visible: true,

        width: CONFIG.width,

        x: 0,

        y: 0,
      },

      {
        draworder: 'topdown',

        id: 2,

        name: 'checkpoints',

        objects: checkpoints,

        opacity: 1,

        type: 'objectgroup',

        visible: true,

        x: 0,

        y: 0,
      },

      {
        draworder: 'topdown',

        id: 3,

        name: 'enemies',

        objects: enemies,

        opacity: 1,

        type: 'objectgroup',

        visible: true,

        x: 0,

        y: 0,
      },
    ],

    nextlayerid: 4,

    nextobjectid: nextObjId,

    orientation: 'orthogonal',

    renderorder: 'right-down',

    tiledversion: '1.10.1',

    tileheight: CONFIG.tileSize,

    tilesets: TILESETS,

    tilewidth: CONFIG.tileSize,

    type: 'map',

    version: '1.10',

    width: CONFIG.width,
  };
}

// ============================================================
// CLI
// ============================================================

const seedArg = process.argv[2] ? parseInt(process.argv[2], 10) : Date.now();

const outPath = process.argv[3] || `./level_${seedArg}.json`;

const level = generateLevel(seedArg);

writeFileSync(outPath, JSON.stringify(level, null, 2));

console.log(`Уровень сгенерирован (seed=${seedArg}) -> ${outPath}`);

console.log(`Размер карты: ${CONFIG.width} x ${CONFIG.height} тайлов`);

console.log(
  `Размер карты (px): ${CONFIG.width * CONFIG.tileSize} x ${CONFIG.height * CONFIG.tileSize}`
);
