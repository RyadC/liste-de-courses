/****** IMPORTS *******/
/** Function **/
import { 
  capitalizeFirstLetter,
  extractData,
  createItemElement,
  saveToStore,
  sendListByEmail,
  eventsHandler,
  
} from './utils.js';


/** DOM Elements **/
import {
  formElement,
  addItemElement,
  templateElement,
  listElement,
  indicatorElement,
} from './dom-elements.js'

/**********************/

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  // -> Initialiser le localStorage
  const store = window.localStorage;
  const KEY_STORE = 'list';

  // -> Array pour récupérer les items du store (permettra de traiter les items pour l'affichage sur la page)
  let items = [];

  // -> Array pour injecter les items <li> dans le DOM
  let reverseItems = [];
  
  // -> Récupérer les items du localStorage s'il contient des items
  if(store.length) {
    items = JSON.parse(store.list);

    // -> Copier le tableau et le mettre à l'enver pour que les items <li> injectés dans le DOM soit dans le même ordre qu'initialement
    Object.assign(reverseItems, items);
    reverseItems.reverse();
  }

  // * Afficher les items récupérés du localStorage sur la page
  for(const item of reverseItems) {
    // -> Créer un élément <li> avec les données utilisateur
    const itemElement = createItemElement(templateElement.content, item);

    // -> Ajouter le <li> en début de liste
    listElement.insertAdjacentElement("afterbegin",itemElement);
 
    // -> Ajouter les écouteurs d'évènement au <li> et ses éléments enfants
    eventsHandler(itemElement, indicatorElement, items, store, KEY_STORE);
    
    listElement.addEventListener('dragover', (e) => {
      e.dataTransfer.dropEffect = 'move';
    });
  };


  


  // * A la validation de l'input via le bouton "Ajouter"
  formElement.addEventListener('submit', (e) => {
    //-> Désactiver le comportement par défaut du formulaire
    e.preventDefault();

    //-> Récupérer le contenu de l'input
    const inputValue = addItemElement.value;

    // -> Extraire les données de l'utilisateur de manière exploitable
    const product = extractData(inputValue, templateElement.content);

    //-> Mettre la 1ère lettre en majuscule
    product.name = capitalizeFirstLetter(product.name);

    // -> Stocker les données sous la forme d'un tableau d'objets. Chaque objet représentera un item.
    items.unshift(product);


    // -> Injecter le produit dans le store (avant de manipuler le DOM)
    saveToStore(store, KEY_STORE, items);

    // -> Créer un élément <li> avec les données utilisateur
    const itemElement = createItemElement(templateElement.content, product);

    //-> Ajouter le <li> en début de liste
    listElement.insertAdjacentElement("afterbegin",itemElement);

    // -> Ajouter les écouteurs d'évènement au <li> et ses éléments enfants
    const dependencies = {
      itemElement: itemElement,
      items: items,
      store,
      KEY_STORE,
    }
    eventsHandler(dependencies);

  
    //-> Effacer le champs de l'input après validation puis lui ajouter le focus 
    addItemElement.value = "";
    addItemElement.focus();
  });


  // * Empêcher l'affichage du message d'erreur (géré dans l'event 'invalid') si l'utilisateur tente de réécrire dans l'input
  addItemElement.addEventListener('input', (e) => {
    e.target.setCustomValidity('');
    e.target.checkValidity();
  });


  // * Si les données entrées dans l'input ne correspondent pas aux données attendues, on affiche un message d'erreur correspondant
  addItemElement.addEventListener('invalid', (e) => {
    const REGEX_SPECIAL_CHARACTER = /[^A-Za-z0-9 ()]{1,}/g;
    let inputValue = e.target.value;

    if(inputValue.length === 0) {
      addItemElement.setCustomValidity(`Vous devez indiquer les informations de l'item, exemple : 250 g chocolat`)

    } else if(REGEX_SPECIAL_CHARACTER.test(inputValue)) {
      addItemElement.setCustomValidity(`Les caractères spéciaux, les accents et autres lettres spécifiques ne sont pas autorisés`)
    
    } else {
      addItemElement.setCustomValidity(`Le nom de l'item doit faire 2 lettres minimum`)
    };
  });


  // * Exporter les données par email en cliquant sur le bouton "exporter"
  const exportBtnElement = document.querySelector('#exporter');
  exportBtnElement.addEventListener('click', (e) => {
    sendListByEmail('email@email.com', items);
  });
});


// 4 kg pommes rouges