let x = true;

function addDNone() {
  if (x == true) {
    document.getElementById("popup").classList.replace("dNone", "popup");
    x = false;
  } else {
    document.getElementById("popup").classList.replace("popup", "dNone");
    x = true;
  }
}

function setAbbreviationToUserIcon(firstName, lastName) {
  if (firstName && lastName) {
    document.getElementById("abbreviation").innerHTML =
      firstName[0] + lastName[0];
  }
}

function storageClear() {
  sessionStorage.clear();
}

function setActiveSite(siteName) {
  sessionStorage.setItem("activeSite", siteName);
  goToNextSite(siteName);
}

function goToNextSite(name) {
  window.location.assign(`/html/${name}.html`);
}

function changeBackgroundColorOfLink() {
  let activeSite = sessionStorage.getItem("activeSite");
  if (activeSite == "privacyPolicy" || activeSite == "legalNotice") {
    document.getElementById(`${activeSite}`).classList.add("textColor");
  } else {
    document.getElementById(`${activeSite}`).classList.add("background");
  }
}

function loadFirstLettersFromSessionStorage() {
  //load first letters of first and last Name!
  let loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    let nameOfUser = loggedInUser.name;
    let firstAndLastName = nameOfUser.split(" ");
    let firstName = firstAndLastName[0];
    let lastName = firstAndLastName[1];
    setAbbreviationToUserIcon(firstName, lastName);
    document.getElementById("name").innerHTML = `${firstName} ${lastName}`;
  } else {
    document.getElementById("abbreviation").innerHTML = "G";
  }
}

function openPopUpW3Include(path, elementClass) {
  document
    .getElementById("id-shadow-layer")
    .classList.remove("visibility-hidden");
  document.getElementById("id-pop-up").innerHTML = `
  <div w3-include-html="${path}"
    class="${elementClass}">
  </div>`;
  includeHTML();
}
