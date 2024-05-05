// DONE : Refacto
/**
 * Remove the spaces on beginning and ending the string
 * @param {string} value A string to remove spaces on beginning and ending
 * @returns {string} The formated value
 */
function removeUnnecessarySpaces(value) {
  // -> Enlever les espaces de début et de fin
  const trimedValue = value.trim();

  // -> Forme une string en remplacant les espaces multiples par un seul espace
  const valueWithoutMultipleSpaces = trimedValue.replaceAll(/( )+/g, ' ');

  return valueWithoutMultipleSpaces;
}


// DONE : Refacto
/**
 * Capitalize a string value
 * @param {string} value A string to capitalize
 * @returns {string} The value in capitalize format
 */
function capitalizeValue(value) {
    // -> Récupère la 1ère lettre pour la mettre en majuscule
    const firstLetterInCapital = value[0].toUpperCase();

    // -> Récupère le reste de la string
    const restOfWord = value.slice(1);
  
    // -> Concatène la string entière afin d'avoir une string commençant par une majuscule
    const inputValueCapitalize = firstLetterInCapital + restOfWord;

    return inputValueCapitalize;
}


// DONE : Refacto
/**
 * Extract the user data to create an object with them
 * @param {string} source The value from the input
 * @param {Document} HTMLDocument The HTML document to retrieve the default values ​​of HTML elements  
 * @returns {object} The product object { name, quantity, unity }
 */
function extractData(source, HTMLDocument) {
  // -> Mettre en minuscule la valeur de l'input
  const value = source.toLowerCase();

  // -> Déclarer les constantes par défaut
  const itemQuantityElement = HTMLDocument.querySelector('.quantite');
  const itemSelectElement = HTMLDocument.querySelector('.unite');

  const DEFAULT_QUANTITY = Number(itemQuantityElement.textContent); 
  const DEFAULT_UNITY = itemSelectElement.value; 

  //-> Retirer les espaces inutiles éventuels
  const valueWithoutSpaces = removeUnnecessarySpaces(value);

  //-> Récupérer la quantité, l'unité et le nom du produit selon les données fournies par l'utilisateur
  const data = valueWithoutSpaces.split(' ');

  const optionElements = itemSelectElement.children;
  
  // -> On ajoute dynamiquement la liste des unités selon les éléments HTML pour éviter l'ajout manuel en JS (réduction de maintenance = €€€)
  const LIST_OF_UNITIES = [];

  for(const option of optionElements) {
    LIST_OF_UNITIES.push(option.value.toLowerCase());
  };

  const product = {
    name: '',
    quantity: DEFAULT_QUANTITY,
    unity: DEFAULT_UNITY,
  };
  

  //-> La 1ère valeur est-elle un nombre ?
  if(Number(data[0])){
    //-> Si oui, Je récupère le nombre en tant que quantité
    product.quantity = Number(data[0]);
    
    // -> Puis deux choix possibles : le 2nd est soit le nom ou la quantité
      //-> On regarde s'il s'agit de la quantité
    if(LIST_OF_UNITIES.includes(data[1])) {
      //-> Si oui alors on récupère l'unité en 2ème position et le nom du produit en 3ème position
      product.unity = data[1];
      //-> On récupère le reste du tableau puis on concatène pour les produits avec des noms composés : fraises des bois
      product.name = data.slice(2).join(' ');
      
    } else {
      //-> Sinon, c'est qu'il n'y a pas d'unité de donnée 
      product.name = data.slice(1).join(' ');
    };

  } else {
    //-> Sinon, il s'agit du nom
    product.name = data.slice(0).join(' ');
  };

  return product;
}


// DONE : Refacto
/**
 * Create an <li> element configured with the user data
 * @param {Document} HTMLDocument The HTML document to retrieve the <li> element to copy
 * @param {object} product The product object from user data
 * @returns {object} An HTML `<li>` element
 */
function createItemElement(HTMLDocument, product) {
  //-> Cloner le template pour injecter un nouvel <li>
  const cloneItemElement = HTMLDocument.cloneNode(true).children[0];

  //-> Injecter les valeurs de l'input formaté
    //-> le nom du produit dans le <p.nom> enfant du <li>
  const itemNameElement = cloneItemElement.querySelector('.nom');
  itemNameElement.textContent = product.name;
  
    //-> la quantité dans le <p.quantite> enfant du <li>
  const itemQuantityElement = cloneItemElement.querySelector('.quantite');
  itemQuantityElement.textContent = product.quantity;
  
  //-> l'unité dans l'option du <select>
  const itemSelectElement = cloneItemElement.querySelector('.unite');
  for(const option of itemSelectElement) {
    if(option.value.toLowerCase() === product.unity) {
      option.selected = true;
    }
  }

  return cloneItemElement;
}


// DONE : Refacto
/**
 *  Triggers the 'blur' method on the HTML target element on 'Enter' or 'NumpadEnter' press 
 * @param {KeyboardEvent} e The KeyboardEvent 
 */
function blurOnEnterPressHandler(e) {
  e.code === 'Enter' || e.code === 'NumpadEnter' ? e.target.blur() : '';
}


// DONE : Refacto
/**
 * Updates item object property
 * @param {HTMLElement} item The HTML element whose 'name' or 'quantity' value is changed
 * @param {array} itemsList Array of each items object => {name, quantity, }
 * @param {string} propertyToChange The item object property whose value must be changed
 * @param {string} newValue The new value of the item objeect property
 */
function updatePropertyItemOfItemsArray(updateDependencies) {
  const {
    item,
    itemsList,
    propertyToChange,
    newValue,
  } = updateDependencies
  console.log(updateDependencies);

  // -> On récupère l'index de l'item <li> dans la liste des <li>
  const itemIndex = findIndexOfItem(item);

  // -> On change la valeur de l'item <li>, selon la modification de l'utilisateur, dans le tableau
  itemsList[itemIndex][propertyToChange] = newValue;
}


// DONE : Refacto
/**
 * Remove the item from the item objects array
 * @param {HTMLElement} item The item to remove 
 * @param {array} itemsList The list of item object 
 */
function deleteItemOfItemsArray(item, itemsList) {
  // -> On récupère l'index de l'item <li> dans la liste des items <li>
  const itemIndex = findIndexOfItem(item);

  // -> On supprime l'item <li> de la liste 
  itemsList.splice(itemIndex, 1);
}


// DONE : Refacto
/**
 * Find the index of the item in the HTML items list
 * @param {HTMLElement} item The item to find in the HTML list of items 
 * @returns {number} Index of the item
 */
function findIndexOfItem(item) {
  // -> On récupère l'élément <ul>
  const listElement = item.closest('#liste');

  // -> On récupère l'index de l'élément dans la liste des <li>
  const itemIndex = Array.from(listElement.children).indexOf(item.closest('li'));

  return itemIndex;
}


// DONE : Refacto
/**
 * Save the item objects in the store 
 * @param {Storage} store Instance of Storage from localStorage
 * @param {string} KEY_STORE The key to access on values in the store
 * @param {array} itemsList Array of item objects to store
 */
function saveToStore(store, KEY_STORE, itemsList) {
  const itemsListJSON = JSON.stringify(itemsList);
  store.setItem(KEY_STORE, itemsListJSON);
}


// DONE : Refacto
/**
 * Opens the email manager with the list of items in the body of the email to the desired recipient
 * @param {string} email The recipient who should receive the email. An email address is expected
 * @param {array} itemsList An array that contains the list of item objects 
 */
function sendListByEmail(email, itemsList ) {
  let url = '';
  const SUBJECT = 'Liste%20de%20courses';
  let body = 'Voici%20la%20liste%20de%20course%20,%20n%27oublie%20rien%20stp%20%3A%0A%0A';

  itemsList.forEach((item) => {
    const itemName = item.name;
    let formatedNameForURL = itemName;
    const brokendownName = itemName.split(' ');

    if(brokendownName.length > 1) {
      formatedNameForURL = brokendownName.join('%20');
    }

    body += `-%20${formatedNameForURL}%20(${item.quantity}%20${item.unity})%0D%0A`;
  });

  url = `mailto:${email}?subject=${SUBJECT}&body=${body}`;

  window.location = url;
}

export {
  capitalizeValue,
  extractData,
  createItemElement,
  saveToStore,
  sendListByEmail,
  deleteItemOfItemsArray,
  updatePropertyItemOfItemsArray,
  blurOnEnterPressHandler,
};