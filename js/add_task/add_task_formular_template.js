function returnHtmlTaskTemplate(createTask, leftButtonFunction, leftButton) {
return /*html*/` 
<div class="over-div">
<div class="close" onclick="closeDiv(event)">
        <div class="headline-area-template">
            <span class="headline-add-task-template">Add Task</span>
        </div>
        <form onsubmit="${createTask}(); return false" class="add-task-informations">
            <div class="left-and-rightside">
                <div class="leftside-add-task">
                    <div class="description-input d-flex-column-center">
                        <div class="input-description">
                            <div class="d-flex">
                                <span>Title</span>
                                <span class="color-FF8190">*</span>
                            </div>
                        </div>
                        <div class="container-input-required">
                            <input required class="input-field normal-border pd-12-16" id="title" type="text" placeholder="Enter a title" onclick="showOrHideRequiredField('title' ,'requiredTitle')" oninput="showOrHideRequiredField('title' ,'requiredTitle')">
                            <div id="requiredTitle" class="required-field-title vs-hidden">
                                <span class="error">This field is required</span>
                            </div>
                        </div>
                    </div>

                    <div class="description-textarea d-flex-column-center">
                        <div class="input-description">
                            <span>Description</span>
                        </div>
                        <textarea id="description" placeholder="Enter a description"></textarea>
                        <div class="required-field-description">
                            <span id="placeHolder"></span>
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
                </div>

                <div class="parting-line-add-task"></div>

                <div class="rightside-add-task">

                    <div class="description-input d-flex-column-center">
                        <div class="input-description">
                            <div class="d-flex">
                                <span>Due date</span>
                                <span class="color-FF8190">*</span>
                            </div>
                        </div>
                        <div class="container-input-required">
                            <input required class="input-field option-value-disabled normal-border" id="dueDate" type="date" onclick="showOrHideRequiredField('dueDate' ,'requiredDate')" oninput="showOrHideRequiredField('dueDate' ,'requiredDate')">
                            <div id="requiredDate" class="required-field-title vs-hidden">
                                <span class="error">This field is required</span>
                            </div>
                        </div>
                    </div>

                    <div class="position-prio">
                        <div class="input-description">
                            <span>Prio</span>
                        </div>
                        <div id="prioSelection" class="priority-selection"></div>
                    </div>

                    <div class="description-category position-category d-flex-column-center">
                        <div class="d-flex input-description">
                            <span>Category</span>
                            <span class="color-FF8190">*</span>
                        </div>
                        <div tabindex="0" id="containerCategory" class="input-category new-subtask normal-border hover"
                            onclick="showCategories('none', event)">
                            <span id="categoryDropdown">Select task category</span>
                            <div class="dropdown-icon">
                                <img src="/img/arrow_drop_down.png" id="dropDownArrowCategory">
                            </div>
                        </div>
                        <label id="categories" class="vs-hidden">
                            <div class="categories-list">
                                <span onclick="changeCategory('Technical Task')"
                                    class="pd-12-16 hover-user-field">Technical Task</span>
                                <span onclick="changeCategory('User Story')" class="pd-12-16 hover-user-field">User
                                    Story</span>
                            </div>
                        </label>
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
                </div>
            </div>
            <div class="reuired-notice-cancel-create">
                <div class="required-field-notice">
                    <span>This field is required</span>
                    <span class="color-FF8190">*</span>
                </div>
                <div class="buttons-clear-create">
                    <button class="btn-add-task-template border-cancel join-button-empty"
                        onclick="${leftButtonFunction}(event); return false">
                        <span class="typography-clear ">${leftButton}</span>
                        <img src="/img/iconoir_cancel.png">
                    </button>

                    <button class="btn-add-task bg-color-create" id="createBtn">
                        <span class="typography-create">Create Task</span>
                        <img src="/img/check.png">
                    </button>
                </div>
        </form>

        <div id="bgDialog" class="bg-dialog vs-hidden ps-fixed">
            <div class="added-to-board bg-color-create">
                <span>Task added to board</span>
                <img src="/img/addedBoard.png">
            </div>
        </div>
    </div>
</div>`
}