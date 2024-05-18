/**
 * Opens the contact form and loads the corresponding template based on the given form type.
 *
 * @param {string} form - The type of form ("addContact" for adding, otherwise assumed to be editing).
 * @returns {void}
 */
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

/**
 * Loads the add contact template into the contact form element.
 *
 * @param {HTMLElement} element - The HTML element to load the template into.
 * @returns {void}
 */
function loadAddContactTemplate(element) {
  handleHoverButtonChangeImgDelayed();
  element.innerHTML = `<div class="contact-form" w3-include-html="/templates/add-contact.html"></div>`;
  setTimeout(function () {
    document.getElementById("id-contact-form-cancel").classList.add("d-none-mobile-1300");
    handleInputOnFocusChangeParentElementBorderColor();
  }, 200);
}

/**
 * Loads the edit contact template into the contact form element.
 *
 * @param {HTMLElement} element - The HTML element to load the template into.
 * @returns {void}
 */
function loadEditContactTemplate(element) {
  element.innerHTML = `<div class="contact-form" w3-include-html="/templates/edit-contact.html"></div>`;
  setTimeout(function () {
    editContactFillForm();
    handleInputOnFocusChangeParentElementBorderColor();
  }, 200);
}

/**
 * Exits the contact form.
 *
 * @param {Event} event - The event triggering the exit action.
 * @returns {void}
 */
function exitContactForm(event) {
  if (event) {
    event.preventDefault();
  }
  toggleContactForm();
  setTimeout(function () {
    closeContactForm();
  }, 500);
}

/**
 * Closes the contact form.
 *
 * @param {Event} event - The event triggering the close action.
 * @returns {void}
 */
function closeContactForm(event) {
  let contactForm = document.getElementById("id-contact-form");
  if (event) {
    event.preventDefault();
  }
  contactForm.innerHTML = "";
  removeShadowLayer();
}

/**
 * Fills the edit contact form with the details of the contact being edited.
 *
 * @returns {void}
 */
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

/**
 * Adds a new contact to the contacts list.
 *
 * @returns {void}
 */
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
 * Toggles the visibility of the contact form.
 *
 * @returns {void}
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

/**
 * Opens the contact edit menu.
 *
 * @returns {void}
 */
function openContactEditMenu() {
  var element = document.getElementById("id-contact-full-mode-edit-mobile");
  element.classList.remove("hide");
}

/**
 * Closes the contact edit menu.
 *
 * @returns {void}
 */
function closeContactEditMenu() {
  if (window.width < 1080) {
    var element = document.getElementById("id-contact-full-mode-edit-mobile");
    element.classList.add("hide");
  }
}

/**
 * Sets event listeners for edit and delete buttons.
 *
 * @returns {void}
 */
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

/**
 * Creates a new contact, closes the contact form, and updates the UI.
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
 * Saves the edited contact's information, updates the UI, and closes the contact form.
 *
 * @returns {void}
 */
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

/**
 * Deletes the contact currently being edited from the form.
 *
 * @param {Event} event - The event triggering the delete action.
 * @returns {void}
 */
function deleteContactFromForm(event) {
  if (event) {
    event.preventDefault();
  }
  toggleContactForm();
  setTimeout(function () {
    deleteContact();
  }, 500);
}
