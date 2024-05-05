/****** IMPORTS *******/
/** DOM Elements **/
import {
  formElement,
  addItemElement,
  templateElement,
  listElement,
  indicatorElement,
} from './dom-elements.js'

/**********************/


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

  // -> On l'item <li> de la liste 
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
    let formatedNameForURL = '';
    const brokendownName = itemName.split(' ');

    if(brokendownName.length > 1) {
      formatedNameForURL = brokendownName.join('%20');
    }

    body += `-%20${formatedNameForURL}%20(${item.quantity}%20${item.unity})%0D%0A`;
  });

  url = `mailto:${email}?subject=${SUBJECT}&body=${body}`;

  window.location = url;
}


/********************* EVENTS HANDLERS  ****************************/

function onItemNameOrQuantityFocus(HTMLElementToListen, itemsList, store, KEY_STORE) {
  HTMLElementToListen.addEventListener('focus', (e) => {
      const textValue = HTMLElementToListen.textContent;

      const inputElement =  document.createElement('input');

      let propertyToChange = '';

      if(HTMLElementToListen.classList.contains('nom')) {
        inputElement.type = 'text';
        propertyToChange = 'name';
      } else {
        inputElement.type = 'number';
        inputElement.min = '1';
        inputElement.max = '999';
        propertyToChange = 'quantity';
      }

      inputElement.className = HTMLElementToListen.className;
      inputElement.value = textValue;
      
      HTMLElementToListen.replaceWith(inputElement);
      
      inputElement.focus();

      inputElement.addEventListener('keypress', blurOnEnterPressHandler);

      inputElement.addEventListener('blur', (e) => {
        // -> On récupère la nouvelle valeur entrée par l'utilisateur
        const newInputValue = inputElement.value;

        // -> On place cette nouvelle valeur dans le textContent de l'élément <p> qui va remplacer le <input>
        HTMLElementToListen.textContent = newInputValue;

        // -> On remplace le <input> par l'élément HTML de base
        inputElement.replaceWith(HTMLElementToListen);

        // -> On met à jour le tableau d'items selon la nouvelle valeur entrée par l'utilisateur
        const updateDependencies = {
          item: HTMLElementToListen,
          itemsList,
          propertyToChange,
          newValue: newInputValue,
        };

        updatePropertyItemOfItemsArray(updateDependencies);
        
        // -> On sauvegarde dans le store
        saveToStore(store, KEY_STORE, itemsList);
      });
    });
}


function onSelectChange(HTMLElementToListen, itemsList, store, KEY_STORE) {
  HTMLElementToListen.addEventListener('change', (e) => {
    const propertyToChange = 'unity';
    const newSelectValue = e.srcElement.value;
  
    // -> On met à jour le tableau d'item selon la nouvelle valeur entrée par l'utilisateur
    const updateDependencies = {
      HTMLElementToListen,
      itemsList,
      propertyToChange,
      newValue: newSelectValue,
    };

    updatePropertyItemOfItemsArray(updateDependencies);
  
    // -> On sauvegarde dans le store
    saveToStore(store, KEY_STORE, itemsList);
  });
}


function onLiDelete(HTMLElementToListen, itemsList, store, KEY_STORE) {
  const EL_LI = HTMLElementToListen.closest('li');

  HTMLElementToListen.addEventListener('click', (e) => {
    // -> On supprime l'item <li> de la liste contenu dans le tableau
    deleteItemOfItemsArray(HTMLElementToListen, itemsList);

    // -> On sauvegarde dans le store
    saveToStore(store, KEY_STORE, itemsList);

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

// DONE : Refacto
function onItemDragStart(itemElement) {
  return itemElement.addEventListener('dragstart', (e) => {
    itemElement.classList.add('drag-start');

    // -> Pour ajouter les :: before sur les li afin d'afficher l'indicateur meme quand on passe entre deux <li> sans survoler les <li> (en passant sur le côté) car entre les deux se trouve un ::before
    listElement.classList.add('drag-en-cours');
  });
}


// DONE: Refacto variables
// TODO : Refacto scope
function onItemDragOver(itemElement, indicatorElement) {
  itemElement.addEventListener('dragover', (e) => {
    // -> Remettre la classe 'indicateur' supprimer dans l'event du dragend pour faire disparaitre l'indicateur et supprimer l'attribut style qui met le 'display' à 'none'
    indicatorElement.removeAttribute('style');
    indicatorElement.classList.add('indicateur');

    const itemIsDragging = itemElement.classList.contains('drag-start');
    if(!itemIsDragging) {
      const locationOfDrag = e.offsetY; 
      const middleHeightOfDragoverItem = itemElement.clientHeight / 2;

      // -> Si le drag est en dessous de la moitié de l'élément dragover
      if(locationOfDrag > middleHeightOfDragoverItem) {
        // -> Y a-t-il un <li> après l'élément dragover ? 
        const thereIsElementAfter = itemElement.nextElementSibling ;
        
        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresentAfter = thereIsElementAfter ? thereIsElementAfter.classList.contains('indicateur') : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const nextElementIsDraggingItem = thereIsElementAfter ? thereIsElementAfter.classList.contains('drag-start') : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if(!nextElementIsDraggingItem && !indicatorIsPresentAfter) {
          itemElement.insertAdjacentElement('afterend', indicatorElement);
        }

        // -> Si l'élément en dragover est suivi du <li> en drag alors je n'affiche pas l'indicateur
        if(nextElementIsDraggingItem) {
          indicatorElement.remove();
        }
      } 
      
      // -> Si le drag est au dessus de la moitié de l'élément dragover
      if(locationOfDrag < middleHeightOfDragoverItem) {
        // -> Y a-t-il un <li> avant l'élément dragover ? 
        const thereIsElementBefore = itemElement.previousElementSibling ;

        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresentBefore = thereIsElementBefore ?  thereIsElementBefore.classList.contains('indicateur') : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const previousElementIsDragLi = thereIsElementBefore ? thereIsElementBefore.classList.contains('drag-start') : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if(!previousElementIsDragLi && !indicatorIsPresentBefore) {
          itemElement.insertAdjacentElement('beforebegin', indicatorElement);
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
  });
}


function onItemDragEnd(itemElement, indicatorElement, store, KEY_STORE, itemsList, indexOfLi) {
  itemElement.addEventListener('dragend', (e) => {
    itemElement.removeAttribute('draggable');
    itemElement.classList.remove('drag-start');
    
    const EL_UL = itemElement.closest('ul');
    let listOfLi = Array.from(EL_UL.children);
    const moveLiOnGrasp = listOfLi.includes(indicatorElement); 
    indicatorElement.style.display = 'none';
    
    if(moveLiOnGrasp) {
      
      // -> EventListener pour effectuer le déplacement du <li> une fois seulement que le scale et le box-shadow soit terminé (mieux que de faire un seTimeout car le délais css n'est pas garantie et la maintenance et + importante car changement du délais manuellement) 
      function animationHandler(e) {
        // debugger;
        listOfLi = Array.from(EL_UL.children);
        const indicatorPosition = listOfLi.indexOf(indicatorElement);
        const liElementPosition = listOfLi.indexOf(itemElement);
        // -> Seulement si la transition concerne l'attribut 'transform'

        if(e.propertyName === 'transform') {
          
          
          switch (itemElement.dataset.phase) {
            case 'take-off':
              itemElement.dataset.phase = 'moving';

              const marginTopLiElement = Number.parseInt(window.getComputedStyle(itemElement).marginTop);
              const heightLiElement = itemElement.offsetHeight;
              const totalHeightLiElement = heightLiElement + marginTopLiElement;
              const movingDown = indicatorPosition > liElementPosition;
              let translateValue = 0;

              const itemsNumber = movingDown ? 
                                  indicatorPosition - liElementPosition - 1
                                  :
                                  indicatorPosition - liElementPosition + 1;
  
              translateValue = totalHeightLiElement * itemsNumber;

              itemElement.style.transform += ` translateY(${translateValue}px)`;
  
              if(movingDown) {
                for(let i = liElementPosition + 1; i < indicatorPosition; i++) {
                  listOfLi[i].style.transform = ` translateY(-${totalHeightLiElement}px)`;
                }
              } else {
                for(let i = liElementPosition - 1; i > indicatorPosition; i--) {
                  listOfLi[i].style.transform = ` translateY(${totalHeightLiElement}px)`;
                }
              }
              break;
              
            case 'moving':
              itemElement.dataset.phase = 'landing';

              const translateYProperties = itemElement.style.transform.split(' ').find(property => property.includes('translateY'));

              itemElement.style.boxShadow = '';
              itemElement.style.transform = `${translateYProperties}`;
            break;
                
            case 'landing':
              itemElement.removeAttribute('data-phase');
              itemElement.removeEventListener('transitionend' ,animationHandler);

              indicatorElement.replaceWith(itemElement);
              listOfLi.forEach(li => {
                  li.removeAttribute('class');
                  // li.removeAttribute('data-phase');
                  li.style.transition = 'none';
                  li.style.transform = '';

                  setTimeout(() => {
                    li.removeAttribute('style');
                  }, 0);
                });

                const EL_LIST_LI = Array.from(EL_UL.childNodes);
                const newListOfItems = [];

              EL_LIST_LI.forEach((li) => {
                const itemNameElement = li.querySelector('.nom');
                const itemQuantityElement = li.querySelector('.quantite');
                const itemSelectElement = li.querySelector('.unite');

                newListOfItems.push({
                  name: itemNameElement.textContent,
                  quantity: itemQuantityElement.textContent,
                  unity: itemSelectElement.value.toLowerCase(),
                });
              });
            
              saveToStore(store, KEY_STORE, newListOfItems);
            break;
          
            default:
            break;
          }
        }
      }

      itemElement.addEventListener('transitionend', animationHandler);

      // -> Attribut HTML ajouté pour gérer les différentes phases (décollage, déplacement, atterrissage)
      itemElement.dataset.phase = 'take-off';
      // -> CSS à ajouter pour la phase de décollage et de déplacement
      itemElement.style.transform = 'scale(1.05)';
      itemElement.style.boxShadow = '0 0 24px rgba(32, 32, 32, .8)';
      itemElement.style.transition = 'box-shadow transform';
      // -> CSS à ajouter pour corriger le problème d'affichage des unités
      itemElement.style.position = 'relative';
      itemElement.style.zIndex = '1';
    }

    // -> Retirer les ::before lorsque le drag est fini
    EL_UL.classList.remove('drag-en-cours');
  });



}


function onBtnGrap(HTMLElementToListen, indicatorElement) {
  const EL_LI = HTMLElementToListen.closest('li');

  HTMLElementToListen.addEventListener('mousedown', (e) => {
    EL_LI.setAttribute('draggable', 'true');
  });

  HTMLElementToListen.addEventListener('mouseup', (e) => {
    EL_LI.removeAttribute('draggable');
    indicatorElement.remove();

  });
}


// DONE: Refacto
function eventsHandler(dependencies) {
  const {
    itemElement,
    items,
    store,
    KEY_STORE,
   } = dependencies;

  // -> Ajouter les écouteurs d'évènement au <li>
    // -> Focus sur p.nom
  const itemNameElement = itemElement.querySelector('.nom');
  onItemNameOrQuantityFocus(itemNameElement, items, store, KEY_STORE);

    // -> Focus sur p.quantite
  const itemQuantityElement = itemElement.querySelector('.quantite');
  onItemNameOrQuantityFocus(itemQuantityElement, items, store, KEY_STORE);

    // -> Change sur le select
  const itemSelectElement = itemElement.querySelector('.unite');
  onSelectChange(itemSelectElement, items, store, KEY_STORE);

    // -> Click sur le btn pour la suppression de l'item
  const deleteBtnElement = itemElement.querySelector('.supprimer');
  onLiDelete(deleteBtnElement, items, store, KEY_STORE);

    // -> Grap du bouton du <li>
  const handleElement = itemElement.querySelector('.poignee');
  onBtnGrap(handleElement,indicatorElement);

    // -> Drag du <li>
  onItemDragStart(itemElement);

    // -> Dragover du <li>
  onItemDragOver(itemElement, indicatorElement);

    // -> Dragend du <li>
  onItemDragEnd(itemElement, indicatorElement, store, KEY_STORE, items);
}




export {
  capitalizeValue,
  extractData,
  createItemElement,
  saveToStore,
  sendListByEmail,
  eventsHandler,
};

// 5 kg pommes
