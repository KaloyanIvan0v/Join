/**
 * Loads the HTML task template with specific variables into the document body.
 */
function loadHtmlTaskTemplate() {
  let body = document.getElementById('body');
  let createTask = 'createTask';
  let leftButtonFunction = 'resetInputFields';
  let leftButtonText = 'Clear';

  body.innerHTML += returnHtmlTaskTemplate(createTask, leftButtonFunction, leftButtonText);
}

function addedToBoardPopUp() {
  let bgDialog = document.getElementById("bgDialog");

  bgDialog.classList.remove("vs-hidden");
  bgDialog.classList.add("align-center");
}

function toggleDropDownArrowInputField(idImage) {
  let arrow = document.getElementById(idImage);
  if (arrowToggleCheck == false) {
    arrow.src = "../img/arrow_drop_down_up.png";
    arrowToggleCheck = true;
  } else {
    arrow.src = "../img/arrow_drop_down.png";
    arrowToggleCheck = false;
  }
}

/**
 * Resets input fields and other variables to their default state.
 */
function resetInputFields() {
  checkedUsers = [];
  subTasks = [];

  checkChangeIcons = true;

  renderSubTasks('none');
  currentDate();
  changeCategory("Select task category");
  changePrio(1);
  changeIconsSubtask();
  clearContactsChecked()

  clearInnerHtmlInputFields();
}

/**
 * Clears the inner HTML content of input fields.
 */
function clearInnerHtmlInputFields() {
  let subTasks = document.getElementById("subTasks");
  let subTasksArea = document.getElementById("newSubTaskField")
  let contactsField = document.getElementById("contactsField");
  let assignedBtn = document.getElementById("inputToSearchContact");

  title.value = "";
  description.value = "";
  contactsField.innerHTML = "";
  subTasks.value = "";
  subTasksArea.innerHTML = '';
  assignedBtn.innerHTML = "";
}

/**
 * Sets the current date as the value of the specified date input field.
 */
function currentDate() {
  let inputDateField = document.getElementById("dueDate");
  let todayDate = new Date();
  let year = todayDate.getFullYear();
  let month = todayDate.getMonth() + 1;
  let day = todayDate.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let currentDate = year + "-" + month + "-" + day;
  inputDateField.value = currentDate;
}

/**
 * Changes the priority of a task and updates the priority selection options.
 * 
 * @param {number} i - The index of the priority to change.
 */
function changePrio(i) {
  currentPrio = priorities[i]["text"];
  priorities[i]["isPriority"] = true;
  selectPriority();
}

/**
 * Updates the priority selection options based on the priority data.
 */
function selectPriority() {
  let prioSelection = document.getElementById("prioSelection");
  prioSelection.innerHTML = "";

  for (i = 0; i < priorities.length; i++) {
    priority = priorities[i];
    checkBooleanForPriority(priority);
  }
}

/**
 * Checks the boolean value for priority and updates the priority selection options.
 * 
 * @param {Object} priority - The priority object to check.
 * @param {HTMLElement} prioSelection - The HTML element to update with the priority options.
 */
function checkBooleanForPriority(priority) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority);
  } else {
    prioSelection.innerHTML += prioActive(priority);
    priority["isPriority"] = false;
  }
}

/**
 * Shows or hides the task categories dropdown menu.
 * 
 * @param {string} category - The selected category.
 * @param {Event} event - The click event.
 */
function showOrHideCategoriesField(category, event) {
  let categoriesField = document.getElementById("categories");

  toggleDropDownArrowInputField("dropDownArrowCategory");

  if(category == 'none') {
    event.stopPropagation();
  } 

  if(category != "Select task category") {
    categoriesField.classList.toggle("vs-hidden");
  }
}

/**
 * Changes the selected category for the task.
 * 
 * @param {string} category - The new category.
 */
function changeCategory(category) {
  let clickedCategory = category;

  let categoryDropdown = document.getElementById("categoryDropdown");

  categoryDropdown.innerHTML = "";
  categoryDropdown.innerHTML = clickedCategory;

  taskCategory = clickedCategory;
  showCategories(category);
}

/**
 * Clears the checked state of all contacts.
 */
function clearContactsChecked() {
  for(i = 0; i < contacts.length; i++) {
    contacts[i]['checkBoxContact'] = false;
  }
}

/**
 * Closes the popup div and resets contacts if the arrow toggle is active.
 * 
 * @param {Event} event - The click event.
 */
function closeContactsField(event) {
  if(arrowToggleCheck == true) {
    showOrHideContacts(event);
  }
}

/**
 * Shows or hides the required field indicator based on the input value.
 * 
 * @param {string} idParent - The ID of the parent input field.
 * @param {string} idToggle - The ID of the element to toggle.
 */
function showOrHideRequiredField(idParent, idToggle) {
  let input = document.getElementById(idParent)
  let inputValue = input.value;
  let element = document.getElementById(idToggle);

  if(inputValue.length == 0) {
    element.classList.remove('vs-hidden');
    input.classList.add('error-border')
  } else if(inputValue.length > 0) {
    element.classList.add('vs-hidden');
    input.classList.remove('error-border')
  }
}

/**
 * Shows or hides the contacts dropdown based on the arrow toggle state.
 * 
 * @param {Event} event - The click event.
 */
function showOrHideContacts(event) {
  event.stopPropagation();
  toggleDropDownArrowInputField("dropDownArrow");

  let contactsField = document.getElementById('contactsField');
  let inputField = document.getElementById('inputToSearchContact');

  if(arrowToggleCheck == true) {
      contactsField.classList.add('contacts-assigned');
      contactsField.classList.remove('contacts-initialen');
      renderContactsToSelect(contactsField, contacts);
  } else {
      showContactsInitial(contactsField, contacts);
      inputField.blur();
      inputField.value = '';
  }
}

/**
 * Renders contacts to the select dropdown field.
 * 
 * @param {HTMLElement} contactsField - The HTML element to render contacts into.
 * @param {Array} arrayToRender - The array of contacts to render.
 */
function renderContactsToSelect(contactsField, arrayToRender) {
  contactsField.innerHTML = '';

  for(i = 0; i < arrayToRender.length; i++) {
    contact = arrayToRender[i];
    contactsField.innerHTML += returnHtmlSingleContact(contact);
    checkIfContactChecked(i);
    backgroundColorInitials(i, "showInitial");
  }
}

/**
 * Shows the initial contacts in the contacts dropdown.
 * 
 * @param {HTMLElement} contactsField - The HTML element to render initial contacts into.
 */
function showContactsInitial(contactsField) {
  contactsField.innerHTML = '';

  for(i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let checkBoxStatus = contacts[i]['checkBoxContact'];

    if(checkBoxStatus == true) {
      contactsField.classList.remove('contacts-assigned');
      contactsField.classList.add('contacts-initialen');      
      contactsField.innerHTML += loadInitial(i, contact);
      backgroundColorInitials(i, "none");
    }
  }
}

/**
 * Sets the background color of the initials area based on the specified area.
 * 
 * @param {number} i - The index of the contact.
 * @param {string} whichArea - The area to set the background color for.
 */
function backgroundColorInitials(i, whichArea) {
  let currentColor = contacts[i]["color"];
  let bgColorCheckedUser = contactColor[currentColor];

  if (whichArea == "showInitial") {
    let bgInitials = document.getElementById(`bgInitials${i}`);
    bgInitials.style.backgroundColor = bgColorCheckedUser;
  } else {
    let bgInitials = document.getElementById(`initialArea${i}`);
    bgInitials.style.backgroundColor = bgColorCheckedUser;
  }
}

/**
 * Searches for contacts based on the input value and updates the contacts dropdown accordingly.
 */
function searchContact() {
  let inputSearchContact = document.getElementById("inputToSearchContact").value;

  inputSearchContact = inputSearchContact.toLowerCase();

  findContactsAtSearch.splice(0, findContactsAtSearch.length);
  if(inputSearchContact.length >= 0) {
    for (i = 0; i < contacts.length; i++) {
      contact = contacts[i];
      filterContacts(contact, inputSearchContact);
    }
    renderContactsToSelect(contactsField, findContactsAtSearch);
  } else {
    renderContactsToSelect(contactsField, contacts);
  }
}

/**
 * Filters contacts based on the input search value.
 * 
 * @param {Object} contact - The contact object.
 * @param {string} inputSearchContact - The search value.
 */
function filterContacts(contact, inputSearchContact) {
  if (contact.name.toLowerCase().includes(inputSearchContact)) {
    findContactsAtSearch.push(contact); 
  }
}

/**
 * Handles the selection of a user.
 * 
 * @param {number} i - The index of the contact.
 * @param {Event} event - The click event.
 * @param {string} id - The ID of the contact.
 */
function selectedUser(i, event, id) {
  event.stopPropagation();

  checkedContactsId.push(id);
  let singleUser = contacts[i];
  let currentIndex = checkedUsers.indexOf(singleUser);
  let inputField = document.getElementById('inputToSearchContact');

  if (!checkedUsers.includes(singleUser, 0)) {
    checkedUsers.push(singleUser);
  } else {
    checkedUsers.splice(currentIndex, 1);
  }
  toggleBackgroundForCheckedUser(i);
  toggleCheckbox(i);
  inputField.focus();
}

/**
 * Toggles the background color for the checked user.
 * 
 * @param {number} i - The index of the contact.
 */
function toggleBackgroundForCheckedUser(i) {
  let userField = document.getElementById(`userField${i}`);
  let paddingForChecked = document.getElementById(`paddingForChecked${i}`);

  userField.classList.toggle("hover-user-field");
  paddingForChecked.classList.toggle("pd-right-16");
}

/**
 * Toggles the checkbox status of the contact.
 * 
 * @param {number} i - The index of the contact.
 */
function toggleCheckbox(i) {
  let checkBox = document.getElementById(`checkBox${i}`);
  let checkBoxStatus = contacts[i]["checkbox"];

  if (checkBoxStatus == true){
    checkBox.src = "../img/box-unchecked.png";
    contacts[i]["checkBoxContact"] = false;
  } else {
    checkBox.src = "../img/Check button.png";
    contacts[i]["checkBoxContact"] = true
  }
}

/**
 * Checks if the contact is checked and updates the UI accordingly.
 * 
 * @param {number} i - The index of the contact.
 */
function checkIfContactChecked(i) {
  let currentContactId = contacts[i]['id'];

  for(j = 0; j < checkedContactsId.length; j++) {
    let checkedContact = checkedContactsId[j];
    if(checkedContact === currentContactId) {
      toggleBackgroundForCheckedUser(i);
      toggleCheckbox(i);
    }
  }
}