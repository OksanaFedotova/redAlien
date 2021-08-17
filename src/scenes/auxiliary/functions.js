export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  export const calculate = (numberOne, sign, numberTwo) => {
    let result = 0;
    switch (sign) {
      case '+':
        result = numberOne + numberTwo;
        break;
      case '-':
        result = numberOne - numberTwo;
        break;
      case '*':
        result = numberOne * numberTwo;
        break;
      case '÷':
        result = numberOne % numberTwo;
        break;
      default:
    }
    return result;
  };

  export const getQuestion = (level) => {

    let randomNumberOne, randomNumberTwo, operator, index;
    const operators = ['+', '-', '*', '÷'];

    switch (level) {
      case '1':
        randomNumberOne = getRandomInt(11);
        randomNumberTwo = getRandomInt(11);
        index = getRandomInt(2);
        operator = operators[index];
        break;
      case '2':
        randomNumberOne = getRandomInt(101);
        randomNumberTwo = getRandomInt(101);
        index = getRandomInt(2);
        operator = operators[index];
        break;
      case '3':
        index = getRandomInt(4);
        if (index === 3) {
          const factor1 = getRandomInt(11);
          const factor2 = getRandomInt(11)
          randomNumberOne = factor1 * factor2;
          randomNumberTwo = factor2;
        }
        randomNumberOne = getRandomInt(11);
        randomNumberTwo = getRandomInt(11);
        operator = operators[index];
        break;
      case '4':
        index = getRandomInt(4);
        if (index === 3) {
          const factor1 = getRandomInt(101);
          const factor2 = getRandomInt(101)
          randomNumberOne = factor1 * factor2;
          randomNumberTwo = factor2;
        }
        randomNumberOne = getRandomInt(101);
        randomNumberTwo = getRandomInt(101);
        operator = operators[index];
        break;
      default:
    }
    [randomNumberOne, randomNumberTwo] = randomNumberOne < randomNumberTwo && index===2 ? [randomNumberTwo, randomNumberOne]:[randomNumberOne, randomNumberTwo]
    return [randomNumberOne, randomNumberTwo, operator]
  };
