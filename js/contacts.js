function initContacts() {
  includeHTML();
  loadContacts();
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
  const contactList = document.getElementById("id-contacts-list");
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = null;
  contactList.innerHTML = "";
  sortedContacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();

    if (firstLetter !== currentLetter) {
      contactList.innerHTML += renderLetterSectionHTML(firstLetter);
      currentLetter = firstLetter;
    }

    console.log(contact);
  });
}

function renderLetterSectionHTML(firstLetter) {
  return /*html*/ `
  <div class="contact-list-first-letter">${firstLetter}</div>
  <div class="contact-list-letter-parting-line"></div>
  `;
}
