/****** IMPORTS *******/
import { 
  formattingInputValue, 
  initializeInputValidity,
} from './utils.js';



/****** DOM ELEMENTS *******/
const EL_FORM = document.querySelector('.form');
const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
const EL_TEMPLATE = document.querySelector('#template-item');
const EL_UL = document.querySelector('#liste');


// console.log(EL_INPUT_ADD_ITEM)

// A la validation de l'input via le bouton "Ajouter"
EL_FORM.addEventListener('submit', (e) => {
  console.log(e)
  // Désactiver le comportement par défaut du formulaire
  e.preventDefault();

  // Récupérer le contenu de l'input
  const inputValue = EL_INPUT_ADD_ITEM.value;

  // Formatter la donnée récupérée
  const inputValueFormatted = formattingInputValue(inputValue);

  // Cloner le template pour injecter un nouvel <li>
  const EL_CLONE_LI = EL_TEMPLATE.content.cloneNode(true).children[0];

  // Injecter la valeur de l'input enregistré dans le <p> enfant du <li>
  const EL_NAME_LI = EL_CLONE_LI.querySelector('.nom');
  EL_NAME_LI.textContent = inputValueFormatted;

  // Ajouter le <li> en début de liste
  EL_UL.insertAdjacentElement("afterbegin",EL_CLONE_LI);

  // Effacer le champs de l'input après validation puis lui ajouter le focus 
  EL_INPUT_ADD_ITEM.value = "";
  EL_INPUT_ADD_ITEM.focus();

  initializeInputValidity(e);

});

// Empêcher l'affichage du message d'erreur (géré dans l'event 'invalid') si l'utilisateur tente de réécrire dans l'input
EL_INPUT_ADD_ITEM.addEventListener('input', (e) => {
  initializeInputValidity(e);
});


// Si les données entrées dans l'input ne correspondent pas aux données attendues, on affiche un message d'erreur correspondant
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

