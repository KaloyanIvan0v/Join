document.addEventListener('DOMContentLoaded', function() {
    let dateInput = document.getElementById('dueDate');
    let requiredDate = document.getElementById('requiredDate');
    let taskArea = document.getElementById('description');
    let assignedBtn = document.getElementById('inputToSearchContact');
    let subTask = document.getElementById('subTasks');
    let subTaskField = document.getElementById('inputFieldSubtasks')
    let inputToSearchContact = document.getElementById("inputToSearchContact");
    let containerCategory = document.getElementById("containerCategory");
    // let checkbox = document.getElementById('checkboxes');
    

    dateInput.addEventListener('change', changeBorder);
    dateInput.addEventListener('keydown', changeBorder);
    dateInput.addEventListener('blur', function() {
        resetDateInput(dateInput, requiredDate);
    })
    
    function changeBorder() {
        dateInput.classList.remove('fill-border');
        let dateInputValue = dateInput.value;

        if (!dateInputValue) {
            requiredDate.classList.remove('vs-hidden');
            dateInput.classList.add('error-border');
        } else if(dateInputValue == '') {
            requiredDate.classList.remove('vs-hidden');
            dateInput.classList.add('error-border');
            inputBorderError = true;
        } else {
            requiredDate.classList.add('vs-hidden');
            dateInput.classList.remove('error-border');
            dateInput.classList.add('fill-border');
            inputBorderError = false;
        }
    }

    function resetDateInput(dateInput, requiredDate) {
        if(inputBorderError == false) {
            requiredDate.classList.add('vs-hidden');
            dateInput.classList.remove('error-border');
            dateInput.classList.remove('fill-border');
        }
    }

    taskArea.addEventListener('click', function() {
        taskArea.classList.add('fill-border');
    })

    taskArea.addEventListener('blur', function() {
        taskArea.classList.remove('fill-border');
    })

    containerCategory.addEventListener('click', function() {
        containerCategory.classList.toggle('fill-border');
    })

    // assignedBtn.addEventListener('blur', function() {
    //     assignedBtn.classList.remove('fill-border');
    //     showCheckboxes();
    // })
});

document.addEventListener('DOMContentLoaded', function() {
    let title = document.getElementById('title');
    let requiredTitle = document.getElementById('requiredTitle');

    title.addEventListener('click', function() {
        changeBorder(title, requiredTitle);
    });

    title.addEventListener('keydown', function() {
        changeBorder(title, requiredTitle);
    });

    title.addEventListener('blur', function() {
        resetInputTitle(title, requiredTitle);
    })
    
    function changeBorder(titleId, fieldId) {
        titleId.classList.remove('fill-border');
        let titleIdValue = titleId.value;
        value = titleIdValue.length;

        if (value == 0) {
            fieldId.classList.remove('vs-hidden');
            titleId.classList.add('error-border');
        } else if(value >= 2) {
            titleId.classList.remove('error-border');
            fieldId.classList.add('vs-hidden');
            titleId.classList.add('fill-border');
        } else if(value == 1) {
            fieldId.classList.remove('vs-hidden');
            titleId.classList.add('error-border');
        }
    }

    function resetInputTitle(titleId, fieldId) {
        fieldId.classList.add('vs-hidden');
        titleId.classList.remove('error-border');
        titleId.classList.remove('fill-border');
    }
})