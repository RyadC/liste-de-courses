function formattingInputValue(inputValue) {
  let inputValueTrimed = inputValue.trim();

  let arraySplitInputValueTrimed = inputValueTrimed.split(/( )+/);

 let inputValueWithoutMultipleSpaces = arraySplitInputValueTrimed.join('');

 let firstLetterInCapital = inputValueWithoutMultipleSpaces[0].toUpperCase();

 let restOfWord = inputValueWithoutMultipleSpaces.slice(1)

 let inputValueFormatted = firstLetterInCapital + restOfWord

  return inputValueFormatted;
}


export {
  formattingInputValue,
}

// dd      ccc  d d d             ddd     d