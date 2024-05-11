let currentEditingContactId;
async function initContacts() {
  includeHTML();
  await loadContacts();
  renderContacts(contacts);
  addClickListener();
}

/**
 * Opens the contact form and loads the corresponding template based on the given form type.
 *
 * @param {string} form - The type of form ("addContact" for adding, otherwise assumed to be editing).
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

function deleteContactFromForm(event) {
  if (event) {
    event.preventDefault();
  }
  toggleContactForm();
  setTimeout(function () {
    deleteContact();
  }, 500);
}

function safeContacts() {
  setItem("contacts", contacts);
  setSessionStorage("contacts", contacts);
}

function getActualContactEmail() {
  let email = document.getElementById("id-contact-full-mode-data-email").textContent;

  return email;
}

function getContactIndex(email) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].email == email) {
      return i;
    }
  }
}

function setBadge(badge, colorId) {
  let badgeDiv = document.getElementById("id-mask-contact-img-div");
  badgeDiv.innerHTML = badge;
  badgeDiv.style.backgroundColor = contactColor[colorId];
}

function SaveEditedContact() {
  let contact = contacts[currentEditingContactId];
  contact.name = document.getElementById("id-edit-contact-input-name").value;
  contact.email = document.getElementById("id-edit-contact-input-email").value;
  contact.phone = document.getElementById("id-edit-contact-input-phone").value;
  toggleContactForm();
  setTimeout(function () {
    safeContacts();
    closeContactForm();
    renderContacts(contacts);
    renderContactFullMode(contacts[currentEditingContactId]);
  }, 500);
}

function createContactAndCloseForm() {
  addNewContact();
  toggleContactForm();
  setTimeout(function () {
    closeContactForm();
    renderContacts(contacts);
  }, 500);
}

function generateBadge(name) {
  const nameParts = name.split(" ");
  let badge = nameParts[0][0].toUpperCase();
  if (nameParts.length > 1) {
    badge += nameParts[nameParts.length - 1][0].toUpperCase();
  }
  return badge;
}

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

function handleFirstLetterSection(firstLetter, contactList, currentLetter) {
  firstLetter !== currentLetter ? renderFirstLetterSection(contactList, firstLetter) : null;
}

function renderFirstLetterSection(contactList, firstLetter) {
  contactList.innerHTML += renderLetterSectionHTML(firstLetter);
}

function clearElementById(id) {
  document.getElementById(id).innerHTML = "";
}

function sortListAlphabetically(list) {
  const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
  return sortedList;
}

function renderContact(contact, divId, i) {
  const contactBadges = contact.nameInitials;
  const contactName = contact.name;
  const contactEmail = contact.email;
  divId.innerHTML += renderContactHtml(contactBadges, contactName, contactEmail, i);
}

function setElementBackgroundColor(elementId, colorId) {
  let div = document.getElementById(elementId);
  div.style.backgroundColor = contactColor[colorId];
}

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

function getContactData(contactEmail) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].email == contactEmail) {
      return contacts[i];
    }
  }
}

function renderContactFullMode(contact) {
  const div = document.getElementById("id-contact-full-mode");
  const { name, email, phone, nameInitials, color } = contact;
  div.innerHTML = renderContactFullModeHtml(name, email, phone, nameInitials);
  setElementBackgroundColor("id-contact-full-mode-badges", color);
  setTimeout(setListenerForEditDeleteBtn, 25);
  div.innerHTML += renderContactEditMenuMobile();
}

function setListenerForEditDeleteBtn() {
  handleHoverButtonChangeImg(
    ".contact-full-mode-edit-contact",
    ".edit-btn-img",
    'url("/img/edit-pencil.png")',
    'url("/img/edit-pencil-light-blue.png")'
  );
  handleHoverButtonChangeImg(
    ".contact-full-mode-delete-contact",
    ".delete-btn-img",
    'url("/img/trash-blue.png")',
    'url("/img/trash-light-blue.png")'
  );
}

function HideContactsListShowFullView() {
  let contactList = document.getElementById("id-contacts-list");
  let contactSingleView = document.getElementById("id-contacts-single-view");
  contactList.classList.add("d-none-mobile");
  contactSingleView.classList.remove("d-none-mobile");
}

function HideFullViewShowContactList() {
  let contactList = document.getElementById("id-contacts-list");
  let contactSingleView = document.getElementById("id-contacts-single-view");
  contactList.classList.remove("d-none-mobile");
  contactSingleView.classList.add("d-none-mobile");
}

function renderMobileAddContactButton() {
  document.getElementById("id-contacts-list").innerHTML += /*html*/ `
<div id="id-mobile-add-contact" class="mobile-add-contact join-button" onclick="openContactForm('addContact')">
    <img src="/img/person_add.png" alt="">
</div>
`;
}

function addShadowLayer() {
  let shadowLayer = document.getElementById("id-shadow-layer");
  shadowLayer.classList.remove("hide");
}

function removeShadowLayer() {
  let shadowLayer = document.getElementById("id-shadow-layer");
  shadowLayer.classList.add("hide");
}

function addClickListener() {
  var element = document.getElementById("id-contacts-single-view");
  element.addEventListener("click", function (event) {
    if (event.target.id !== "id-mobile-dot-menu" && event.target.id !== "dot-menu-img") {
      closeContactEditMenu();
    }
  });
}

function selectContact(selectedDiv) {
  const element = document.getElementById(`id-contact-list-item${selectedDiv}`);
  const contacts = document.querySelectorAll(".contact-list-item");
  contacts.forEach((contact) => {
    contact.classList.remove("selected");
  });
  element.classList.add("selected");
}

function toggleContactFullMode() {
  var element = document.getElementById("id-contact-full-mode");
  element.classList.toggle("contact-full-mode-right-0");
}
