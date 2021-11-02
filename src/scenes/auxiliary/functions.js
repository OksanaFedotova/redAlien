export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
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
        result = numberOne / numberTwo;
        break;
      default:
    }
    return result;
  };

  const getDivision = (a, b) => {
    const factor1 = getRandomInt(0, a);
    let factor2 = getRandomInt(0, b);
    while (factor2 === 0) {
      factor2 = getRandomInt(11);
    }
    const randomNumberOne = factor1 * factor2;
    const randomNumberTwo = factor2;
    return [randomNumberOne, randomNumberTwo]
  }
  const getProblem = (level) => {

    let randomNumberOne, randomNumberTwo, operator, index;
    const operators = ['+', '-', '*', '÷'];

    switch (level) {
      case 1:
        randomNumberOne = getRandomInt(0, 11);
        randomNumberTwo = getRandomInt(0, 11);
        index = getRandomInt(0, 2);
        operator = operators[index];
        break;
      case 2:
        randomNumberOne = getRandomInt(0, 20);
        randomNumberTwo = getRandomInt(0, 20);
        index = getRandomInt(0, 3);
        operator = operators[index];
        break;
      case 3:
        index = getRandomInt(0, 4);
        operator = operators[index];
        if (index === 3) {
          let randomNumers = getDivision(11, 11);
          [randomNumberOne, randomNumberTwo] = randomNumers;
          break;
        }
        randomNumberOne = getRandomInt(0, 21);
        randomNumberTwo = getRandomInt(0, 21);
        break;
      case 4:
        index = getRandomInt(0, 4);
        operator = operators[index];
        if (index === 3) {
          let randomNumers = getDivision(21, 11);
          [randomNumberOne, randomNumberTwo] = randomNumers;
          break;
        }
        randomNumberOne = getRandomInt(0, 101);
        randomNumberTwo = getRandomInt(0, 101);
        break;
        case 5:
        index = getRandomInt(0, 4);
        operator = operators[index];
        if (index === 3) {
          let randomNumers = getDivision(101, 51);
          [randomNumberOne, randomNumberTwo] = randomNumers;
          break;
        }
        randomNumberOne = getRandomInt(0, 1001);
        randomNumberTwo = getRandomInt(0, 1001);
        break;
        default:
        level = 1;
    }
    //[randomNumberOne, randomNumberTwo] = randomNumberOne < randomNumberTwo && index===2 ? [randomNumberTwo, randomNumberOne]:[randomNumberOne, randomNumberTwo]
    return [randomNumberOne, randomNumberTwo, operator]
  };

  export const getQuestion = (level) => {

    const [randomNumberOne, randomNumberTwo, operator] = getProblem(level)
    const question = `${randomNumberOne} ${operator} ${randomNumberTwo}`;
    const correctAnswer = calculate(randomNumberOne, operator, randomNumberTwo);
    return [question, correctAnswer];
  };
  
 export const getOptions = (correctAnswer) => {
   const rand1 = getRandomInt(1, 5);
   const rand2 = getRandomInt(1, 5);
   const option1 = correctAnswer + rand1;
   const option2 = correctAnswer - rand2;
   /*
    let option1 = getRandomInt(correctAnswer + 5);
    let option2 = getRandomInt(correctAnswer + 6);
    if (option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
        while(option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
            option1 = getRandomInt(correctAnswer + 6);
            option2 = getRandomInt(correctAnswer + 5);
        }
    }
    */
    return [option1, option2];
};

