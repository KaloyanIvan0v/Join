let contacts;

const contactColor = {
  1: "rgb(255, 187, 44)",
  2: "rgb(255, 70, 70)",
  3: "rgb(255, 230, 44)",
  4: "rgb(195, 255, 43)",
  5: "rgb(0, 56, 255)",
  6: "rgb(255, 199, 3)",
  7: "rgb(252, 113, 255)",
  8: "rgb(255, 163, 94)",
  9: "rgb(32, 215, 194)",
  10: "rgb(6, 190, 232)",
  11: "rgb(147, 39, 255)",
  12: "rgb(110, 82, 255)",
  13: "rgb(255, 94, 179)",
  14: "rgb(255, 122, 1)",
};

function initContacts() {
  includeHTML();
  getContacts();
}

async function getContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
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
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = null;

  sortedContacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();

    if (firstLetter !== currentLetter) {
      console.log(`Letter ${firstLetter}`);
      currentLetter = firstLetter;
    }

    console.log(contact);
  });
}

function renderLetterSectionHTML(firstLetter) {
  return;
}
