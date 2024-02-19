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

/**
 * Extract the data to create an object with them
 * @param {string} source is the value from the input
 * @param {Document} htmlDocument is an HTML document to retrieve the default values ​​of HTML elements  
 * @returns {object} product with params : name, quantity, unity
 */
function extractData(source, htmlDocument) {
   // -> Déclarer les constantes par défaut
   const DEFAULT_QUANTITY = Number(htmlDocument.querySelector('.quantite').textContent); 
   const DEFAULT_UNITY = htmlDocument.querySelector('.unite').value; 

  //-> Retirer les espaces inutiles éventuels
  const inputValueWithoutSpaces = removeUnnecessarySpaces(source);

  //-> Récupérer la quantité, l'unité et le nom du produit selon les données fournies par l'utilisateur
  const arrayValueSplit = inputValueWithoutSpaces.split(' ');

  const EL_SELECT = htmlDocument.querySelector('.unite');
  const EL_OPTIONS = EL_SELECT.children;
  
  // -> On ajoute dynamiquement la liste des unités selon les éléments HTML pour éviter l'ajout manuel en JS (réduction de maintenance = €€€)
  // // const LIST_OF_UNITIES = ['u', 'g', 'kg', 'l'];
  const LIST_OF_UNITIES = [];

  for(const option of EL_OPTIONS) {
    LIST_OF_UNITIES.push(option.value.toLowerCase());
  };

  const product = {
    name: '',
    quantity: DEFAULT_QUANTITY,
    unity: DEFAULT_UNITY,
  };

  //-> La 1ère valeur est-elle un nombre ?
  if(Number(arrayValueSplit[0])){
    //-> Si oui, Je récupère le nombre en tant que quantité
    product.quantity = Number(arrayValueSplit[0]);
    
    // -> Puis deux choix possibles : le 2nd est soit le nom ou la quantité
      //-> On regarde s'il s'agit de la quantité
    if(LIST_OF_UNITIES.includes(arrayValueSplit[1])) {
      //-> Si oui alors on récupère l'unité en 2ème position et le nom du produit en 3ème position
      product.unity = arrayValueSplit[1];
      //-> On récupère le reste du tableau puis on concatène pour les produits avec des noms composés : fraises des bois
      product.name = arrayValueSplit.slice(2).join(' ');
      
    } else {
      //-> Sinon, c'est qu'il n'y a pas d'unité de donnée 
      product.name = arrayValueSplit.slice(1).join(' ');
    };

  } else {
    //-> Sinon, il s'agit du nom
    product.name = arrayValueSplit.slice(0).join(' ');
  };

  // //console.log(arrayValueSplit)
  // //console.log(unityOfProduct);
  // //console.log(quantityOfProduct);
  // //console.log(nameOfProduct);

  return product;
}

/**
 * Create a <li> element configured with user data
 * @param {Document} htmlDocument is an HTML document to retrieve the <li> element to copy
 * @param {object} product is the object product from user data
 * @returns {object} <li> html element
 */
function createLiHtmlItem(htmlDocument, product) {
  //-> Cloner le template pour injecter un nouvel <li>
  const EL_CLONE_LI = htmlDocument.cloneNode(true).children[0];

  //-> Injecter les valeurs de l'input formaté
    //-> le nom du produit dans le <p.nom> enfant du <li>
  const EL_NAME_LI = EL_CLONE_LI.querySelector('.nom');
  EL_NAME_LI.textContent = product.name;
  
    //-> la quantité dans le <p.quantite> enfant du <li>
  const EL_QUANTITY_LI = EL_CLONE_LI.querySelector('.quantite');
  EL_QUANTITY_LI.textContent = product.quantity;
  
  //-> l'unité dans l'option du <select>
  const EL_SELECT_LI = EL_CLONE_LI.querySelector('.unite');
  for(const option of EL_SELECT_LI) {
    if(option.value.toLowerCase() === product.unity) {
      option.selected = true;
    };
  };

  return EL_CLONE_LI;
}

/**
 * Transform an HTML element to an input in the DOM
 * @param {HTMLElement} HTMLElement 
 * @param {string} inputType The type attribut of the input
 * @returns {HTMLElement} The input was created
 */
function transformHTMLElementtoInput(HTMLElement, inputType) {
  const valuePElement = HTMLElement.textContent;

  const EL_NEW_INPUT =  document.createElement('input');
  EL_NEW_INPUT.type = inputType;
  
  if(inputType === 'number') {
    EL_NEW_INPUT.min = "1";
    EL_NEW_INPUT.max = "999";
  };

  EL_NEW_INPUT.className = HTMLElement.className;
  EL_NEW_INPUT.value = valuePElement;
  
  HTMLElement.replaceWith(EL_NEW_INPUT);

  return EL_NEW_INPUT;
}

/**
 * Switch between two element in the DOM and retrieve their text value
 * @param {HTMLElement} elementToReplace 
 * @param {HTMLElement} substituteElement 
 */
function switchElement(elementToReplace, substituteElement) {
  elementToReplace.textContent = substituteElement.value;
  substituteElement.replaceWith(elementToReplace);
  console.log(elementToReplace);
}

/**
 * 
 * @param {*} e 
 */
function blurOnEnterPress(e) {
  e.code === 'Enter' ? e.target.blur() : '';
}

/**
 * 
 * @param {*} e 
 * @param {*} inputType 
 */
function transformParagraphToInputHandler(e, inputType) {
  const EL_P = e.target;
  const EL_NEW_INPUT = transformHTMLElementtoInput(EL_P, inputType);
  EL_NEW_INPUT.focus();
  
  EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPress);

  EL_NEW_INPUT.addEventListener('blur', () => {
    switchElement(EL_P, EL_NEW_INPUT);
  });
}




export {
  // removeUnnecessarySpaces,
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  transformHTMLElementtoInput,
  switchElement,
  blurOnEnterPress,
  transformParagraphToInputHandler,
}

// 5 kg pommes