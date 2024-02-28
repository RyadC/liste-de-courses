/****** IMPORTS *******/
import { 
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  focusOn,
  saveToStore,
} from './utils.js';

/**********************/

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  // * Initialiser le localStorage
  const store = window.localStorage;
  const KEY_STORE = 'list';
  
  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');

  /***************************/
  
  // -> Array pour récupérer les items du store (permettra de traiter les items pour l'affichage sur la page)
  let arrayOfUserItems = [];

  // -> Array pour injecter les éléments <li> dans le DOM
  let reverseArrayOfUserItems = [];
  
  // -> Récupérer les items du localStorage s'il contient des items
  if(store.length) {
    arrayOfUserItems = JSON.parse(store.list);

    // -> Copier le tableau et le mettre à l'enver pour que les <li> injectés dans le DOM soit dans le même ordre qu'initialement
    Object.assign(reverseArrayOfUserItems, arrayOfUserItems);
    reverseArrayOfUserItems.reverse();
  }

  // * Afficher les items récupérés du localStorage sur la page
  for(const item of reverseArrayOfUserItems) {
    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, item);

    // -> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

    // -> Ajouter les écouteurs d'évènement au <li>
      // -> Pour p.nom
    const EL_P_NOM = newLiElement.querySelector('.nom');
    focusOn(EL_P_NOM, arrayOfUserItems, store, KEY_STORE);
    
      // -> Pour p.quantite
    const EL_P_QUANTITY = newLiElement.querySelector('.quantite');
    focusOn(EL_P_QUANTITY, arrayOfUserItems, store, KEY_STORE);
  }



  // * A la validation de l'input via le bouton "Ajouter"
  EL_FORM.addEventListener('submit', (e) => {
    //-> Désactiver le comportement par défaut du formulaire
    e.preventDefault();

    //-> Récupérer le contenu de l'input
    const inputValue = EL_INPUT_ADD_ITEM.value;

    // -> Extraire les données de l'utilisateur de manière exploitable
    const product = extractData(inputValue, EL_TEMPLATE.content);

    //-> Mettre la 1ère lettre en majuscule
    product.name = capitalizeFirstLetter(product.name);

    // -> Stocker les données sous la forme d'un tableau d'objets. Chaque objet représentera un item.
    arrayOfUserItems.unshift(product);


    // -> Injecter le produit dans le store (avant de manipuler le DOM)
    // store.setItem('list', stringListOfUserItems);
    saveToStore(store, KEY_STORE, arrayOfUserItems);

    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, product);

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

    //-> Ajouter les écouteurs d'évènement au <li>
      //-> Pour p.nom
    const EL_P_NOM = newLiElement.querySelector('.nom');
    focusOn(EL_P_NOM, arrayOfUserItems, store, KEY_STORE);

      //-> Pour p.quantite
    const EL_P_QUANTITY = newLiElement.querySelector('.quantite');
    focusOn(EL_P_QUANTITY, arrayOfUserItems, store, KEY_STORE);
  
    //-> Effacer le champs de l'input après validation puis lui ajouter le focus 
    EL_INPUT_ADD_ITEM.value = "";
    EL_INPUT_ADD_ITEM.focus();
  });


  // * Empêcher l'affichage du message d'erreur (géré dans l'event 'invalid') si l'utilisateur tente de réécrire dans l'input
  EL_INPUT_ADD_ITEM.addEventListener('input', (e) => {
    e.target.setCustomValidity('');
    e.target.checkValidity();
  });


  // * Si les données entrées dans l'input ne correspondent pas aux données attendues, on affiche un message d'erreur correspondant
  EL_INPUT_ADD_ITEM.addEventListener('invalid', (e) => {
    let regexSpecialCarac = /[^A-Za-z0-9 ()]{1,}/g;
    let inputValue = e.target.value;

    if(inputValue.length === 0) {
      EL_INPUT_ADD_ITEM.setCustomValidity(`Vous devez indiquer les informations de l'item, exemple : 250 g chocolat`)

    } else if(regexSpecialCarac.test(inputValue)) {
      EL_INPUT_ADD_ITEM.setCustomValidity(`Les caractères spéciaux, les accents et autres lettres spécifiques ne sont pas autorisés`)
    
    } else {
      EL_INPUT_ADD_ITEM.setCustomValidity(`Le nom de l'item doit faire 2 lettres minimum`)
    };
  });

});

// 4 kg pommes rouges