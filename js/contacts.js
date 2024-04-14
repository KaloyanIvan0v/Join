async function initContacts() {
  includeHTML();
  await loadContacts();
  printContactsByLetter(contactsInit);
}

function openContactForm(form) {
  let contactForm = document.getElementById("id-contact-form");
  if (form === "addContact") {
    setTimeout(function () {
      handleHoverCancleButton();
    }, 20);
    contactForm.innerHTML = `<div class="contact-form" w3-include-html="../templates/add-contact.html"></div>`;
  } else {
    contactForm.innerHTML = `<div class="contact-form" w3-include-html="../templates/edit-contact.html"></div>`;
  }
  includeHTML();
  contactForm.classList.remove("hide");
}

function closeContactFrom(event) {
  let contactForm = document.getElementById("id-contact-form");
  event.preventDefault();
  contactForm.classList.add("hide");
  contactForm.innerHTML = "";
}

function deleteContact(event) {
  event.preventDefault();
}

function safeEditedContact() {}

function addNewContact() {
  console.log("new Contact");
}

function editContact() {}

function handleHoverCancleButton() {
  var cancelButton = document.querySelector(".contact-form-cancel-btn");
  var imgClose = document.querySelector(".img-close-contact-form");
  cancelButton.addEventListener("mouseover", function () {
    imgClose.style.backgroundImage = 'url("../img/close-blue.png")';
  });
  cancelButton.addEventListener("mouseout", function () {
    imgClose.style.backgroundImage = 'url("../img/close.png")';
  });
}

function printContactsByLetter(contacts) {
  const contactList = document.getElementById("id-contact-inner-list");
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = null;
  contactList.innerHTML = "";

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
}

function renderContactFullModeHtml(
  contactName,
  contactEmail,
  contactPhone,
  contactBadges
) {
  return /*html*/ `
    <div class="contact-full-mode-header">
      <div class="contact-full-mode-badges">${contactBadges}</div>
      <div class="contact-full-mode-name-edit-section">
        <div class="contact-full-mode-name">${contactName}</div>
        <div class="contact-full-mode-edit">
          <div class="contact-full-mode-edit-contact">
            <img src="" alt="">
            <div>Edit</div>
          </div>
        <div class="contact-full-mode-delete-contact">
            <img src="" alt="">
            <div>Delete</div>
          </div>
        </div>
      </div>
    </div>
      <div class="contact-full-mode-data">
        <div class="contact-full-mode-data-headline">Contact Information</div>
        <div class="contact-full-mode-data-email-headline">Email</div>
        <div class="contact-full-mode-data-email">${contactEmail}</div>
        <div class="contact-full-mode-data-phone-headline">Phone</div>
        <div class="contact-full-mode-data-phone">${contactPhone}</div>
      </div>
  
  `;
}
