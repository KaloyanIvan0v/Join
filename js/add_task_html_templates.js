function returnHtmlSingleContact(user) {
    return `
    <div class="" id="paddingForChecked${i}" onclick="selectedUser(${i})">
        <div class="user-field hover-user-field" id="userField${i}">
            <div class="single-user">
                <div class="initials-assigned initials" id="bgInitials${i}">
                    ${user['nameInitials']}
                </div>
                <span class="typography-contacts-assigned">${user['name']}</span>
            </div>
            <label class="custom-checkbox" for="box${i}">
            <input type="checkbox" />
            <div id="" class="">
                <img src="../img/box-unchecked.png" id="checkBox${i}"></span>
            </div>
        </div>
    </div>`
}
function returnHtmlCheckAndClear() {
    return `
    <div id="activeInputSubtask" class="active-input-subtasks">
        <a class="hover" onclick="resetAddNewSubtask()"><img src="/img/close.png"></a>
        <span class="height-24">|</span>
        <a class="hover" onclick="addNewSubTask()"><img src="/img/Property 1=check.png"></a>
    </div>`
}

function returnHtmlAdd() {
    return `
    <a id="addIconSubtasks" onclick="addNewSubTask()" class="hover"><img src="/img/add.png"></a>`
}

function prioNormal(priority) {
    return `
    <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field hover-prio-btn ${priority['bgColorFalse']}">
        <span class="fz-20">${priority['text']}</span>
        <img id="imgUrgent" src="${priority['iconColor']}">
    </div>`
}

function prioActive(priority) {
    return `
    <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field ${priority['bgColorTrue']}">
        <span class="fz-20">${priority['text']}</span>
        <img id="imgUrgent" src="${priority['iconWhite']}">
    </div>`
}

function returnHtmlNewSubtasks(newSubTask) {
    return `
    <ul id="ulSubtasks(${i})" class="list-element-subtasks" onclick="editSubtask(${i})">
        <li id="subTaskElement${i}">${newSubTask}</li>
    </ul>`
}

function editSubtaskHtml(i, subTask) {
    return `
    <form class="label-edit-subtask">
        <input id="inputField${i}" class="edit-subtask" type="text" value="${subTask}">
        <div class="single-edit-subtask">
            <img class="hover" src="/img/trashbin.png" onclick="deleteSubtask(${i})">
            <span>|</span>
            <img class="hover" src="/img/Property 1=check.png" onclick="changeSubtask(${i})">
        </div>
    </form>`
}

function loadInitial(i, initial) {
    return `<div id="initialArea${i}" class="initial-area initials">${initial}</div>`
}