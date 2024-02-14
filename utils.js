function formattingInputValue(inputValue) {
  // Enlever les espaces de début et de fin
  let inputValueTrimed = inputValue.trim();

  /*
  // Renvoie un tableau de la valeur séparée selon les espaces trouvés 
  let arraySplitInputValueTrimed = inputValueTrimed.split(/( )+/);

  // Forme une string en remplacant les espaces multiples par un seul espace
  let inputValueWithoutMultipleSpaces = arraySplitInputValueTrimed.join('');
  */

  // Forme une string en remplacant les espaces multiples par un seul espace
  let inputValueWithoutMultipleSpaces = inputValueTrimed.replaceAll(/( )+/g, ' ');

  // Récupère la 1ère lettre pour la mettre en majuscule
  let firstLetterInCapital = inputValueWithoutMultipleSpaces[0].toUpperCase();

  // Récupère le reste de la string
  let restOfWord = inputValueWithoutMultipleSpaces.slice(1)

  // Concatène la string entière afin d'avoir une string commençant par une majuscule
  let inputValueFormatted = firstLetterInCapital + restOfWord

  return inputValueFormatted;
}

function initializeInputValidity(e) {
  e.target.setCustomValidity('');
  e.target.checkValidity();
}


export {
  formattingInputValue,
  initializeInputValidity,
}

// dd      ccc  d d d             ddd     d