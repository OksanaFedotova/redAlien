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
        result = numberOne / numberTwo;
        break;
      default:
    }
    return result;
  };

  const getProblem = (level) => {

    let randomNumberOne, randomNumberTwo, operator, index;
    const operators = ['+', '-', '*', '÷'];

    switch (level) {
      case 1:
        randomNumberOne = getRandomInt(11);
        randomNumberTwo = getRandomInt(11);
        index = getRandomInt(2);
        operator = operators[index];
        break;
      case 2:
        randomNumberOne = getRandomInt(20);
        randomNumberTwo = getRandomInt(20);
        index = getRandomInt(3);
        operator = operators[index];
        break;
      case 3:
        index = getRandomInt(4);
        operator = operators[index];
        if (index === 3) {
          const factor1 = getRandomInt(10);
          const factor2 = getRandomInt(10);
          console.log(factor1, factor2)
          randomNumberOne = factor1 * factor2;
          randomNumberTwo = factor2;
          break;
        }
        randomNumberOne = getRandomInt(21);
        randomNumberTwo = getRandomInt(21);
        break;
      case 4:
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
    //console.log(randomNumberOne, randomNumberTwo)
    [randomNumberOne, randomNumberTwo] = randomNumberOne < randomNumberTwo && index===2 ? [randomNumberTwo, randomNumberOne]:[randomNumberOne, randomNumberTwo]
    return [randomNumberOne, randomNumberTwo, operator]
  };

  export const getQuestion = (level) => {

    const [randomNumberOne, randomNumberTwo, operator] = getProblem(level)
    const question = `${randomNumberOne} ${operator} ${randomNumberTwo}`;
    const correctAnswer = calculate(randomNumberOne, operator, randomNumberTwo);
    return [question, correctAnswer];
  };
  
 export const getOptions = (correctAnswer) => {
    let option1 = getRandomInt(correctAnswer + 5);
    let option2 = getRandomInt(correctAnswer + 6);
    if (option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
        while(option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
            option1 = getRandomInt(correctAnswer + 6);
            option2 = getRandomInt(correctAnswer + 5);
        }
    }
    
    return [option1, option2];
};

