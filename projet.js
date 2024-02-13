/****** IMPORTS *******/
import { formattingInputValue } from './utils.js';



/****** DOM ELEMENTS *******/
const EL_FORM = document.querySelector('.form');
const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
const EL_TEMPLATE = document.querySelector('#template-item');
const EL_UL = document.querySelector('#liste');


console.log(EL_INPUT_ADD_ITEM)

// A la validation de l'input via le bouton "Ajouter"
EL_FORM.addEventListener('submit', (e) => {
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
  
});

