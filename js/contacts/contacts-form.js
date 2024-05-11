function openContactForm(form) {
  addShadowLayer();
  let contactForm = document.getElementById("id-contact-form");
  if (form === "addContact") {
    loadAddContactTemplate(contactForm);
  } else {
    loadEditContactTemplate(contactForm);
  }
  includeHTML();
  setTimeout(function () {
    toggleContactForm();
  }, 100);
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

function exitContactForm(event) {
  if (event) {
    event.preventDefault();
  }
  toggleContactForm();
  setTimeout(function () {
    closeContactForm();
  }, 500);
}

function closeContactForm(event) {
  let contactForm = document.getElementById("id-contact-form");
  if (event) {
    event.preventDefault();
  }
  contactForm.innerHTML = "";
  removeShadowLayer();
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
}

/**
 * Toggles the visibility of the contact form between visible and hidden.
 *
 * @return {void} No return value.
 */
function toggleContactForm() {
  const form = document.querySelector(".contact-form");
  if (form.classList.contains("contact-form-visible")) {
    form.classList.remove("contact-form-visible");
    form.classList.add("contact-form-hidden");
  } else {
    form.classList.remove("contact-form-hidden");
    form.classList.add("contact-form-visible");
  }
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
