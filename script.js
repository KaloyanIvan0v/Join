const contactColor = {
  1: "rgb(255, 187, 44)",
  2: "rgb(255, 70, 70)",
  3: "rgb(255, 230, 44)",
  4: "rgb(195, 255, 43)",
  5: "rgb(0, 56, 255)",
  6: "rgb(255, 199, 3)",
  7: "rgb(252, 113, 255)",
  8: "rgb(255, 163, 94)",
  9: "rgb(32, 215, 194)",
  10: "rgb(6, 190, 232)",
  11: "rgb(147, 39, 255)",
  12: "rgb(110, 82, 255)",
  13: "rgb(255, 94, 179)",
  14: "rgb(255, 122, 1)",
};

let tasks = [];
let conatacts = [];
let users = [];
let geLoggedInUser;

let activeSite = "summery";

function setLoggedInUser(user) {
  saveToLocalStorage("loggedInUser", user);
}

function getLoggedInUser() {
  return getFromLocalStorage("loggedInUser");
}

function saveToLocalStorage(key, value) {
  value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  value = localStorage.getItem(key);
  valueAsJSON = JSON.parse(value);
  if (valueAsJSON) {
    return valueAsJSON;
  }
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function setSesionStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {}
}

async function getFromSessionStorage(key) {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    const value = JSON.parse(serializedValue);
    return value;
  } catch (error) {
    return null;
  }
}

function handleInputOnFocusChangeParentElementBorderColor() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.addEventListener("focus", function () {
      input.parentElement.style.borderColor = "var(--accent-color)";
    });
    input.addEventListener("blur", function () {
      input.parentElement.style.borderColor = "rgba(0, 0, 0, 0.1)";
    });
  });
}

function handleHoverButtonChangeImg(
  hoverClassName,
  elementsToChangeClassName,
  imgUrl,
  imgUrlHover
) {
  var hoverElements = document.querySelectorAll(hoverClassName);
  var elementsToChange = document.querySelectorAll(elementsToChangeClassName);

  hoverElements.forEach(function (hoverElement, index) {
    hoverElement.addEventListener("mouseover", function () {
      elementsToChange[index].style.backgroundImage = imgUrlHover;
    });
    hoverElement.addEventListener("mouseout", function () {
      elementsToChange[index].style.backgroundImage = imgUrl;
    });
  });
}

function setActiveSite(name){
  activeSite = name;
}
