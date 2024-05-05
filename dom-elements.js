const formElement = document.querySelector('.form'); // EL_FORM
const addItemElement = document.querySelector('#nouvel-item'); // EL_ADD_INPUT_ELEMENT
const templateElement = document.querySelector('#template-item'); // EL_TEMPLATE
const listElement = document.querySelector('#liste'); // EL_UL

 // ! L'élément doit être crée à l'extérieur de la création des items de liste <li> car sinon autant d'indicateurs sont crées alors que nous voulons un unique indicateur pour l'ensemble
 const indicatorElement = document.createElement('li');
 indicatorElement.classList.add('indicateur');


export {
  formElement,
  addItemElement,
  templateElement,
  listElement,
  indicatorElement,
}