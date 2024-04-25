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
  element.innerHTML = `<div class="contact-form" w3-include-html="../templates/add-contact.html"></div>`;
  setTimeout(function () {
    document
      .getElementById("id-contact-form-cancel")
      .classList.add("d-none-mobile-1300");
    handleInputOnFocusChangeParentElementBorderColor();
  }, 25);
}

function loadEditContactTemplate(element) {
  element.innerHTML = `<div class="contact-form" w3-include-html="../templates/edit-contact.html"></div>`;
  setTimeout(function () {
    editContactFillForm();
    handleInputOnFocusChangeParentElementBorderColor();
  }, 25);
}

function handleHoverButtonChangeImgDelayed() {
  setTimeout(function () {
    handleHoverButtonChangeImg(
      ".contact-form-cancel-btn",
      ".img-close-contact-form",
      'url("../img/close.png")',
      'url("../img/close-blue.png")'
    );
  }, 25);
}

function closeContactFrom(event) {
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
  closeContactFrom();
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
  let email = document.getElementById(
    "id-contact-full-mode-data-email"
  ).textContent;

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
  let contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex != undefined) {
    let name = contacts[contactIndex].name;
    let email = contacts[contactIndex].email;
    let phone = contacts[contactIndex].phone;
    let badge = contacts[contactIndex].nameInitials;
    let colorId = contacts[contactIndex].color;
    document.getElementById("id-edit-contact-input-name").value = name;
    document.getElementById("id-edit-contact-input-email").value = email;
    document.getElementById("id-edit-contact-input-phone").value = phone;
    setBadge(badge, colorId);
  }
  currentEditingContactId = contactIndex;
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
  closeContactFrom();
  renderContacts(contacts);
  renderContactFullMode(contacts[currentEditingContactId]);
}

async function addNewContact() {
  let name = document.getElementById("id-add-contact-name").value;
  let email = document.getElementById("id-add-contact-email").value;
  let phone = document.getElementById("id-add-contact-phone").value;
  let color = Math.floor(Math.random() * 14) + 1;
  let contactBadge = generateBadge(name);
  let author = "Günter";
  let contact = {
    name: name,
    email: email,
    phone: phone,
    color: color,
    nameInitials: contactBadge,
    author: author,
  };
  contacts.push(contact);
  safeContacts();
  closeContactFrom();
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
  let currentLetter = null;
  const contactList = document.getElementById("id-contact-inner-list");
  let sortedContacts = sortListAlphabetically(contacts);
  clearElementById("id-contact-inner-list");
  for (let i = 0; i < sortedContacts.length; i++) {
    const firstLetter = sortedContacts[i].name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      contactList.innerHTML += renderLetterSectionHTML(firstLetter);
      currentLetter = firstLetter;
    }
    renderContact(sortedContacts[i], contactList, i);
    setElementBackgroundColor(
      `id-contact-list-badges${i}`,
      sortedContacts[i].color
    );
  }
}

function renderContacts(contacts) {
  let sortedContacts = sortListAlphabetically(contacts);
  clearElementById("id-contact-inner-list");
  renderSortedContacts(sortedContacts);
}

function renderSortedContacts(sortedContacts) {
  let currentLetter = null;
  const contactList = document.getElementById("id-contact-inner-list");
  for (let i = 0; i < sortedContacts.length; i++) {
    const firstLetter = sortedContacts[i].name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      contactList.innerHTML += renderLetterSectionHTML(firstLetter);
      currentLetter = firstLetter;
    }
    renderContact(sortedContacts[i], contactList, i);
    setElementBackgroundColor(
      `id-contact-list-badges${i}`,
      sortedContacts[i].color
    );
  }
  renderMobileAddContactButton();
}

function clearElementById(id) {
  document.getElementById(id).innerHTML = "";
}

function sortListAlphabetically(list) {
  const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
  return sortedList;
}

function renderLetterSectionHTML(firstLetter) {
  return /*html*/ `
  <div class="contact-list-first-letter">${firstLetter}</div>
  <div class="contact-list-letter-parting-line"></div>
  `;
}

function renderContact(contact, divId, i) {
  const contactBadges = contact.nameInitials;
  const contactName = contact.name;
  const contactEmail = contact.email;
  const contactColor = contact.color;
  divId.innerHTML += renderContactHtml(
    contactBadges,
    contactName,
    contactEmail,
    i
  );
}

function renderContactHtml(contactBadges, contactName, contactEmail, i) {
  return /*html*/ `
  <div id="id-contact-list-item${i}" class="contact-list-item" onclick="openContact('${contactEmail}')">
    <div id="id-contact-list-badges${i}" class="contact-list-badges">${contactBadges}</div>
    <div id="id-contact-list-name-email${i}" class="contact-list-name-email">
      <div id="id-contact-list-name${i}" class="contact-list-name">${contactName}</div>
      <div id="id-contact-list-email${i}" class="contact-list-email">${contactEmail}</div>
    </div>
  </div>
  `;
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
  let div = document.getElementById("id-contact-full-mode");
  const contactName = contact.name;
  const contactEmail = contact.email;
  const contactPhone = contact.phone;
  const contactBadges = contact.nameInitials;
  const contactColor = contact.color;
  div.innerHTML = renderContactFullModeHtml(
    contactName,
    contactEmail,
    contactPhone,
    contactBadges
  );
  setElementBackgroundColor("id-contact-full-mode-badges", contactColor);
  div.innerHTML += renderContactEditMenuMobile();
  setTimeout(function () {
    setListenerForEditDeleteBtn();
  }, 25);
}

function setListenerForEditDeleteBtn() {
  handleHoverButtonChangeImg(
    ".contact-full-mode-edit-contact",
    ".edit-btn-img",
    'url("../img/edit-pencil.png")',
    'url("../img/edit-pencil-light-blue.png")'
  );
  handleHoverButtonChangeImg(
    ".contact-full-mode-delete-contact",
    ".delete-btn-img",
    'url("../img/trash-blue.png")',
    'url("../img/trash-light-blue.png")'
  );
}

function renderContactFullModeHtml(
  contactName,
  contactEmail,
  contactPhone,
  contactBadges
) {
  return /*html*/ `
    <div class="contact-full-mode-header">
      <div id="id-mobile-dot-menu" class="mobile-dot-menu join-button" onclick="openContactEditMenu()">
    <img id="dot-menu-img" src="../img/dot-menu.svg" alt="">
    </div>
    <div id="id-contacts-arrow-exit" class="contacts-arrow-exit" onclick="HideFullViewShowContactList()">
    <img src="../img/arrow-left-line.svg" alt="">
  </div>
      <div id="id-contact-full-mode-badges" class="contact-full-mode-badges">${contactBadges}</div>
      <div class="contact-full-mode-name-edit-section">
        <div class="contact-full-mode-name">${contactName}</div>
        <div class="contact-full-mode-edit">
          <button class="contact-full-mode-edit-contact" onclick="openContactForm('editContact')">
            <div class="edit-btn-img"></div>
            <div>Edit</div>
          </button>
        <button class="contact-full-mode-delete-contact" onclick="deleteContact()">
            <div class="delete-btn-img" ></div>
            <div>Delete</div>
          </button>
        </div>
      </div>
    </div>
      <div class="contact-full-mode-data">
        <div class="contact-full-mode-data-headline">Contact Information</div>
        <div class="contact-full-mode-data-email-headline">Email</div>
        <div id="id-contact-full-mode-data-email" class="contact-full-mode-data-email">${contactEmail}</div>
        <div class="contact-full-mode-data-phone-headline">Phone</div>
        <div class="contact-full-mode-data-phone">${contactPhone}</div>
      </div>
  
  `;
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
    <img src="../img/person_add.png" alt="">
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

function renderContactEditMenuMobile() {
  return /*html*/ `
  <div id="id-contact-full-mode-edit-mobile" class="contact-full-mode-edit-mobile hide">
          <button class="contact-full-mode-edit-contact" onclick="openContactForm('editContact')">
            <div class="edit-btn-img"></div>
            <div>Edit</div>
          </button>
        <button class="contact-full-mode-delete-contact" onclick="deleteContact()">
            <div class="delete-btn-img" ></div>
            <div>Delete</div>
          </button>
        </div>`;
}

function openContactEditMenu() {
  var element = document.getElementById("id-contact-full-mode-edit-mobile");
  element.classList.remove("hide");
}

function closeContactEditMenu() {
  var element = document.getElementById("id-contact-full-mode-edit-mobile");
  element.classList.add("hide");
}

function addClickListener() {
  var element = document.getElementById("id-contacts-single-view");
  element.addEventListener("click", function (event) {
    if (
      event.target.id !== "id-mobile-dot-menu" &&
      event.target.id !== "dot-menu-img"
    ) {
      closeContactEditMenu();
    }
  });
}
