function removeUnnecessarySpaces(inputValue) {
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

  return inputValueWithoutMultipleSpaces;
}

function capitalizeFirstLetter(value) {
    // Récupère la 1ère lettre pour la mettre en majuscule
    let firstLetterInCapital = value[0].toUpperCase();

    // Récupère le reste de la string
    let restOfWord = value.slice(1)
  
    // Concatène la string entière afin d'avoir une string commençant par une majuscule
    let inputValueCapitalize = firstLetterInCapital + restOfWord

    return inputValueCapitalize;
}


// function formateValue(value) {
//   const arrayValueSplit = value.split(' ');

//   console.log(arrayValueSplit)

// }
// formateValue('23 gr pommes')


export {
  removeUnnecessarySpaces,
  capitalizeFirstLetter,
}

