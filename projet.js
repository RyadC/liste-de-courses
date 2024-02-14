/****** IMPORTS *******/
import { 
  removeUnnecessarySpaces,
  capitalizeFirstLetter,
} from './utils.js';



/****** DOM ELEMENTS *******/
const EL_FORM = document.querySelector('.form');
const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
const EL_TEMPLATE = document.querySelector('#template-item');
const EL_UL = document.querySelector('#liste');


// console.log(EL_INPUT_ADD_ITEM)

// * A la validation de l'input via le bouton "Ajouter"
EL_FORM.addEventListener('submit', (e) => {
  // Désactiver le comportement par défaut du formulaire
  e.preventDefault();

  // Récupérer le contenu de l'input en format lowercase
  const inputValue = EL_INPUT_ADD_ITEM.value.toLowerCase();

  // Retirer les espaces inutiles éventuels
  const inputValueWithoutSpaces = removeUnnecessarySpaces(inputValue);

  // Récupérer la quantité, l'unité et le nom du produit selon les données fournies par l'utilisateur

  const arrayValueSplit = inputValueWithoutSpaces.split(' ');
  let nameOfProduct = '';
  let quantityOfProduct = 1; 
  let unityOfProduct = 'u';
  const listOfQuantity = ['u', 'g', 'kg', 'l'];

  // La 1ère valeur est-elle un nombre ?
  if(Number(arrayValueSplit[0])){
    quantityOfProduct = Number(arrayValueSplit[0]);

    // Si oui, alors deux choix possibles : le 2nd est soit le nom ou la quantité
      // On regarde s'il s'agit de la quantité
    if(listOfQuantity.includes(arrayValueSplit[1])) {
      // Si oui alors on récupère l'unité en 2ème position et le nom du produit en 3ème position
      unityOfProduct = arrayValueSplit[1];
      // On récupère le reste du tableau puis on concatène pour les produits avec des noms composés : fraises des bois
      nameOfProduct = arrayValueSplit.slice(2).join(' ');
      
    } else {
      // Sinon, c'est qu'il n'y a pas d'unité de donnée 
      nameOfProduct = arrayValueSplit.slice(1).join(' ');
    };

  } else {
    // Sinon, il s'agit du nom
    nameOfProduct = arrayValueSplit.slice(0).join(' ');
  };

  console.log(arrayValueSplit)
  console.log(unityOfProduct);
  console.log(quantityOfProduct);
  console.log(nameOfProduct);

  // Mettre la 1ère lettre en majuscule
  const nameOfProductCapitalize = capitalizeFirstLetter(nameOfProduct);

  // Cloner le template pour injecter un nouvel <li>
  const EL_CLONE_LI = EL_TEMPLATE.content.cloneNode(true).children[0];


  // Injecter les valeurs de l'input formaté
    // le nom du produit dans le <p.nom> enfant du <li>
  const EL_NAME_LI = EL_CLONE_LI.querySelector('.nom');
  EL_NAME_LI.textContent = nameOfProductCapitalize;
  
    // la quantité dans le <p.quantite> enfant du <li>
  const EL_QUANTITY_LI = EL_CLONE_LI.querySelector('.quantite');
  EL_QUANTITY_LI.textContent = quantityOfProduct;
  
  // l'unité dans l'option du <select>
  const EL_SELECT_LI = EL_CLONE_LI.querySelector('.unite');
  console.log(EL_SELECT_LI.children)
  for(const option of EL_SELECT_LI) {
    if(option.value.toLowerCase() === unityOfProduct) {
      option.selected = true;
    };
  };



  // Ajouter le <li> en début de liste
  EL_UL.insertAdjacentElement("afterbegin",EL_CLONE_LI);

  // Effacer le champs de l'input après validation puis lui ajouter le focus 
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

