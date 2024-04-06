let tasks = [];
let loggedInUser = [];

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
  if(valueAsJSON) {
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
