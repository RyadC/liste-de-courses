/****** IMPORTS *******/
import { 
  // removeUnnecessarySpaces,
  capitalizeFirstLetter,
  extractData,
} from './utils.js';

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');

  /****** GLOBALS VARIABLES ******/
  const listOfUserItems = [];


  // console.log(EL_INPUT_ADD_ITEM)

  // * A la validation de l'input via le bouton "Ajouter"
  EL_FORM.addEventListener('submit', (e) => {
    //-> Désactiver le comportement par défaut du formulaire
    e.preventDefault();

    //-> Récupérer le contenu de l'input en format lowercase
    const inputValue = EL_INPUT_ADD_ITEM.value.toLowerCase();

    // -> Extraire les données de l'utilisateur de manière exploitable
    // // ! extractData(source) n'utilise pas les constantes DEFAULT_UNITY et DEFAULT_QUANTITY car ne parvient pas à y faire référence depuis utils.js
    const product = extractData(inputValue, EL_TEMPLATE.content);

    //-> Mettre la 1ère lettre en majuscule
    product.name = capitalizeFirstLetter(product.name);

    // // TODO : Stocker les données sous la forme d'un tableau d'objets. Chaque objet représentera un item.
    listOfUserItems.push(product);
    console.log(listOfUserItems);

    //-> Cloner le template pour injecter un nouvel <li>
    const EL_CLONE_LI = EL_TEMPLATE.content.cloneNode(true).children[0];

    //-> Injecter les valeurs de l'input formaté
      //-> le nom du produit dans le <p.nom> enfant du <li>
    const EL_NAME_LI = EL_CLONE_LI.querySelector('.nom');
    EL_NAME_LI.textContent = product.name;
    
      //-> la quantité dans le <p.quantite> enfant du <li>
    const EL_QUANTITY_LI = EL_CLONE_LI.querySelector('.quantite');
    EL_QUANTITY_LI.textContent = product.quantity;
    
    //-> l'unité dans l'option du <select>
    const EL_SELECT_LI = EL_CLONE_LI.querySelector('.unite');
    console.log(EL_SELECT_LI.children)
    for(const option of EL_SELECT_LI) {
      if(option.value.toLowerCase() === product.unity) {
        option.selected = true;
      };
    };

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",EL_CLONE_LI);

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