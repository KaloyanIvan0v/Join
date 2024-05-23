/**
 * Initializes the contacts functionality by including HTML, loading contacts data,
 * rendering contacts, and adding click listener.
 *
 * @returns {void}
 */
let currentEditingContactId;
async function initContacts() {
  includeHTML();
  await loadContacts();
  renderContacts(contacts);
  addClickListener();
}

/**
 * Changes the image source of a button on hover after a delay.
 *
 * @returns {void}
 */
function handleHoverButtonChangeImgDelayed() {
  setTimeout(function () {
    handleHoverButtonChangeImg(
      ".contact-form-cancel-btn",
      ".img-close-contact-form",
      'url("/img/close.png")',
      'url("/img/close-blue.png")'
    );
  }, 50);
}

/**
 * Deletes the currently displayed contact.
 *
 * @param {Event} event - The event triggering the delete action.
 * @returns {void}
 */
async function deleteContact(event) {
  closeContactForm();
  HideFullViewShowContactList();
  let contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex != undefined) {
    contacts.splice(contactIndex, 1);
    document.getElementById("id-contact-full-mode").innerHTML = "";
    renderContacts(contacts);
    safeContacts();
    toggleContactFullMode();
  }
}

/**
 * Creates a new contact and closes the contact form.
 *
 * @returns {void}
 */
function createContactAndCloseForm() {
  addNewContact();
  toggleContactForm();
  setTimeout(function () {
    closeContactForm();
    renderContacts(contacts);
  }, 500);
}

/**
 * Generates a badge based on the provided name.
 *
 * @param {string} name - The name to generate the badge from.
 * @returns {string} The generated badge.
 */
function generateBadge(name) {
  const nameParts = name.split(" ");
  let badge = nameParts[0][0].toUpperCase();
  if (nameParts.length > 1) {
    badge += nameParts[nameParts.length - 1][0].toUpperCase();
  }
  return badge;
}

/**
 * Sets a badge and background color for a contact.
 *
 * @param {string} badge - The badge to be set.
 * @param {string} colorId - The color ID for the background.
 * @returns {void}
 */
function setBadge(badge, colorId) {
  let badgeDiv = document.getElementById("id-mask-contact-img-div");
  badgeDiv.innerHTML = badge;
  badgeDiv.style.backgroundColor = contactColor[colorId];
}

/**
 * Saves the contacts to local storage and session storage.
 *
 * @returns {void}
 */
function safeContacts() {
  setItem("/contacts", contacts);
  setSessionStorage("contacts", contacts);
}

/**
 * Retrieves the email of the currently displayed contact.
 *
 * @returns {string} The email of the contact.
 */
function getActualContactEmail() {
  let email = document.getElementById("id-contact-full-mode-data-email").textContent;
  return email;
}

/**
 * Retrieves the index of a contact in the contacts array based on its email.
 *
 * @param {string} email - The email of the contact.
 * @returns {number|undefined} The index of the contact or undefined if not found.
 */
function getContactIndex(email) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].email == email) {
      return i;
    }
  }
}

/**
 * Sets the badge and background color for a contact.
 *
 * @param {string} badge - The badge to be set.
 * @param {string} colorId - The color ID for the background.
 * @returns {void}
 */
function setBadge(badge, colorId) {
  let badgeDiv = document.getElementById("id-mask-contact-img-div");
  badgeDiv.innerHTML = badge;
  badgeDiv.style.backgroundColor = contactColor[colorId];
}

/**
 * Generates a badge based on the provided name.
 *
 * @param {string} name - The name to generate the badge from.
 * @returns {string} The generated badge.
 */
function generateBadge(name) {
  const nameParts = name.split(" ");
  let badge = nameParts[0][0].toUpperCase();
  if (nameParts.length > 1) {
    badge += nameParts[nameParts.length - 1][0].toUpperCase();
  }
  return badge;
}

/**
 * Renders the list of contacts.
 *
 * @param {Array} contacts - The array of contacts to render.
 * @returns {void}
 */
function renderContacts(contacts) {
  const contactList = document.getElementById("id-contact-inner-list");
  const sortedContacts = sortListAlphabetically(contacts);
  let currentLetter = null;
  clearElementById("id-contact-inner-list");
  sortedContacts.forEach((contact, i) => {
    const { name, color } = contact;
    const firstLetter = name.charAt(0).toUpperCase();
    handleFirstLetterSection(firstLetter, contactList, currentLetter);
    renderContact(contact, contactList, i);
    setElementBackgroundColor(`id-contact-list-badges${i}`, color);
    currentLetter = firstLetter;
  });
  renderMobileAddContactButton();
}

/**
 * Handles rendering of the first letter section in the contact list.
 *
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {HTMLElement} contactList - The HTML element containing the contact list.
 * @param {string} currentLetter - The current letter being processed.
 * @returns {void}
 */
function handleFirstLetterSection(firstLetter, contactList, currentLetter) {
  firstLetter !== currentLetter ? renderFirstLetterSection(contactList, firstLetter) : null;
}

/**
 * Renders the HTML for the first letter section in the contact list.
 *
 * @param {HTMLElement} contactList - The HTML element containing the contact list.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @returns {void}
 */
function renderFirstLetterSection(contactList, firstLetter) {
  contactList.innerHTML += renderLetterSectionHTML(firstLetter);
}

/**
 * Clears the content of an HTML element by ID.
 *
 * @param {string} id - The ID of the HTML element to clear.
 * @returns {void}
 */
function clearElementById(id) {
  document.getElementById(id).innerHTML = "";
}

/**
 * Sorts a list of contacts alphabetically by name.
 *
 * @param {Array} list - The list of contacts to sort.
 * @returns {Array} The sorted list of contacts.
 */
function sortListAlphabetically(list) {
  const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
  return sortedList;
}

/**
 * Renders a single contact in the contact list.
 *
 * @param {Object} contact - The contact object to render.
 * @param {HTMLElement} divId - The HTML element to render the contact into.
 * @param {number} i - The index of the contact.
 * @returns {void}
 */
function renderContact(contact, divId, i) {
  const contactBadges = contact.nameInitials;
  const contactName = contact.name;
  const contactEmail = contact.email;
  divId.innerHTML += renderContactHtml(contactBadges, contactName, contactEmail, i);
}

/**
 * Sets the background color for an HTML element.
 *
 * @param {string} elementId - The ID of the HTML element.
 * @param {string} colorId - The color ID for the background.
 * @returns {void}
 */
function setElementBackgroundColor(elementId, colorId) {
  let div = document.getElementById(elementId);
  div.style.backgroundColor = contactColor[colorId];
}

/**
 * Opens a contact for full view.
 *
 * @param {string} contactEmail - The email of the contact to open.
 * @param {HTMLElement} divId - The HTML element to render the contact into.
 * @returns {void}
 */
function openContact(contactEmail, divId) {
  selectContact(divId);
  HideContactsListShowFullView();
  const contactDiv = document.getElementById("id-contact-full-mode-badges");
  let timeout = 0;
  if (contactDiv) {
    timeout = 500;
    toggleContactFullMode();
  }
  setTimeout(function () {
    renderContactFullMode(getContactData(contactEmail));
    toggleContactFullMode();
  }, timeout);
}

/**
 * Retrieves contact data based on email.
 *
 * @param {string} contactEmail - The email of the contact to retrieve data for.
 * @returns {Object} The contact data.
 */
function getContactData(contactEmail) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].email == contactEmail) {
      return contacts[i];
    }
  }
}

/**
 * Renders the full mode view for a contact.
 *
 * @param {Object} contact - The contact object to render.
 * @returns {void}
 */
function renderContactFullMode(contact) {
  const div = document.getElementById("id-contact-full-mode");
  const { name, email, phone, nameInitials, color } = contact;
  div.innerHTML = renderContactFullModeHtml(name, email, phone, nameInitials);
  setElementBackgroundColor("id-contact-full-mode-badges", color);
  setTimeout(setListenerForEditDeleteBtn, 25);
  div.innerHTML += renderContactEditMenuMobile();
}

/**
 * Hides the contacts list and shows the full view of a single contact.
 *
 * @returns {void}
 */
function HideContactsListShowFullView() {
  let contactList = document.getElementById("id-contacts-list");
  let contactSingleView = document.getElementById("id-contacts-single-view");
  contactList.classList.add("d-none-mobile");
  contactSingleView.classList.remove("d-none-mobile");
}

/**
 * Hides the full view of a single contact and shows the contacts list.
 *
 * @returns {void}
 */
function HideFullViewShowContactList() {
  let contactList = document.getElementById("id-contacts-list");
  let contactSingleView = document.getElementById("id-contacts-single-view");
  contactList.classList.remove("d-none-mobile");
  contactSingleView.classList.add("d-none-mobile");
}

/**
 * Renders the mobile add contact button.
 *
 * @returns {void}
 */
function renderMobileAddContactButton() {
  document.getElementById("id-contacts-list").innerHTML += /*html*/ `
<div id="id-mobile-add-contact" class="mobile-add-contact join-button" onclick="openContactForm('addContact')">
    <img src="/img/person_add.png" alt="">
</div>
`;
}

/**
 * Adds a shadow layer to the UI.
 *
 * @returns {void}
 */
function addShadowLayer() {
  let shadowLayer = document.getElementById("id-shadow-layer");
  shadowLayer.classList.remove("hide");
}

/**
 * Removes the shadow layer from the UI.
 *
 * @returns {void}
 */
function removeShadowLayer() {
  let shadowLayer = document.getElementById("id-shadow-layer");
  shadowLayer.classList.add("hide");
}

/**
 * Adds a click event listener to the contacts single view element to close the contact edit menu when clicking outside of it.
 *
 * @returns {void}
 */
function addClickListener() {
  var element = document.getElementById("id-contacts-single-view");
  element.addEventListener("click", function (event) {
    if (event.target.id !== "id-mobile-dot-menu" && event.target.id !== "dot-menu-img") {
      closeContactEditMenu();
    }
  });
}

/**
 * Selects a contact by adding a 'selected' class to its HTML element.
 *
 * @param {string} selectedDiv - The ID of the HTML element representing the selected contact.
 * @returns {void}
 */
function selectContact(selectedDiv) {
  const element = document.getElementById(`id-contact-list-item${selectedDiv}`);
  const contacts = document.querySelectorAll(".contact-list-item");
  contacts.forEach((contact) => {
    contact.classList.remove("selected");
  });
  element.classList.add("selected");
}

/**
 * Toggles the full mode view of a contact.
 *
 * @returns {void}
 */
function toggleContactFullMode() {
  var element = document.getElementById("id-contact-full-mode");
  element.classList.toggle("contact-full-mode-right-0");
}
