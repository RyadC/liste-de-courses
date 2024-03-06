
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
  // -> Mettre en minuscule la valeur de l'input
  const value = source.toLowerCase();

  // -> Déclarer les constantes par défaut
  const DEFAULT_QUANTITY = Number(htmlDocument.querySelector('.quantite').textContent); 
  const DEFAULT_UNITY = htmlDocument.querySelector('.unite').value; 

  //-> Retirer les espaces inutiles éventuels
  const inputValueWithoutSpaces = removeUnnecessarySpaces(value);

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
function transformPElementtoInput(PElement, inputType) {
  const valuePElement = PElement.textContent;

  const EL_NEW_INPUT =  document.createElement('input');
  EL_NEW_INPUT.type = inputType;
  
  if(inputType === 'number') {
    EL_NEW_INPUT.min = "1";
    EL_NEW_INPUT.max = "999";
  };

  EL_NEW_INPUT.className = PElement.className;
  EL_NEW_INPUT.value = valuePElement;
  
  PElement.replaceWith(EL_NEW_INPUT);

  return EL_NEW_INPUT;
}

/**
 * Switch between two element in the DOM and retrieve their text value
 * @param {HTMLElement} elementToReplace 
 * @param {HTMLElement} substituteElement 
 */
function switchBetweenPandInputInDOM(newElement, oldElement) {
  
  newElement.textContent = oldElement.value;
  oldElement.replaceWith(newElement);
  // console.log(elementToReplace);
}

/**
 * 
 * @param {*} e 
 */
function blurOnEnterPressHandler(e) {
  e.code === 'Enter' ? e.target.blur() : '';
}

/**
 * 
 * @param {*} e 
 * @param {*} inputType 
 */
function transformParagraphToInputHandler(pElement, inputType) {
  // console.log('dans le focus')
  const EL_P = pElement;
  const EL_NEW_INPUT = transformPElementtoInput(EL_P, inputType);
  EL_NEW_INPUT.focus();

  return {
    EL_NEW_INPUT,
    EL_P
  };
  
  // EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);


  // // EL_NEW_INPUT.addEventListener('blur', () => {
  // //   switchBetweenPandInputInDOM(EL_P, EL_NEW_INPUT);
  // // });
  // EL_NEW_INPUT.addEventListener('blur', (e) => blurHandler(e, EL_P, EL_NEW_INPUT));
}


function changeValueItemInArrayOfItems(item, listOfItems, propertyToChange, newValue) {
  // -> On récupère l'index de l'élément <li> dans la liste des <li>
  const itemIndexInUlElement = findIndexOfItem(item);

  // -> On change la valeur de l'item <li>, selon la modification de l'utilisateur, dans le tableau
  listOfItems[itemIndexInUlElement][propertyToChange] = newValue;
}

function deleteItemInArrayOfItems(item, listOfItems) {
  // -> On récupère l'index de l'élément <li> dans la liste des <li>
  const itemIndexInUlElement = findIndexOfItem(item);

  // -> On change la valeur de l'item <li>, selon la modification de l'utilisateur, dans le tableau
  listOfItems.splice(itemIndexInUlElement, 1);
}


function findIndexOfItem(HTMLElementToListen) {
  // -> On récupère l'élément <ul>
  const EL_UL = HTMLElementToListen.closest('ul');

  // -> On récupère l'index de l'élément dans la liste des <li>
  const itemIndexInUlElement = Array.from(EL_UL.children).indexOf(HTMLElementToListen.closest('li'));

  return itemIndexInUlElement;
}


function saveToStore(store, keyStore, listeOfUserItems) {
  let stringListOfUserItems = JSON.stringify(listeOfUserItems);
  store.setItem(keyStore, stringListOfUserItems);
}


/**
 * Opens the email manager with the list of products in the body of the email to the desired recipient
 * @param {string} email The recipient who should receive the email. An email address is expected
 * @param {array} listOfItems An array that contains the list of items object 
 */
function sendListByEmail(email, listOfItems ) {
  let url = '';
  let subject = 'Liste%20de%20courses';
  let body = 'Voici%20la%20liste%20de%20course%20,%20n%27oublie%20rien%20stp%20%3A%0A%0A';

  listOfItems.forEach((item) => {
    let formatedNameForURL = item.name;
    let brokendownName = item.name.split(' ');

    if(brokendownName.length > 1) {
      formatedNameForURL = brokendownName.join('%20');
    }

    body += `-%20${formatedNameForURL}%20(${item.quantity}%20${item.unity})%0D%0A`;
  })

  url = `mailto:${email}?subject=${subject}&body=${body}`;

  window.location = url;
}


/********************* EVENTS HANDLERS  ****************************/

/**
 * 
 */
function blurHandler(e, elementToReplace, substituteElement) {
  // console.dir(Array.from(elementToReplace.parentElement.parentElement.children).indexOf(elementToReplace.parentElement))
  // console.log(sub.parentElement)
  switchBetweenPandInputInDOM(elementToReplace, substituteElement);
  
  return elementToReplace;
}


function onParagFocus(HTMLElementToListen, listOfItems, store, keyStore) {
  HTMLElementToListen.addEventListener('focus', (e) => {
      const valuePElement = HTMLElementToListen.textContent;

      const EL_NEW_INPUT =  document.createElement('input');

      let propertyToChange = '';

      if(e.target.classList.contains('nom')) {
        EL_NEW_INPUT.type = 'text';
        propertyToChange = 'name';
      } else {
        EL_NEW_INPUT.type = 'number';
        EL_NEW_INPUT.min = '1';
        EL_NEW_INPUT.max = '999';
        propertyToChange = 'quantity';
      }

      EL_NEW_INPUT.className = HTMLElementToListen.className;
      EL_NEW_INPUT.value = valuePElement;
      
      HTMLElementToListen.replaceWith(EL_NEW_INPUT);
      
      EL_NEW_INPUT.focus();

      EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);

      EL_NEW_INPUT.addEventListener('blur', (e) => {
        // -> On récupère la nouvelle valeur entrée par l'utilisateur
        const newInputValue = EL_NEW_INPUT.value;

        // -> On place cette nouvelle valeur dans le textContent de l'élément <p> qui va remplacer le <input>
        HTMLElementToListen.textContent = newInputValue;

        // -> On remplace le <input> par le <p>
        EL_NEW_INPUT.replaceWith(HTMLElementToListen);

        // -> On met à jour le tableau d'item selon la nouvelle valeur entrée par l'utilisateur
        changeValueItemInArrayOfItems(HTMLElementToListen, listOfItems, propertyToChange, newInputValue);
        
        // -> On sauvegarde dans le store
        saveToStore(store, keyStore, listOfItems);
      });
    });
}


function onSelectChange(HTMLElementToListen, listOfItems, store, keyStore) {
  HTMLElementToListen.addEventListener('change', (e) => {
    const propertyToChange = 'unity';
    const newSelectValue = e.srcElement.value;
  
    // -> On met à jour le tableau d'item selon la nouvelle valeur entrée par l'utilisateur
    changeValueItemInArrayOfItems(HTMLElementToListen, listOfItems, propertyToChange, newSelectValue);
  
    // -> On sauvegarde dans le store
    saveToStore(store, keyStore, listOfItems);
  });
}


function onLiDelete(HTMLElementToListen, listOfItems, store, keyStore) {
  const EL_LI = HTMLElementToListen.closest('li');

  HTMLElementToListen.addEventListener('click', (e) => {
    // -> On supprime l'item <li> de la liste contenu dans le tableau
    deleteItemInArrayOfItems(HTMLElementToListen, listOfItems);

    // -> On sauvegarde dans le store
    saveToStore(store, keyStore, listOfItems);

    // -> On ajoute la classe .suppression pour améliorer l'UX
    EL_LI.classList.add('suppression');
    
    EL_LI.addEventListener('transitionend', (e) => {
      // -> On supprime l'item <li> du DOM mais on choisi la propriété 'height' car sinon il va chiosir la 1ère qui se termine qui est box-shadow et va supprimer l'élément avant même que les autres transitions se terminent
      if(e.propertyName === 'height') {
        EL_LI.remove();
      }
    });
  });
}

function onLiDragStart(liElement) {
  liElement.addEventListener('dragstart', (e) => {
    liElement.classList.add('drag-start');
  })
}



function onLiDragOver(liElement, indicatorElement) {
  liElement.addEventListener('dragover', (e) => {
    const isDragLi = liElement.classList.contains('drag-start');
    if(!isDragLi) {
      const locationOfDrag = e.offsetY; 
      const middleHeightOfLi = liElement.clientHeight / 2;
      // console.log('middleHeightOfLi : ', middleHeightOfLi);
      // console.log('locationOfDrag : ', locationOfDrag);

      // -> Si le drag est en dessous de la moitié de l'élément dragover
      if(locationOfDrag > middleHeightOfLi) {
        // -> Y a-t-il un <li> après l'élément dragover ? 
        const thereIsElementAfter = liElement.nextElementSibling ;
        
        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresent = thereIsElementAfter ? thereIsElementAfter.classList.contains('indicateur') : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const nextElementIsDragLi = thereIsElementAfter ? thereIsElementAfter.classList.contains('drag-start') : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if(!nextElementIsDragLi && !indicatorIsPresent) {
          liElement.insertAdjacentElement('afterend', indicatorElement);
        }

        // -> Si l'élément en dragover est suivi du <li> en drag alors je n'affiche pas l'indicateur
        if(nextElementIsDragLi) {
          indicatorElement.remove();
        }
      } 
      
      // -> Si le drag est au dessus de la moitié de l'élément dragover
      if(locationOfDrag < middleHeightOfLi) {
        // -> Y a-t-il un <li> avant l'élément dragover ? 
        const thereIsElementBefore = liElement.previousElementSibling ;

        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresentBefore = thereIsElementBefore ?  thereIsElementBefore.classList.contains('indicateur') : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const previousElementIsDragLi = thereIsElementBefore ? thereIsElementBefore.classList.contains('drag-start') : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if(!previousElementIsDragLi && !indicatorIsPresentBefore) {
          liElement.insertAdjacentElement('beforebegin', indicatorElement);
        }

        // -> Si l'élément en dragover est précédé du <li> en drag alors je n'affiche pas l'indicateur
        if(previousElementIsDragLi) {
          indicatorElement.remove();
        }
      }

      // -> Si l'élément en dragover et mon <li> en drag alors je n'affiche pas l'indicateur
    } else {
      indicatorElement.remove();
    }
  })
}


function onLiDragEnd(liElement, indicatorElement) {
  liElement.addEventListener('dragend', (e) => {

    liElement.removeAttribute('draggable');

    liElement.classList.remove('drag-start');

    indicatorElement.replaceWith(liElement);
    
  });
}


function onBtnGrap(HTMLElementToListen, indicatorElement) {
  const EL_LI = HTMLElementToListen.closest('li');

  HTMLElementToListen.addEventListener('mousedown', (e) => {

    // console.log(e);
    EL_LI.setAttribute('draggable', 'true');
  });

  HTMLElementToListen.addEventListener('mouseup', (e) => {
    // console.log(e);
    // liElement.removeAttribute('draggable');
    // console.log(EL_INDICATOR)
    indicatorElement.remove();

  });
}


function eventsHandler(liElement, indicatorElement, listOfItems, store, keyStore) {
  // -> Ajouter les écouteurs d'évènement au <li>
    // -> Focus sur p.nom
  const EL_P_NOM = liElement.querySelector('.nom');
  onParagFocus(EL_P_NOM, listOfItems, store, keyStore);

    // -> Focus sur p.quantite
  const EL_P_QUANTITY = liElement.querySelector('.quantite');
  onParagFocus(EL_P_QUANTITY, listOfItems, store, keyStore);

    // -> Change sur le select
  const EL_SELECT = liElement.querySelector('.unite');
  onSelectChange(EL_SELECT, listOfItems, store, keyStore);

    // -> Click sur le btn pour la suppression de l'item
  const EL_DELETE_BTN = liElement.querySelector('.supprimer');
  onLiDelete(EL_DELETE_BTN, listOfItems, store, keyStore);

    // -> Grap du bouton du <li>
  const EL_HANDLE = liElement.querySelector('.poignee');
  onBtnGrap(EL_HANDLE,indicatorElement);

    // -> Drag du <li>
  onLiDragStart(liElement);

    // -> Dragover du <li>
  onLiDragOver(liElement, indicatorElement);

    // -> Dragend du <li>
    onLiDragEnd(liElement, indicatorElement);

}




export {
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  saveToStore,
  sendListByEmail,
  eventsHandler,
}

// 5 kg pommes
