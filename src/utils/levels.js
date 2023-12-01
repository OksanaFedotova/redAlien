export const level = {
  value: 3,
  restartGame: false,
};
const levels = [1, 2, 3];
export const select = document.createElement('select');
levels.map((level) => {
  const option = document.createElement('option');
  option.innerText = `Уровень ${level}`;
  option.value = level;
  select.append(option);
});
