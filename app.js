//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos());
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('change', filterTodo);

//Function
function addTodo(event){
    //Prevents from submitting
    event.preventDefault();
    
    //ToDo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    
    //create li
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    //Add ToDo to local storage
    saveLocalTodos({
        name: newTodo.innerText,
        class: todoDiv.classList
    });

    //Check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Check trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to list
    todoList.appendChild(todoDiv);

    //Clear ToDo input value
    todoInput.value = "";
}

function deleteCheck(event){
    const item = event.target;

    //Delete ToDo
    if(item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        deletePromise(todo);
        todo.classList.add('deleteTrans');
        removeLocalTodos(todo);

        //Delete list after transition using event listener
        /*todo.classList.add('deleteTrans');
        todo.addEventListener("transitioned", function(){
            todo.remove();
        });*/
    }

    //Complete or Check ToDo
    if(item.classList[0] === 'complete-btn'){
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        completedLocalTodos(todo);
    }
}

//Promise code for asynchronous operation of delete using promise
function deletePromise(todo){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(todo.remove());
        }, 500);
    });
}

function filterTodo(event){
    const todos = todoList.childNodes;

    todos.forEach(function(todo){
        switch(event.target.value){
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if (todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }
                else{
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if( !todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }
                else{
                    todo.style.display = 'none';
                }
                break;
        }
    })
}

function checkLocalTodo(){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
        return todos;
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos'));
        return todos;
    }
}

function saveLocalTodos(todo){
    //Check if you already have a todo
   let todos;
   todos = checkLocalTodo();
    todos.push(todo); 
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
    //Check if you already have a todo
    let todos;
    todos = checkLocalTodo();

    todos.forEach(function(todo){
        //ToDo div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");
        
        //create li
        const newTodo = document.createElement('li');
        newTodo.innerText = todo.name;
        newTodo.classList.add("todo-item");
        
        //Check if any localstorage object.class contains storage
        /*if(todo.class.contains("completed")){
            newTodo.classList.add("completed");
        }*/

        if(todo.class[1] == 'completed'){
            newTodo.classList.add("completed");
        }
        todoDiv.appendChild(newTodo);

        //Check mark button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        //Check trash button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        //Append to list
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    let todos;
   todos = checkLocalTodo();

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function completedLocalTodos(todo){
    //Check if local todo is already completed
    let todos; // Local data
    todos = checkLocalTodo();
    let todoText = todo.childNodes[0].innerText;

    //using arr.map to find index
    let todosName = todos.map(todo => todo.name);
    let todoIndex = todosName.indexOf(todoText);

    //For loop to get index of obj.name from local storage
    /*for(let i=0; i<todos.length; i++){
        if(todos[i].name === todoText){
            todoIndex = i;
            break;
        }
    }*/

    let classNames = todo.classList;
    todos.splice(todoIndex,1,{name: todosName[todoIndex], class: classNames});

    localStorage.setItem("todos", JSON.stringify(todos));
    
}