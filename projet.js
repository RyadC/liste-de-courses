/****** IMPORTS *******/
import { 
  // removeUnnecessarySpaces,
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
} from './utils.js';
/**********************/

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  // -> Initialiser le localStorage : 1ère chose à faire: Récupérer les données utilisateurs en cas de panne
  const store = window.localStorage;
  console.log(store);

  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');
  /***************************/

  // -> Array pour récupérer les items du store (permettra de traiter les items pour l'affichage sur la page)
  const listOfUserItems = [];

  // -> Récupérer les items du localStorage 
  if(store.length > 0) {
    for(let i = 0; i < store.length; i++) {
      listOfUserItems.push(JSON.parse(store[i]));
    };
  } else {
    console.log('le store est vide')
  };

  // -> Afficher les items récupérés du localStorage sur la page
  for(const item of listOfUserItems) {
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, item)
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);
  };

  // * A la validation de l'input via le bouton "Ajouter"
  EL_FORM.addEventListener('submit', (e) => {
    //-> Désactiver le comportement par défaut du formulaire
    e.preventDefault();

    //-> Récupérer le contenu de l'input en format lowercase
    const inputValue = EL_INPUT_ADD_ITEM.value.toLowerCase();

    // -> Extraire les données de l'utilisateur de manière exploitable
    const product = extractData(inputValue, EL_TEMPLATE.content);

    //-> Mettre la 1ère lettre en majuscule
    product.name = capitalizeFirstLetter(product.name);

    // -> Stocker les données sous la forme d'un tableau d'objets. Chaque objet représentera un item.
    listOfUserItems.push(product);
    console.log('voici le tableau listOfUserItems', listOfUserItems);

    // -> Créer un itérateur à utiliser comme key dans le localStorage (on utilise le nombre d'éléments dans le tableau contenant la liste de produit pour définir la key dans le store)
    let indexStore = listOfUserItems.length - 1;

    // -> Transformer l'objet en string (la valeur en localStorage ne peut être qu'une string) 
    let productToInsert = JSON.stringify(listOfUserItems[indexStore]);

    // -> Injecter le produit dans le store
    store.setItem(indexStore, productToInsert);
    console.log(store);

    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, product);

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

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

  // TODO : Une fois qu'un item est ajouté, il faut pouvoir modifier ses informations facilement
    // TODO : Changer les éléments <p> du nom de l'item et de sa quantité en <input> lors du focus afin de pouvoir modifier leur contenu

    const EL_LIST_PNOM = document.querySelectorAll('p.nom');
    console.log(EL_LIST_PNOM)

    EL_LIST_PNOM.forEach((element) => {
      element.addEventListener('click', (e) => {
        console.log(e.target)
      });
    });



});

// 4 kg pommes rouges