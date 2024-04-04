// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    
//this is giving a number to the variable nextID for each task sequentially
    if (!nextId){
        nextId = 1
    } else{
        nextId += 1;
    }
    localStorage.setItem("nextID", JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>").addClass("card w-75 task-card draggable my-3").attr("data-task-id", task.id);
    const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $('<p>').addClass("card-text").text(task.description);
    const cardDueDate = $('<p>').addClass("card-text").text(task.dueDate);
    const cardDeleteButton = $("<button>").addClass("btn btn-danger delete").text("Delete").attr("data-task-id", task.id);
    
    cardDeleteButton.on("click", handleDeleteTask);


//this is changing the color of the card if the due date is day of or overdue
    if(task.dueDate && task.status !== 'done'){
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");
        if(now.isSame(taskDueDate, 'day')){
            taskCard.addClass("bg-warning text-white");
        } else if (now.isAfter(taskDueDate, 'day')){
            taskCard.addClass("bg-danger text-white");
            cardDeleteButton.addClass("border-light");
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteButton);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (!taskList){
        taskList = [];
    }
//left column variable
    const todoList = $("#todo-cards");
    todoList.empty();

//middle column variable
    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();

//right column variable
    const doneList = $("done-cards");
    doneList.empty();

    for(let index = 0; index < taskList.length; index++){
        if (taskList[index].status === "to-do"){
            todoList.append(createTaskCard(taskList[index]));
        } else if(taskList[index.status === "in-progress"]){
            inProgressList.append(createTaskCard(taskList[index]));
        } else if(taskList[index].status === "done"){
            doneList.append(createTaskCard(taskList[index]));
        }
    }

    $(".draggable").draggable({
        opacity: 0.6,
        zIndex: 100,

        helper: function(event) {
            let original;
            if($(event.target).hasClass("ui-draggable")){
                original = $(event.target);
            } else {
                original = $(event.target).closest("ui-draggable");
            }
            
            return original.clone().css({
                maxWidth: original.outerWidth(),
            });
        }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

//the object that will hold the generated ID as well as the inputs from the user
    const task = {
        id: generateTaskId(),
        title: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        dueDate: $("#taskDueDate").val(),
        status: 'to-do'
    }

//Adds the object to the variable taskList at the top, sets it in local storage, and then wipes the input
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    $("#taskTitle").val("");
    $("#taskDescription").val("");
    $("#taskDueDate").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskID = $(this).attr("data-task-id")
    
    localStorage.setItem("tasks", JSON.stringify(taskList))
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskID = ui.draggable.dataset.taskID;
    const updatedStatus = event.target.id;

    for(let index = 0; index < taskList.length;index++){
        if(taskList[index].id == parseInt(taskID)){
            taskList[index].status = updatedStatus;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#taskForm").on("submit", handleAddTask)

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop
    })

    $("#taskDueDate").datepicker({
        changeMonth: true,
        changeYear: true
    })
});