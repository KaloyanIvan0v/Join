let currentEditingContactId;
let contacts;
async function initContacts() {
  includeHTML();
  await loadContacts();
  renderContacts(contacts);
  addClickListener();
}

function openContactForm(form) {
  let contactForm = document.getElementById("id-contact-form");
  if (form === "addContact") {
    loadAddContactTemplate(contactForm);
  } else {
    loadEditContactTemplate(contactForm);
  }
  includeHTML();
  contactForm.classList.remove("hide");
  addShadowLayer();
}

function loadAddContactTemplate(element) {
  handleHoverButtonChangeImgDelayed();
  element.innerHTML = `<div class="contact-form" w3-include-html="/templates/add-contact.html"></div>`;
  setTimeout(function () {
    document.getElementById("id-contact-form-cancel").classList.add("d-none-mobile-1300");
    handleInputOnFocusChangeParentElementBorderColor();
  }, 50);
}

function loadEditContactTemplate(element) {
  element.innerHTML = `<div class="contact-form" w3-include-html="/templates/edit-contact.html"></div>`;
  setTimeout(function () {
    editContactFillForm();
    handleInputOnFocusChangeParentElementBorderColor();
  }, 50);
}

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

function closeContactForm(event) {
  let contactForm = document.getElementById("id-contact-form");
  if (event) {
    event.preventDefault();
  }
  contactForm.classList.add("hide");
  contactForm.innerHTML = "";
  removeShadowLayer();
}

async function deleteContact(event) {
  if (event) {
    event.preventDefault();
  }
  closeContactForm();
  HideFullViewShowContactList();
  let contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex != undefined) {
    contacts.splice(contactIndex, 1);
    document.getElementById("id-contact-full-mode").innerHTML = "";
    renderContacts(contacts);
    safeContacts();
  }
}

function safeContacts() {
  setItem("contacts", contacts);
  setSesionStorage("contacts", contacts);
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

function editContactFillForm() {
  const contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex !== undefined) {
    const { name, email, phone, nameInitials: badge, color } = contacts[contactIndex];
    document.getElementById("id-edit-contact-input-name").value = name;
    document.getElementById("id-edit-contact-input-email").value = email;
    document.getElementById("id-edit-contact-input-phone").value = phone;
    setBadge(badge, color);
    currentEditingContactId = contactIndex;
  }
}

function setBadge(badge, colorId) {
  let badgeDiv = document.getElementById("id-mask-contact-img-div");
  badgeDiv.innerHTML = badge;
  badgeDiv.style.backgroundColor = contactColor[colorId];
}

function SaveEditedContact() {
  contacts[currentEditingContactId].name = document.getElementById(
    "id-edit-contact-input-name"
  ).value;
  contacts[currentEditingContactId].email = document.getElementById(
    "id-edit-contact-input-email"
  ).value;
  contacts[currentEditingContactId].phone = document.getElementById(
    "id-edit-contact-input-phone"
  ).value;
  safeContacts();
  closeContactForm();
  renderContacts(contacts);
  renderContactFullMode(contacts[currentEditingContactId]);
}

async function addNewContact() {
  const name = document.getElementById("id-add-contact-name").value;
  const email = document.getElementById("id-add-contact-email").value;
  const phone = document.getElementById("id-add-contact-phone").value;
  const color = Math.floor(Math.random() * 14) + 1;
  const nameInitials = generateBadge(name);
  const author = "Günter";
  const id = increaseId(contacts);
  const contact = { id, name, email, phone, color, nameInitials, author, checkbox: false };
  contacts.push(contact);
  safeContacts();
  closeContactForm();
  renderContacts(contacts);
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
  clearElementById("id-contact-inner-list");
  let currentLetter = null;
  sortedContacts.forEach((contact, i) => {
    const { name, color } = contact;
    const firstLetter = name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      contactList.innerHTML += renderLetterSectionHTML(firstLetter);
      currentLetter = firstLetter;
    }
    renderContact(contact, contactList, i);
    setElementBackgroundColor(`id-contact-list-badges${i}`, color);
  });
  renderMobileAddContactButton();
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
  const contactColor = contact.color;
  divId.innerHTML += renderContactHtml(contactBadges, contactName, contactEmail, i);
}

function setElementBackgroundColor(elementId, colorId) {
  let div = document.getElementById(elementId);
  div.style.backgroundColor = contactColor[colorId];
}

function openContact(contactEmail) {
  renderContactFullMode(getContactData(contactEmail));
  HideContactsListShowFullView();
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

function openContactEditMenu() {
  var element = document.getElementById("id-contact-full-mode-edit-mobile");
  element.classList.remove("hide");
}

function closeContactEditMenu() {
  if (window.width < 1080) {
    var element = document.getElementById("id-contact-full-mode-edit-mobile");
    element.classList.add("hide");
  }
}

function addClickListener() {
  var element = document.getElementById("id-contacts-single-view");
  element.addEventListener("click", function (event) {
    if (event.target.id !== "id-mobile-dot-menu" && event.target.id !== "dot-menu-img") {
      closeContactEditMenu();
    }
  });
}
