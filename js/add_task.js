let currentPrio = ['medium'];
let tasks = [];
let subTasks = [];
let checkedUsers = [];
let priorities = [
    {
        'text': 'Urgent',
        'iconWhite': '/img/urgent_white.png',
        'iconColor': '/img/urgent_red.png',
        'bgColorTrue': 'highlight-color-urgent',
        'bgColorFalse': 'bg-color-priority',
        'isPriority': false,
    },
    {
        'text': 'Medium',
        'iconWhite': '/img/medium_white.png',
        'iconColor': '/img/medium_orange.png',
        'bgColorTrue': 'highlight-color-medium',
        'bgColorFalse': 'bg-color-priority',
        'isPriority': true,
    },
    {
        'text': 'Low',
        'iconWhite': '/img/low_white.png',
        'iconColor': '/img/low_green.png',
        'bgColorTrue': 'highlight-color-low',
        'bgColorFalse': 'bg-color-priority',
        'isPriority': false,
    }
]
let checkChangeIcons = false;
let expanded = false;
inputBorderError = false;

async function init() {
    includeHTML();
    loadTasks();
    loadContacts();
    whichPriority();
    await loadUsers();
    currentDate();
    // await getContacts();
}

function currentDate() {
    let inputDateField = document.getElementById('dueDate');
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = todayDate.getMonth() + 1;
    let day = todayDate.getDate();
    if(month < 10) {
        month = '0' + month;
    }
    if(day < 10) {
        day = '0' + day;
    }
    let currentDate = year + '-' + month + '-' + day
    inputDateField.value = currentDate;
}

function changePrio(i) {
    currentPrio = priorities[i]['text'];
    priorities[i]['isPriority'] = true;
    whichPriority();
}

function whichPriority() {
    let prioSelection = document.getElementById('prioSelection');
    prioSelection.innerHTML = '';

    for(i = 0; i < priorities.length; i++) {
        priority = priorities[i];
        checkBooleanForPriority(priority);
    }
}

function checkBooleanForPriority(priority) {
    if(priority['isPriority'] == false) {
        prioSelection.innerHTML += prioNormal(priority);
    } else {
        prioSelection.innerHTML += prioActive(priority);
        priority['isPriority'] = false;
    }
}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    subTasks = JSON.parse(await getItem('subTasks'));
}

async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    // let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    let subTasks =  document.getElementById('subTasks');

    let task = {
        "title": title.value,
        "description": description.value,
        "assignedTo": checkedUsers,
        "dueDate": dueDate.value,
        "prio": currentPrio,
        "category": category.value,
        "subTasks": subTasks,
        }
    tasks.push(task);
    addedToBoard();
    await setItem('tasks', tasks);
    resetInputFields();
    window.location.href = "board.html";
}

function addedToBoard() {
    let bgDialog = document.getElementById('bgDialog');

    bgDialog.classList.remove('vs-hidden');
    bgDialog.classList.add('align-center');
}

function resetInputFields() {
    let subTasks =  document.getElementById('subTasks');
    let initialArea = document.getElementById('initialArea');
    let newSubTaskField = document.getElementById('newSubTaskField');

    title.value = '';
    description.value = '';
    initialArea.innerHTML = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';
    newSubTaskField.innerHTML = '';

    checkChangeIcons = true;
    changeIconsSubtask();
}

function resetAddNewSubtask() {
    let subTasks =  document.getElementById('subTasks');
    subTasks.value = '';
    checkChangeIcons = true;
    changeIconsSubtask();
    // checkChangeIcons = false;
}

async function addNewSubTask() {
    let newTaskField = document.getElementById('newSubTaskField');
    let singleNewTask = document.getElementById('subTasks');
    let singleNewTaskValue = singleNewTask.value;

    if(singleNewTaskValue.length >= 3){
        subTasks.push(singleNewTaskValue);
        singleNewTask.value = '';
        newTaskField.innerHTML = '';

        for(i = 0; i < subTasks.length; i++) {
            let newSubTask = subTasks[i];
            newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
        }
        checkChangeIcons = true;
        changeIconsSubtask();
        await setItem('subTasks', subTasks);
    }
}

function changeIconsSubtask() {
    let addIconSubtasks = document.getElementById('addIconSubtasks');

    addIconSubtasks.innerHTML = '';

    if(checkChangeIcons == false) {
        addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
        checkChangeIcons = false;
    } else {
        addIconSubtasks.innerHTML = returnHtmlAdd();
        checkChangeIcons = false;
    }
}

function returnHtmlCheckAndClear() {
    return `
    <div id="activeInputSubtask" class="active-input-subtasks">
        <a onclick="resetAddNewSubtask()"><img src="/img/close.png"></a>
        <span class="height-24">|</span>
        <a onclick="addNewSubTask()"><img class="size-check" src="/img/check_black.png"></a>
    </div>`
}

function returnHtmlAdd() {
    return `
    <a id="addIconSubtasks" onclick="addNewSubTask()" class="icon-subtask-field"><img src="/img/add.png"></a>`
}

function prioNormal(priority) {
    return `
    <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field ${priority['bgColorFalse']}">
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
    <ul>
        <li>${newSubTask}</li>
    </ul>`
}

function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    let initialsArea = document.getElementById('initialArea');
    // let containerUserInitialen = document.getElementById('containerUserInitialen');

    if (!expanded) {
        checkboxes.classList.remove('vs-hidden');
        renderAssignedToField();
        expanded = true;
    } else {
        // containerUserInitialen.innerHTML = '';
        checkboxes.innerHTML = '';
        checkboxes.classList.remove('user-list');
        checkboxes.classList.add('d-flex-initials')
        // containerUserInitialen.classList.toggle('vs-hidden');
        expanded = false;
        showInitials();
    }
}

function renderAssignedToField() {
    let userCheckBox = document.getElementById('checkboxes');
    userCheckBox.innerHTML = '';

    if(!userCheckBox.classList.contains('user-list')) {
        userCheckBox.classList.remove('d-flex-initials');
        userCheckBox.classList.add('user-list')
    }

    for(i = 0; i < contactsInit.length; i++){;
        user = contactsInit[i];
        userCheckBox.innerHTML += `
            <div class="user-field">
                <div class="single-user">
                    <div class="initials-assigned" id="bgInitials${i}">
                        ${user['nameInitials']}
                    </div>
                    <label class="typography-contacts-assigned" for="${i}">
                    ${user['name']}
                </div>
                <input type="checkbox" onclick="selectedUser(${i})" id="checkBox${i}" />
            </div>`
            backgroundColorInitials(i);
    }
    for(i = 0; i < contactsInit.length; i++){;
        examineUser(i);   
    }


}

function examineUser(i) {
    let currentLabel = document.getElementById(`checkBox${i}`);
    let currentName = contactsInit[i]['name'];

    if(checkedUsers.length > 0) {
        if(checkedUsers.includes(currentName)) {
            currentLabel.checked = true;
        }
    }
}

function backgroundColorInitials(i) {
    let bgInitials = document.getElementById(`bgInitials${i}`)
    let currentColor = contactsInit[i]['color'];
    let bgColor = contactColor[currentColor];

    bgInitials.style.backgroundColor = bgColor;
}

function selectedUser(i) {
    let singleUser = contactsInit[i]['name'];
    let currentIndex = checkedUsers.indexOf(singleUser);

    if(!checkedUsers.includes(singleUser, 0)) {
        checkedUsers.push(singleUser);
    } else {
        checkedUsers.splice(currentIndex, 1);
    }
    setItem('checkedUsers', checkedUsers);
}

// function clearCheckBox() {
//     let checkBox = document.getElementById('checkboxes');
//     checkBox.innerHTML = '';

//     showInitials();
// }

function showInitials() {
    let initialsArea = document.getElementById('checkboxes');
    // let containerUserInitialen = document.getElementById('containerUserInitialen');
    initialsArea.innerHTML = '';

    for(i = 0; i < checkedUsers.length; i++) {
        let singleUser = checkedUsers[i];
        let nameParts = singleUser.split(" ");
        let firstLetter = nameParts[0].substring(0, 1);
        if(nameParts.length == 2) {
            let secondLetter = nameParts[1].substring(0, 1);
            let nameInitial = firstLetter + secondLetter;
            initial = nameInitial;
        } else {
            initial = firstLetter;
        }
        initialsArea.innerHTML += `<div class="initial-area">${initial}</div>`
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let dateInput = document.getElementById('dueDate');
    let requiredDate = document.getElementById('requiredDate');

    dateInput.addEventListener('change', changeBorder);
    dateInput.addEventListener('keydown', changeBorder);
    
    function changeBorder() {
        dateInput.classList.remove('fill-border');

        if (inputBorderError == false) {
            requiredDate.classList.remove('vs-hidden');
            dateInput.classList.add('error-border');
            inputBorderError = true;
        } else {
            requiredDate.classList.add('vs-hidden');
            dateInput.classList.remove('error-border');
            dateInput.classList.add('fill-border');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let title = document.getElementById('title');
    let requiredTitle = document.getElementById('requiredTitle');
    let textArea = document.getElementById('description');

    title.addEventListener('click', function() {
        changeBorder(title, requiredTitle);
    });

    title.addEventListener('keydown', function() {
        changeBorder(title, requiredTitle);
    });

    // title.addEventListener('click', changeBorder(title, requiredTitle));
    // title.addEventListener('keydown', changeBorder(title, requiredTitle));
    // textArea.addEventListener('click', changeBorder);
    
    function changeBorder(test12, test34) {
        test12.classList.remove('fill-border');

        if (inputBorderError == false) {
            test34.classList.remove('vs-hidden');
            test12.classList.add('error-border');
            inputBorderError = true;
        } else {
            test34.classList.add('vs-hidden');
            test12.classList.remove('error-border');
            test12.classList.add('fill-border');
        }
    }
})

// document.addEventListener('DOMContentLoaded', function() {
//     let assignedBtn = document.getElementById('assignedBtn');
//     let selectAssigned = document.getElementById('selectAssigned');
//     let option = document.getElementById('option');

//     assignedBtn.addEventListener('click', function() {
//         changeBorder();
//     });

//     function changeBorder() {
//         selectAssigned.classList.remove('normal-border');
//         selectAssigned.classList.add('fill-border');
//         option.innerHTML = '';
//     }
    // selectAssigned.addEventListener('keydown', changeBorder);
    
    // function changeBorder() {
    //     dateInput.classList.remove('fill-border');

    //     if (inputBorderError == false) {
    //         requiredDate.classList.remove('vs-hidden');
    //         dateInput.classList.add('error-border');
    //         inputBorderError = true;
    //     } else {
    //         requiredDate.classList.add('vs-hidden');
    //         dateInput.classList.remove('error-border');
    //         dateInput.classList.add('fill-border');
    //     }
// })