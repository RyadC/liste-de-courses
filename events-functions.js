/****** IMPORTS *******/
/** DOM Elements **/
import { listElement, indicatorElement } from "./dom-elements.js";

/** Helpers Functions */
import {
  blurOnEnterPressHandler,
  deleteItemOfItemsArray,
  saveToStore,
  updatePropertyItemOfItemsArray,
} from "./helpers-functions.js";

/********************* EVENTS HANDLERS  ****************************/
// DONE : Refact
function onItemNameOrQuantityFocus(HTMLElementToListen, focusDependencies) {
  const { itemsList, store, KEY_STORE } = focusDependencies;

  HTMLElementToListen.addEventListener("focus", (e) => {
    const textValue = HTMLElementToListen.textContent;

    const inputElement = document.createElement("input");

    let propertyToChange = "";

    if (HTMLElementToListen.classList.contains("nom")) {
      inputElement.type = "text";
      propertyToChange = "name";
    } else {
      inputElement.type = "number";
      inputElement.min = "1";
      inputElement.max = "999";
      propertyToChange = "quantity";
    }

    inputElement.className = HTMLElementToListen.className;
    inputElement.value = textValue;

    HTMLElementToListen.replaceWith(inputElement);

    inputElement.focus();

    inputElement.addEventListener("keypress", blurOnEnterPressHandler);

    inputElement.addEventListener("blur", (e) => {
      // -> On récupère la nouvelle valeur entrée par l'utilisateur
      const newInputValue = inputElement.value;

      // -> On place cette nouvelle valeur dans le textContent de l'élément <p> qui va remplacer le <input>
      HTMLElementToListen.textContent = newInputValue;

      // -> On remplace le <input> par l'élément HTML de base
      inputElement.replaceWith(HTMLElementToListen);

      // -> On met à jour le tableau d'items selon la nouvelle valeur entrée par l'utilisateur
      const updateDependencies = {
        item: HTMLElementToListen,
        itemsList,
        propertyToChange,
        newValue: newInputValue,
      };
      updatePropertyItemOfItemsArray(updateDependencies);

      // -> On sauvegarde dans le store
      saveToStore(store, KEY_STORE, itemsList);
    });
  });
}

// DONE : Refact
/**
 * An event listener handler triggers on select change item
 * @param {HTMLElement} selectHTMLElement A select HTML element to listening
 * @param {object} selectDependencies An object with all dependencies that needs the eventListener { itemElement, itemsList, store, KEY_STORE }
 */
function onSelectChange(selectHTMLElement, selectDependencies) {
  const { itemElement, itemsList, store, KEY_STORE } = selectDependencies;

  selectHTMLElement.addEventListener("change", (e) => {
    const propertyToChange = "unity";
    const newSelectValue = e.srcElement.value;

    // -> On met à jour le tableau d'item selon la nouvelle valeur entrée par l'utilisateur
    const updateDependencies = {
      item: selectHTMLElement,
      itemsList,
      propertyToChange,
      newValue: newSelectValue,
    };
    updatePropertyItemOfItemsArray(updateDependencies);

    // -> On sauvegarde dans le store
    saveToStore(store, KEY_STORE, itemsList);
  });
}

// DONE : Refact
/**
 * Listener to delete item from the DOM
 * @param {HTMLElement} HTMLElementToListen The item to delete
 * @param {object} deleteDependencies An object with dependencies that the listener needs {itemsList, store, KEY_STORE}
 */
function onItemDelete(HTMLElementToListen, deleteDependencies) {
  const { itemsList, store, KEY_STORE } = deleteDependencies;

  const itemElement = HTMLElementToListen.closest("li");

  HTMLElementToListen.addEventListener("click", (e) => {
    // -> On supprime l'item <li> de la liste contenu dans le tableau
    deleteItemOfItemsArray(HTMLElementToListen, itemsList);

    // -> On sauvegarde dans le store
    saveToStore(store, KEY_STORE, itemsList);

    // -> On ajoute la classe .suppression pour améliorer l'UX
    itemElement.classList.add("suppression");

    itemElement.addEventListener("transitionend", (e) => {
      // -> On supprime l'item <li> du DOM mais on choisi la propriété 'height' car sinon il va chiosir la 1ère qui se termine qui est box-shadow et va supprimer l'élément avant même que les autres transitions se terminent
      if (e.propertyName === "height") {
        itemElement.remove();
      }
    });
  });
}

// DONE : Refact
function onItemDragStart(itemElement) {
  return itemElement.addEventListener("dragstart", (e) => {
    itemElement.classList.add("drag-start");

    // -> Pour ajouter les :: before sur les li afin d'afficher l'indicateur meme quand on passe entre deux <li> sans survoler les <li> (en passant sur le côté) car entre les deux se trouve un ::before
    listElement.classList.add("drag-en-cours");
  });
}

// DONE: Refact variables
// TODO : Refacto scope
function onItemDragOver(itemElement, indicatorElement) {
  itemElement.addEventListener("dragover", (e) => {
    // -> Remettre la classe 'indicateur' supprimer dans l'event du dragend pour faire disparaitre l'indicateur et supprimer l'attribut style qui met le 'display' à 'none'
    indicatorElement.removeAttribute("style");
    indicatorElement.classList.add("indicateur");

    const itemIsDragging = itemElement.classList.contains("drag-start");
    if (!itemIsDragging) {
      const locationOfDrag = e.offsetY;
      const middleHeightOfDragoverItem = itemElement.clientHeight / 2;

      // -> Si le drag est en dessous de la moitié de l'élément dragover
      if (locationOfDrag > middleHeightOfDragoverItem) {
        // -> Y a-t-il un <li> après l'élément dragover ?
        const thereIsElementAfter = itemElement.nextElementSibling;

        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresentAfter = thereIsElementAfter
          ? thereIsElementAfter.classList.contains("indicateur")
          : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const nextElementIsDraggingItem = thereIsElementAfter
          ? thereIsElementAfter.classList.contains("drag-start")
          : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if (!nextElementIsDraggingItem && !indicatorIsPresentAfter) {
          itemElement.insertAdjacentElement("afterend", indicatorElement);
        }

        // -> Si l'élément en dragover est suivi du <li> en drag alors je n'affiche pas l'indicateur
        if (nextElementIsDraggingItem) {
          indicatorElement.remove();
        }
      }

      // -> Si le drag est au dessus de la moitié de l'élément dragover
      if (locationOfDrag < middleHeightOfDragoverItem) {
        // -> Y a-t-il un <li> avant l'élément dragover ?
        const thereIsElementBefore = itemElement.previousElementSibling;

        // -> Si oui, s'agit-il de l'indicateur
        const indicatorIsPresentBefore = thereIsElementBefore
          ? thereIsElementBefore.classList.contains("indicateur")
          : false;

        // -> Ou bien s'agit-il de mon élément en drag
        const previousElementIsDragLi = thereIsElementBefore
          ? thereIsElementBefore.classList.contains("drag-start")
          : false;

        // -> S'il ne s'agit ni de l'indicateur et ni de mon <li> en drag, alors j'affiche l'indicateur
        if (!previousElementIsDragLi && !indicatorIsPresentBefore) {
          itemElement.insertAdjacentElement("beforebegin", indicatorElement);
        }

        // -> Si l'élément en dragover est précédé du <li> en drag alors je n'affiche pas l'indicateur
        if (previousElementIsDragLi) {
          indicatorElement.remove();
        }
      }

      // -> Si l'élément en dragover et mon <li> en drag alors je n'affiche pas l'indicateur
    } else {
      indicatorElement.remove();
    }
  });
}

// DONE: Refact
function onItemDragEnd(indicatorElement, dragendDependencies) {
  const { itemElement, store, KEY_STORE, itemsList } = dragendDependencies;

  itemElement.addEventListener("dragend", (e) => {
    itemElement.removeAttribute("draggable");
    itemElement.classList.remove("drag-start");

    const listElement = itemElement.closest("ul");
    const itemsElements = Array.from(listElement.children);

    const CSS_SCALE = "scale(1.05)";
    const CSS_BOXSHADOW = "0 0 24px rgba(32, 32, 32, .8)";
    const CSS_PROPERTIES_TRANSITION = "box-shadow transform";
    const CSS_POSITION = "relative";
    const CSS_ZINDEX = "1";
    const PHASE_TAKEOFF = "take-off";
    const PHASE_MOVING = "moving";
    const PHASE_LANDING = "landing";

    const moveLiOnGrasp = itemsElements.includes(indicatorElement);
    indicatorElement.style.display = "none";

    if (moveLiOnGrasp) {
      // -> EventListener pour effectuer le déplacement du <li> une fois seulement que le scale et le box-shadow soit terminé (mieux que de faire un seTimeout car le délais css n'est pas garantie et la maintenance et + importante car changement du délais manuellement)
      itemElement.addEventListener("transitionend", animationHandler);

      // -> Attribut HTML ajouté pour gérer les différentes phases (décollage, déplacement, atterrissage)
      itemElement.dataset.phase = PHASE_TAKEOFF;
      // -> CSS à ajouter pour la phase de décollage et de déplacement
      itemElement.style.transform = CSS_SCALE;
      itemElement.style.boxShadow = CSS_BOXSHADOW;
      itemElement.style.transition = CSS_PROPERTIES_TRANSITION;
      // -> CSS à ajouter pour corriger le problème d'affichage des unités
      itemElement.style.position = CSS_POSITION;
      itemElement.style.zIndex = CSS_ZINDEX;
    }

    // -> Retirer les ::before lorsque le drag est fini
    listElement.classList.remove("drag-en-cours");

    // ! Gestion de l'animation, ne peut être extraite de l'evenement car l'évènement à besoin d'une fonction nommée sans quoi, pluiseurs évènement 'transitionend' sont ajoutés à l'item et provoquent des bugs. Si cette fonction est exportée, elle doit prendre des paramètres supplémentaires et donc l'impossibilité d'être utilisée en tant que callback directe de l'évnèment
    function animationHandler(e) {
      const itemsElements = Array.from(listElement.children);
      const indicatorPosition = itemsElements.indexOf(indicatorElement);
      const liElementPosition = itemsElements.indexOf(itemElement);

      // -> Seulement si la transition concerne l'attribut 'transform'
      if (e.propertyName === "transform") {
        switch (itemElement.dataset.phase) {
          case PHASE_TAKEOFF:
            itemElement.dataset.phase = PHASE_MOVING;

            const margeInTopItem = Number.parseInt(
              window.getComputedStyle(itemElement).marginTop
            );
            const heightItem = itemElement.offsetHeight;
            const totalHeightItem = heightItem + margeInTopItem;

            const movingDown = indicatorPosition > liElementPosition;

            let translateValue = 0;

            const itemsNumber = movingDown
              ? indicatorPosition - liElementPosition - 1
              : indicatorPosition - liElementPosition + 1;

            translateValue = totalHeightItem * itemsNumber;

            itemElement.style.transform += ` translateY(${translateValue}px)`;

            if (movingDown) {
              for (let i = liElementPosition + 1; i < indicatorPosition; i++) {
                itemsElements[
                  i
                ].style.transform = ` translateY(-${totalHeightItem}px)`;
              }
            } else {
              for (let i = liElementPosition - 1; i > indicatorPosition; i--) {
                itemsElements[
                  i
                ].style.transform = ` translateY(${totalHeightItem}px)`;
              }
            }
            break;

          case PHASE_MOVING:
            itemElement.dataset.phase = PHASE_LANDING;

            const translateYProperties = itemElement.style.transform
              .split(" ")
              .find((property) => property.includes("translateY"));

            itemElement.style.boxShadow = "";
            itemElement.style.transform = `${translateYProperties}`;
            break;

          case PHASE_LANDING:
            itemElement.removeAttribute("data-phase");
            itemElement.removeEventListener("transitionend", animationHandler);

            indicatorElement.replaceWith(itemElement);
            itemsElements.forEach((item) => {
              item.removeAttribute("class");
              item.style.transition = "none";
              item.style.transform = "";

              setTimeout(() => {
                item.removeAttribute("style");
              }, 0);
            });

            const itemsElementsAfterMove = Array.from(listElement.childNodes);
            const newListOfItems = [];

            itemsElementsAfterMove.forEach((item) => {
              const itemNameElement = item.querySelector(".nom");
              const itemQuantityElement = item.querySelector(".quantite");
              const itemSelectElement = item.querySelector(".unite");

              newListOfItems.push({
                name: itemNameElement.textContent,
                quantity: itemQuantityElement.textContent,
                unity: itemSelectElement.value.toLowerCase(),
              });
            });

            saveToStore(store, KEY_STORE, newListOfItems);
            break;

          default:
            break;
        }
      }
    }
  });
}

// DONE : Refact
function onBtnGrap(HTMLElementToListen, indicatorElement) {
  const itemElement = HTMLElementToListen.closest("li");

  HTMLElementToListen.addEventListener("mousedown", (e) => {
    itemElement.setAttribute("draggable", "true");
  });

  HTMLElementToListen.addEventListener("mouseup", (e) => {
    itemElement.removeAttribute("draggable");
    indicatorElement.remove();
  });
}

// DONE: Refact
function eventsHandler(dependencies) {
  const { itemElement, itemsList, store, KEY_STORE } = dependencies;

  // -> Ajouter les écouteurs d'évènement au <li>
  // -> Focus sur p.nom
  const itemNameElement = itemElement.querySelector(".nom");
  onItemNameOrQuantityFocus(itemNameElement, dependencies);

  // -> Focus sur p.quantite
  const itemQuantityElement = itemElement.querySelector(".quantite");
  onItemNameOrQuantityFocus(itemQuantityElement, dependencies);

  // -> Change sur le select
  const itemSelectElement = itemElement.querySelector(".unite");
  onSelectChange(itemSelectElement, dependencies);

  // -> Click sur le btn pour la suppression de l'item
  const deleteBtnElement = itemElement.querySelector(".supprimer");
  onItemDelete(deleteBtnElement, dependencies);

  // -> Grap du bouton du <li>
  const handleElement = itemElement.querySelector(".poignee");
  onBtnGrap(handleElement, indicatorElement);

  // -> Drag du <li>
  onItemDragStart(itemElement);

  // -> Dragover du <li>
  onItemDragOver(itemElement, indicatorElement);

  // -> Dragend du <li>
  onItemDragEnd(indicatorElement, dependencies);
}

export { eventsHandler };
