let x = true;


/**
 * This function is used to open and close the Popup at the header.
 * 
 */
function addDNone() { //Open Popup (Head).
  if (x == true) {
    document.getElementById("popup").classList.replace("dNone", "popup");
    x = false;
  } else {
    document.getElementById("popup").classList.replace("popup", "dNone");
    x = true;
  }
}


/**
 * This function load the name of the loggedin user, executes the function setAbbreviationToUserIcon() and render the fullname 
 * to greetingssection on summery.html.
 * 
 */
function loadFirstLettersFromSessionStorage() {
  //load first letters of first and last Name!
  let loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  let activeSite = sessionStorage.getItem("activeSite");
  if (loggedInUser) {
    let nameOfUser = loggedInUser.name;
    let firstAndLastName = nameOfUser.split(" ");
    let firstName = firstAndLastName[0];
    let lastName = firstAndLastName[1];
    setAbbreviationToUserIcon(firstName, lastName);
    if (window.innerWidth > 1440) {
      if (activeSite == 'summery') {
        document.getElementById("name").innerHTML = `${firstName} ${lastName}`;
      }
    }
  } else {
    document.getElementById("abbreviation").innerHTML = "G";
  }
}


/**
 * This function render the initials to Header Popupbutton. 
 * 
 * @param {sting} firstName - Firstname of function loadFirstLettersFromSessionStorage().
 * @param {sting} lastName - Lastname of function loadFirstLettersFromSessionStorage().
 */
function setAbbreviationToUserIcon(firstName, lastName) {
  if (firstName && lastName) {
    document.getElementById("abbreviation").innerHTML = firstName[0] + lastName[0];
  }
}


/**
 * This function clears the sessionstorage at logout.
 * 
 */
function storageClear() {
  sessionStorage.clear();
}


/**
 * This function set the actual site to sessionstorage and executes function goToNextSite().
 * 
 * @param {string} siteName - The name of site in sessionstorage.
 */
function setActiveSite(siteName) {
  sessionStorage.setItem("activeSite", siteName);
  goToNextSite(siteName);
}


/**
 * This function passes to active site.
 * 
 * @param {string} sitename - The name of site in sessionstorage.
 */
function goToNextSite(sitename) {
  window.location.assign(`/html/${sitename}.html`);
}


/**
 * This function hightlight the active site on sidebar.
 * 
 */
function changeBackgroundColorOfLink() {
  let activeSite = sessionStorage.getItem("activeSite");
  if (activeSite == "privacyPolicy" || activeSite == "legalNotice") {
    document.getElementById(`${activeSite}`).classList.add("textColor");
  } else {
    document.getElementById(`${activeSite}`).classList.add("background");
  }
}