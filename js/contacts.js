let currentEditingContactId;

async function initContacts() {
  includeHTML();
  await loadContacts();
  renderContacts(contactsInit);
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
}

function loadAddContactTemplate(element) {
  handleHoverButtonChangeImgDelayed();
  element.innerHTML = `<div class="contact-form" w3-include-html="../templates/add-contact.html"></div>`;
}

function loadEditContactTemplate(element) {
  element.innerHTML = `<div class="contact-form" w3-include-html="../templates/edit-contact.html"></div>`;
  setTimeout(function () {
    editContactFillForm();
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
}

async function deleteContact(event) {
  if (event) {
    event.preventDefault();
  }
  let contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex != undefined) {
    contactsInit.splice(contactIndex, 1);
    document.getElementById("id-contact-full-mode").innerHTML = "";
    renderContacts(contactsInit);
    safeContacts();
  }
}

function safeContacts() {
  setItem("contacts", contactsInit);
  setSesionStorage("contacts", contactsInit);
}

function getActualContactEmail() {
  let email = document.getElementById(
    "id-contact-full-mode-data-email"
  ).textContent;

  return email;
}

function getContactIndex(email) {
  for (let i = 0; i < contactsInit.length; i++) {
    if (contactsInit[i].email == email) {
      return i;
    }
  }
}

function editContactFillForm() {
  let contactIndex = getContactIndex(getActualContactEmail());
  if (contactIndex != undefined) {
    let name = contactsInit[contactIndex].name;
    let email = contactsInit[contactIndex].email;
    let phone = contactsInit[contactIndex].phone;
    let badge = contactsInit[contactIndex].nameInitials;
    let colorId = contactsInit[contactIndex].color;
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
  contactsInit[currentEditingContactId].name = document.getElementById(
    "id-edit-contact-input-name"
  ).value;
  contactsInit[currentEditingContactId].email = document.getElementById(
    "id-edit-contact-input-email"
  ).value;
  contactsInit[currentEditingContactId].phone = document.getElementById(
    "id-edit-contact-input-phone"
  ).value;
  safeContacts();
  closeContactFrom();
  renderContacts(contactsInit);
  renderContactFullMode(contactsInit[currentEditingContactId]);
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
  contactsInit.push(contact);
  safeContacts();
  closeContactFrom();
  renderContacts(contactsInit);
}

function generateBadge(name) {
  const nameParts = name.split(" ");
  let badge = nameParts[0][0].toUpperCase();
  if (nameParts.length > 1) {
    badge += nameParts[nameParts.length - 1][0].toUpperCase();
  }
  return badge;
}

function handleHoverButtonChangeImg(
  hoverElementId,
  elementToChangeId,
  imgUrl,
  imgUrlHover
) {
  var hoverElement = document.querySelector(hoverElementId);
  var elementToChangeId = document.querySelector(elementToChangeId);
  hoverElement.addEventListener("mouseover", function () {
    elementToChangeId.style.backgroundImage = imgUrlHover;
  });
  hoverElement.addEventListener("mouseout", function () {
    elementToChangeId.style.backgroundImage = imgUrl;
  });
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
}

function getContactData(contactEmail) {
  for (let i = 0; i < contactsInit.length; i++) {
    if (contactsInit[i].email == contactEmail) {
      return contactsInit[i];
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
  setListenerForEditDeleteBtn();
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
