/****** IMPORTS *******/
import { 
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  focusOn,
  saveToStore,
  changeOn,
  deleteOn,
  sendListByEmail,

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

    // -> Ajouter les écouteurs d'évènement au <li>
      // -> Focus sur p.nom
    const EL_P_NOM = EL_LI.querySelector('.nom');
    focusOn(EL_P_NOM, arrayOfUserItems, store, KEY_STORE);
    
      // -> Focus sur p.quantite
    const EL_P_QUANTITY = EL_LI.querySelector('.quantite');
    focusOn(EL_P_QUANTITY, arrayOfUserItems, store, KEY_STORE);

      // -> Change sur le select
    const EL_SELECT = EL_LI.querySelector('.unite');
    changeOn(EL_SELECT, arrayOfUserItems, store, KEY_STORE);

      // -> Click sur le btn pour la suppression de l'item
    const EL_DELETE_BTN = EL_LI.querySelector('.supprimer');
    deleteOn(EL_DELETE_BTN, arrayOfUserItems, store, KEY_STORE);

      // -> Drag du <li>
    const EL_HANDLE = EL_LI.querySelector('.poignee');
    EL_HANDLE.addEventListener('mousedown', (e) => {
      // console.log(e);
      EL_LI.setAttribute('draggable', 'true');
    });

    EL_HANDLE.addEventListener('mouseup', (e) => {
      // console.log(e);
      // EL_LI.removeAttribute('draggable');
      // console.log(EL_INDICATOR)
      EL_INDICATOR.remove();

    });

    EL_LI.addEventListener('dragstart', (e) => {
      // console.log('dragstart');
      EL_LI.classList.add('drag-start');
    })
    

    EL_LI.addEventListener('dragend', (e) => {
      // console.log('dragend');
      EL_LI.removeAttribute('draggable');
      EL_LI.classList.remove('drag-start')
      // console.log(EL_INDICATOR)
      EL_INDICATOR.remove();
    });




    EL_LI.addEventListener('dragover', (e) => {
      const isDragLi = EL_LI.classList.contains('drag-start');
      if(!isDragLi) {
        const locationOfDrag = e.offsetY; 
        const middleHeightOfLi = EL_LI.clientHeight / 2;
        // console.log('middleHeightOfLi : ', middleHeightOfLi);
        // console.log('locationOfDrag : ', locationOfDrag);
  
        // -> Si le drag est au dessous de la moitié de l'élément dragover
        if(locationOfDrag > middleHeightOfLi) {
          // -> Y a-t-il un <li> après l'élément dragover ? Si oui, s'agit-il de l'indicateur
          const isIndicatorPresent = EL_LI.nextElementSibling ? EL_LI.nextElementSibling.classList.contains('indicateur') : false;

          if(!isIndicatorPresent) {
            EL_LI.insertAdjacentElement('afterend', EL_INDICATOR);
          }
          // -> Si le drag est au dessus de la moitié de l'élément dragover
        } else {
          // -> Y a-t-il un <li> avant l'élément dragover ? Si oui, s'agit-il de l'indicateur
          const isIndicatorPresent = EL_LI.previousElementSibling ?  EL_LI.previousElementSibling.classList.contains('indicateur') : false;

          if(!isIndicatorPresent) {
            EL_LI.insertAdjacentElement('beforebegin', EL_INDICATOR);
          }
        }
      }

     

    })

    
    
    
    
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

    //-> Ajouter les écouteurs d'évènement au <li>
      //-> Pour p.nom
    const EL_P_NOM = newLiElement.querySelector('.nom');
    focusOn(EL_P_NOM, arrayOfUserItems, store, KEY_STORE);

      //-> Pour p.quantite
    const EL_P_QUANTITY = newLiElement.querySelector('.quantite');
    focusOn(EL_P_QUANTITY, arrayOfUserItems, store, KEY_STORE);

    // -> Pour le select
    const EL_SELECT = newLiElement.querySelector('.unite');
    changeOn(EL_SELECT, arrayOfUserItems, store, KEY_STORE);

    // -> Pour la suppression de l'item
    const EL_DELETE_BTN = document.querySelector('.supprimer');
    deleteOn(EL_DELETE_BTN, arrayOfUserItems, store, KEY_STORE);

  
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