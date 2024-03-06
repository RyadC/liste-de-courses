/****** IMPORTS *******/
import { 
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  saveToStore,
  sendListByEmail,
  eventsHandler,

} from './utils.js';

/**********************/

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  // * Initialiser le localStorage
  const store = window.localStorage;
  const KEY_STORE = 'list';

  console.log(store)
  
  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');

  // ! L'élément doit être crée à l'extérieur de la création du <li> car sinon autant d'indicateurs sont crées alors que nous voulons un unique indicateur pour l'ensemble
  const EL_INDICATOR = document.createElement('li');
  EL_INDICATOR.classList.add('indicateur');

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
    const EL_LI = createLiHtmlItem(EL_TEMPLATE.content, item);

    // -> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",EL_LI);

 
    // -> Ajouter les écouteurs d'évènement au <li> et ses éléments enfants
    eventsHandler(EL_LI, EL_INDICATOR, arrayOfUserItems, store, KEY_STORE);
    
    
    
    EL_UL.addEventListener('dragover', (e) => {
      e.dataTransfer.dropEffect = 'move';
      
    })


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
    saveToStore(store, KEY_STORE, arrayOfUserItems);

    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, product);

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

    // -> Ajouter les écouteurs d'évènement au <li> et ses éléments enfants
    eventsHandler(newLiElement, EL_INDICATOR, arrayOfUserItems, store, KEY_STORE);

  
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


  // * Exporter les données par email en cliquant sur le bouton "exporter"
  const EL_EXPORT_BTN = document.querySelector('#exporter');
  EL_EXPORT_BTN.addEventListener('click', (e) => {
    sendListByEmail('ktourtay@gmail.com', arrayOfUserItems);
  })


});


// 4 kg pommes rouges