let tasks = [];
let loggedInUser = [];

function setLoggedInUser(user) {}

function getLoggedInUser() {}

function saveToLocalStorage(key, value) {
  value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  value = localStorage.getItem(key);
  valueAsJSON = JSON.parse(value);
  return valueAsJSON;
}
