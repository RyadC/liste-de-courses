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

  // -> Initialiser le localStorage : 1ère chose à faire: Récupérer les données utilisateurs pour éviter de perdre les données en cas de bug
  const store = window.localStorage;
  console.log(store);

  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');
  const EL_P_NAME = EL_TEMPLATE.content.querySelector('p.nom');
  const EL_P_QUANTITY = EL_TEMPLATE.content.querySelector('p.quantite');
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

    // -> Injecter le produit dans le store (avant de manipuler le DOM)
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
    // TODO : Changer les éléments <p> p.nom et p.quantite en <input> lors du focus afin de pouvoir modifier leur contenu

    const EL_LIST_P_NAME = document.querySelectorAll('.nom');
    console.log(EL_LIST_P_NAME)


    EL_LIST_P_NAME.forEach((element) => {
        element.addEventListener('focus', (e) => {
          const valuePElement = e.target.textContent;

          // ! Pas possible d'utiliser outerHTML car la référence pointe toujours l'élément suppprimé. Il faut utiliser replaceWith();
          // // e.target.outerHTML = `<input type="text" class="nom" value="${valuePElement}">`;

          // -> L'élément <p> est mis en mémoire afin de remplacer l'<input> par la suite. Ainsi, il ne sera pas nécessaire de créer un nouvel élément <p> ni même de lui donner des attributs. C'est ainsi un gain en maintenance car on récupèrer l'élément <p> tel qu'il est sans ne rien ajouter ni enlever à ce moment là (s'il est modifier avant ou bien dans le HTML, on le récupère tel quel)
          const EL_P = e.target;
          const EL_NEW_INPUT =  document.createElement('input');
          EL_NEW_INPUT.type = "text";
          EL_NEW_INPUT.className = e.target.className;
          EL_NEW_INPUT.value = valuePElement;
          
          EL_P.replaceWith(EL_NEW_INPUT);

          EL_NEW_INPUT.focus();

          // // TODO : l'input doit être retransformé à nouveau en élément <p> lorsqu'on appuie sur la touche `Entree`
          EL_NEW_INPUT.addEventListener('keypress', (e) => {
            // console.log(e)
            e.code === 'Enter' ? e.target.blur() : '';
          });

          EL_NEW_INPUT.addEventListener('blur', (e) => {
            EL_P.textContent = EL_NEW_INPUT.value;
            EL_NEW_INPUT.replaceWith(EL_P);
            console.log(EL_P)
          });
        });
    });





});

// 4 kg pommes rouges