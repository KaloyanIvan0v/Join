function returnHtmlShowToDos(singleTask, i, id, finshedSubtasksLenght, subTasksLength) {
  return /*html*/ `
   <div id="taskCard${id}" class="task-card" draggable="true" ondragstart='startDragging(${id})'
    onclick="openTaskDetailView(${i},${id})">
    <div class="task-card-category">
        <span id="statementField${i}" class="which-statement">
            ${singleTask["category"]}
        </span>
    </div>

    <div class="header-area-card">
        <div class="ft-weight-700">
            ${singleTask["title"]}
        </div>
        <div class="task-msg">
            ${singleTask["description"]}
        </div>
        <div id="id-subtasks-progress-section${id}" class="subtasks-progress-section hide">
            <div id="progressBar${id}" class="progerss-bar-container">
                <div id="id-loadbar${id}" class="loadbar"></div>
            </div>
            <div id="subtasks-progress-text${id}" class="subtasks-progress-text"></div>
        </div>
    </div>

    <div class="subtasks-contacts">
        <div class="subtasks-loadbar-number">

        </div>

        <div class="contacts-area">
            <div id="contactsFieldBoard(${i})" class="contacts-board"></div>
            <div id="prioField${i}" class="prio-field">
                ${singleTask["prio"]}
            </div>
        </div>
    </div>
</div>
`;
}

function returnHtmlEditCurrentTask(overlayTask, i) {
  return /*html*/ `
    <div id="id-overlay-current-task" class="overlay-current-task">
      <div id="categoryArea(${i})" class="overlay-first-row">
        <div></div>
        <a onclick="closeEditTaskPopUp()">X</a>
    </div>
    <div class="title-edit-board">
      <div class="input-description">
        <div class="title-headline">
          <span clas="edit-task-headlines">Title</span>
        </div>
      </div>
      <div>
        <input class="input-edit-title" id="title" type="text" value="${overlayTask["title"]}">
        <div>
          <span class="required-field-edit vs-hidden">This field is required</span>   
        </div>
      </div>
    </div>
    
    <div class="description-edit-board">
      <span clas="edit-task-headlines">Description</span>
      <div>
        <textarea id="description(${i})" class="edit-task-description">${overlayTask["description"]}</textarea>
      </div>
    </div>
    
    <div class="overlay-date-edit font-overlay">
        <span clas="edit-task-headlines">Due date</span>
        <input class="input-edit-title" type="date" value="${overlayTask["dueDate"]}" id="date(${i})">
        <div class="vs-hidden">
         <span class="required-field-edit">This field is required</span>
        </div>
    </div>
    <div class="overlay-prio">
      <p>Priority</p>
       <div class="prio-area" id="prioArea(${i})">
      <div onclick="prioSelect(${i}, 'urgent')">
        <img id="urgent(${i})" src="/img/urgent.png">
      </div>

      <div onclick="prioSelect(${i}, 'medium')">
        <img id="medium(${i})" src="/img/medium_highlight.png">
      </div>

      <div onclick="prioSelect(${i}, 'Low')">
        <img id="low(${i})" src="/img/low.png">
      </div>
    </div>
    </div>
   

    <div class="assigned-to d-flex-column-center">
                        <span class="input-description">Assigned to</span>
                        <div onclick="showOrHideContacts(event)" class="input-category new-subtask normal-border hover">
                            <input onkeydown="searchContact()" tabindex="0" class="border-none hover" id="inputToSearchContact" type="text" placeholder="Select contacts to assign">
                            <div class="dropdown-icon">
                                <img src="/img/arrow_drop_down.png" id="dropDownArrow">
                            </div>
                        </div>
                        <div class="container-input-required">
                            <div class="contacts-assigned" id="contactsField"></div>
                        </div>
                    </div>
    <div class="description-category d-flex-column-center pd-bottom-80">
                        <span class="input-description">Subtasks</span>
                        <div id="inputFieldSubtasks" class="input-field new-subtask normal-border">
                            <input min="3" onclick="changeIconsSubtask(event)" class="input-new-subtask" type="text" id="subTasks" placeholder="Add new subtask">
                            <div class="icon-subtask-field" id="addIconSubtasks">
                                <a id="addIconSubtasks" class="icon-subtask-field"><img class="add-icon" src="/img/add.png"></a>
                            </div>
                        </div>
                        <div id="newSubTaskField"></div>
                    </div>

    <div class="last-section-overlay">
      <div></div>
      <div class="delete-edit-overlay">
      <button class="btn-save-edit-task join-button" onclick="saveTaskChanges(${i}); return false">
        <span class="typography-clear">Ok</span>
        <img src="/img/check-white.png">
      </button>
      </div>
    </div>
</div>`;
}

function previewElementHtml(positon) {
  return /*html*/ `
  <div class="preview-element-${positon}"></div>
  `;
}

function renderSubtaskProgressBarHtml(singleTask, finishedSubTasks) {
  return /*html*/ `
<div class="loadbar-container">
   <div id="loadBar" class="loadbar"></div>
  </div>
  <div class="number-done-subtasks">
    <span>${finishedSubTasks.length}/</span>
    <span>${singleTask["subTasks"].length} Subtasks</span>
  </div>
  `;
}

function returnMoreContactsPreview(restAmount) {
  return /*html*/ `
    <div id="initialArea${j}" class="contact-board mg-left-8" style="background-color: rgb(42, 54, 71)">
      <span>+${restAmount}</span>
    </div>`;
}

function openTaskDetailViewHtml(overlayTask, i, id) {
  return /*html*/ `
  <div class="overlay-current-task">
    <div id="categoryArea(${i})" class="overlay-first-row">
        <div class="overlay-category" id="statementField${i}">${overlayTask["category"]}</div>
        <a onclick="closePopUp()">X</a>
    </div>
    <div class="overlay-title">
        <span id="title(${i})">${overlayTask["title"]}</span>
    </div>
    <div class="overlay-description font-overlay">
      <span id="description(${i})">${overlayTask["description"]}</span>
    </div>
    <div class="overlay-date font-overlay">
        <span class="task-detail-view-section-title">Due Date:</span>
        <span id="date(${i})">${overlayTask["dueDate"]}</span>
    </div>
    <div class="overlay-prio font-overlay">
        <span class="task-detail-view-section-title">Priority:</span>
        <div class="prio-name-image">
            <span>${overlayTask["prio"]}</span>
            <div id="prioField${i}"></div>
        </div>
    </div>
    <div class="overlay-assigned font-overlay">
        <span class="task-detail-view-section-title">Assigned To:</span>
        <div class="d-flex">
          <div id="contactsFieldBoard(${i})" class="column-gap-contacts"></div>
          <div id="contactsFieldBoardFullName" class="column-gap-contacts"></div>
        </div>
    </div>
    <div class="overlay-subtasks font-overlay">
      <span class="task-detail-view-section-title">Subtasks</span>
      <div id="subTasksField" class="input-subtasks-overlay"></div>
    </div>
    <div class="last-section-overlay">
      <div></div>
      <div class="delete-edit-overlay">
        <div onclick="deleteTask(${id})" class="flex-center hover btn-hover-trash">
          <div class="img-hover-trash"></div>
          <span>Delete</span>
        </div>
        <img src="/img/Vector 3.png">
        <div onclick="editTaskOverlay(${i})" class="flex-center hover  btn-hover-edit">
         <div class="img-hover-edit"></div>
          <span>Edit</span>
        </div>
      </div>
    </div>
    </div>
  <div>`;
}

function returnHtmlContactsInitialen(contactForTask, j) {
  return /*html*/ `
    <div id="initialArea${j}" class="contact-board mg-left-8">
      <span>${contactForTask["nameInitials"]}</span>
    </div>`;
}

function returnHtmlSubtasks(subTask, i, subTaskId, imgSrc) {
  return /*html*/ `
    <div class="subtasks-check-board">
      <img id="checkEmptySubtask(${j})" src="${imgSrc}" onclick="toggleCheckboxSubTask(${i},${subTaskId})">
      <span>${subTask}</span>
    </div>`;
}

function returnHtmlContactsFullName(currentTask) {
  return /*html*/ `
    <div class="full-name">
      <span>${currentTask["name"]}</span>
    </div>`;
}

function taskAreaIsEmptyHtml(statement) {
  return /*html*/ `
  <div class="task-area-empty-mgs">
    no tasks ${statement}
  </div>
  `;
}

function renturnTaksAssignetContactNameHtml(name) {
  return /*html*/ `
  <div class="task-assignet-contact-name">${name}</div>
 `;
}
