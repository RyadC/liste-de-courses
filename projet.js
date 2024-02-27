/****** IMPORTS *******/
import { 
  // removeUnnecessarySpaces,
  capitalizeFirstLetter,
  extractData,
  createLiHtmlItem,
  blurOnEnterPressHandler,
} from './utils.js';
/**********************/

// * N'exécute le code que si le HTML et le CSS est parsé
document.addEventListener('DOMContentLoaded', () => {

  // TODO : Initialiser le localStorage
  const store = window.localStorage;
  
  /****** DOM ELEMENTS *******/
  const EL_FORM = document.querySelector('.form');
  const EL_INPUT_ADD_ITEM = document.querySelector('#nouvel-item');
  const EL_TEMPLATE = document.querySelector('#template-item');
  const EL_UL = document.querySelector('#liste');
  // const EL_P_NAME = EL_TEMPLATE.content.querySelector('p.nom');
  // const EL_P_QUANTITY = EL_TEMPLATE.content.querySelector('p.quantite');
  /***************************/
  
  // TODO :  Array pour récupérer les items du store (permettra de traiter les items pour l'affichage sur la page)
  let arrayOfUserItems = [];
  
  // TODO : Récupérer les items du localStorage s'il contient des items
  if(store.length) {
    // console.log(store.list);
    // console.log(JSON.parse(store.list));
    arrayOfUserItems = JSON.parse(store.list);
  }

  console.log('arrayOfUserItems', arrayOfUserItems)


  // TODO : Afficher les items récupérés du localStorage sur la page
  for(const item of arrayOfUserItems) {
    console.log(item)

    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, item);

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

    //-> Ajouter les écouteurs d'évènement au <li>
      //-> Pour p.nom
    const EL_P_NOM = newLiElement.querySelector('.nom');

    EL_P_NOM.addEventListener('focus', (e) => {
    //  const { EL_NEW_INPUT, EL_P } = transformParagraphToInputHandler(EL_P_NOM, 'text');
      const valuePElement = EL_P_NOM.textContent;

      const EL_NEW_INPUT =  document.createElement('input');
      EL_NEW_INPUT.type = 'text';
      EL_NEW_INPUT.className = EL_P_NOM.className;
      EL_NEW_INPUT.value = valuePElement;
      
      EL_P_NOM.replaceWith(EL_NEW_INPUT);
      
      EL_NEW_INPUT.focus();

      EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);

      EL_NEW_INPUT.addEventListener('blur', (e) => {
        // -> On récupère la nouvelle valeur entrée par l'utilisateur
        const newInputValue = EL_NEW_INPUT.value;

        // -> On place cette nouvelle valeur dans le textContent de l'élément <p> qui va remplacer le <input>
        EL_P_NOM.textContent = newInputValue;

        // -> On remplace le <input> par le <p>
        EL_NEW_INPUT.replaceWith(EL_P_NOM);
        
        // TODO : Sauvegarder les modifs dans les inputs de chaque item
        // console.dir(EL_P_NOM)
        // console.log(EL_P_NOM.parentElement)
        // -> On récupère l'index de l'élément dans la liste des <li>
        const itemIndexInUlElement = Array.from(EL_P_NOM.parentElement.parentElement.children).indexOf(EL_P_NOM.parentElement);

        // -> On copie le tableau initial de la liste des items
        const reverseArrayOfProduct = [];
        Object.assign(reverseArrayOfProduct, arrayOfUserItems);

        // -> On inverse le contenu du tableau pour que l'ordre des items soit comme l'ordre des <li> dans le DOM
        reverseArrayOfProduct.reverse();

        console.log(reverseArrayOfProduct)

        console.log(reverseArrayOfProduct[itemIndexInUlElement].name)
        
        // -> On change le nom de l'item selon la modification de l'utilisateur dans le tableau
        reverseArrayOfProduct[itemIndexInUlElement].name = newInputValue;

        console.log(reverseArrayOfProduct[itemIndexInUlElement].name)

        // -> On remet le tableau dans l'ordre initial
        reverseArrayOfProduct.reverse();

        // -> On copie le nouveau tableau dans le tableau initial
        Object.assign(arrayOfUserItems, reverseArrayOfProduct);

        console.log(arrayOfUserItems)

        // -> On sauvegarde dans le store
        store.setItem('list', JSON.stringify(arrayOfUserItems));
      });
    });

      //-> Pour p.quantite
    const EL_P_QUANTITY = newLiElement.querySelector('.quantite');

    EL_P_QUANTITY.addEventListener('focus', (e) => {
      // transformParagraphToInputHandler(e, 'number');
      const valuePElement = EL_P_QUANTITY.textContent;

      const EL_NEW_INPUT =  document.createElement('input');
      EL_NEW_INPUT.type = 'number';
      EL_NEW_INPUT.min = '1';
      EL_NEW_INPUT.max = '999';
      EL_NEW_INPUT.className = EL_P_QUANTITY.className;
      EL_NEW_INPUT.value = valuePElement;
      
      EL_P_QUANTITY.replaceWith(EL_NEW_INPUT);
      
      EL_NEW_INPUT.focus();

      EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);

      EL_NEW_INPUT.addEventListener('blur', (e) => {
        const newInputValue = EL_NEW_INPUT.value;
        EL_P_QUANTITY.textContent = newInputValue;
        EL_NEW_INPUT.replaceWith(EL_P_QUANTITY);
        console.log(EL_P_QUANTITY);
        
        // TODO : Sauvegarder les modifs dans les inputs de chaque item
        // -> On récupère l'index de l'élément dans la liste des <li>
        const itemIndexInUlElement = Array.from(EL_P_QUANTITY.parentElement.parentElement.children).indexOf(EL_P_QUANTITY.parentElement);

        // -> On copie le tableau initial de la liste des items
        const reverseArrayOfProduct = [];
        Object.assign(reverseArrayOfProduct, arrayOfUserItems);

        // -> On inverse le contenu du tableau pour que l'ordre des items soit comme l'ordre des <li> dans le DOM
        reverseArrayOfProduct.reverse();

        console.log(reverseArrayOfProduct)

        console.log(reverseArrayOfProduct[itemIndexInUlElement].name)
        
        // -> On change le nom de l'item selon la modification de l'utilisateur dans le tableau
        reverseArrayOfProduct[itemIndexInUlElement].quantity = newInputValue;

        console.log(reverseArrayOfProduct[itemIndexInUlElement].quantity)

        // -> On remet le tableau dans l'ordre initial
        reverseArrayOfProduct.reverse();

        // -> On copie le nouveau tableau dans le tableau initial
        Object.assign(arrayOfUserItems, reverseArrayOfProduct);

        console.log(arrayOfUserItems)

        // -> On sauvegarde dans le store
        store.setItem('list', JSON.stringify(arrayOfUserItems));
      });

    });
  }






  // * A la validation de l'input via le bouton "Ajouter"
  EL_FORM.addEventListener('submit', (e) => {
    // debugger;
    //-> Désactiver le comportement par défaut du formulaire
    e.preventDefault();

    //-> Récupérer le contenu de l'input
    const inputValue = EL_INPUT_ADD_ITEM.value;
    console.log(inputValue)

    // -> Extraire les données de l'utilisateur de manière exploitable
    const product = extractData(inputValue, EL_TEMPLATE.content);

    //-> Mettre la 1ère lettre en majuscule
    product.name = capitalizeFirstLetter(product.name);

    // -> Stocker les données sous la forme d'un tableau d'objets. Chaque objet représentera un item.
    arrayOfUserItems.push(product);
    console.log('voici le tableau arrayOfUserItems', arrayOfUserItems);

    // -> Transformer l'objet en string (la valeur en localStorage ne peut être qu'une string) 
    let listOfProductsToInsert = JSON.stringify(arrayOfUserItems);
    console.log('listOfProductsToInsert', listOfProductsToInsert)


    // -> Injecter le produit dans le store (avant de manipuler le DOM)
    store.setItem('list', listOfProductsToInsert);
    console.log(store);

    // -> Créer un élément <li> avec les données utilisateur
    const newLiElement = createLiHtmlItem(EL_TEMPLATE.content, product);

    //-> Ajouter le <li> en début de liste
    EL_UL.insertAdjacentElement("afterbegin",newLiElement);

    //-> Ajouter les écouteurs d'évènement au <li>
      //-> Pour p.nom
    const EL_P_NOM = newLiElement.querySelector('.nom');

    EL_P_NOM.addEventListener('focus', (e) => {
    //  const { EL_NEW_INPUT, EL_P } = transformParagraphToInputHandler(EL_P_NOM, 'text');
      const valuePElement = EL_P_NOM.textContent;

      const EL_NEW_INPUT =  document.createElement('input');
      EL_NEW_INPUT.type = 'text';
      EL_NEW_INPUT.className = EL_P_NOM.className;
      EL_NEW_INPUT.value = valuePElement;
      
      EL_P_NOM.replaceWith(EL_NEW_INPUT);
      
      EL_NEW_INPUT.focus();

      EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);

      EL_NEW_INPUT.addEventListener('blur', (e) => {
        


        EL_P_NOM.textContent = EL_NEW_INPUT.value;
        EL_NEW_INPUT.replaceWith(EL_P_NOM);
        console.log(EL_P_NOM);

        // console.log(Array.from(EL_P_NOM.parentElement.parentElement.children).indexOf(EL_P_NOM.parentElement))
        // const nameProduct = EL_P_NOM.textContent;

        // const indexProduct = Array.from(EL_P_NOM.parentElement.parentElement.children).indexOf(EL_P_NOM.parentElement);

        // console.log(indexProduct);

        // console.log(arrayOfUserItems[indexProduct]);

        // const product = JSON.parse(store.getItem('list'));

        // product.name = nameProduct;

        // console.log(JSON.stringify(product))

        // store.setItem(indexProduct, JSON.stringify(product));

        // console.log()
        

      });
    });

      //-> Pour p.quantite
    const EL_P_QUANTITY = newLiElement.querySelector('.quantite');

    EL_P_QUANTITY.addEventListener('focus', (e) => {
      // transformParagraphToInputHandler(e, 'number');
      const valuePElement = EL_P_QUANTITY.textContent;

      const EL_NEW_INPUT =  document.createElement('input');
      EL_NEW_INPUT.type = 'number';
      EL_NEW_INPUT.min = '1';
      EL_NEW_INPUT.max = '999';
      EL_NEW_INPUT.className = EL_P_QUANTITY.className;
      EL_NEW_INPUT.value = valuePElement;
      
      EL_P_QUANTITY.replaceWith(EL_NEW_INPUT);
      
      EL_NEW_INPUT.focus();

      EL_NEW_INPUT.addEventListener('keypress', blurOnEnterPressHandler);

      EL_NEW_INPUT.addEventListener('blur', (e) => {

        EL_P_QUANTITY.textContent = EL_NEW_INPUT.value;
        EL_NEW_INPUT.replaceWith(EL_P_QUANTITY);
        console.log(EL_P_QUANTITY);    
      });

    });
    

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