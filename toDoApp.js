const newTask = document.querySelector('.input-task');
const newTaskBtnTaskAdd = document.querySelector('.btn-task-add');
const tasksList = document.querySelector('.tasks-list');

let selectedItem = [];
const btnDeleteAll = document.querySelector('.btn-delete-all');
const btnSelectedDelete = document.querySelector('.btn-selected-delete');

newTaskBtnTaskAdd.addEventListener('click', taskAdd);
tasksList.addEventListener('click', taskCheckDelete);
btnDeleteAll.addEventListener('click', taskDeleteAll);
btnSelectedDelete.addEventListener('click', selectedItemDelete);
document.addEventListener('DOMContentLoaded', localStorageRead);

document.addEventListener('keydown', (e) => {
    let key = e.key;
    if(key === 'Delete'){
        if(selectedItem.length > 0){
            selectedItemDelete();
        }
    }
})

tasksList.addEventListener('change', selectChecbox);

function activeDeactiveButton(){
    let tasks = localStorageArray();
    if(tasks.length === 0){
        btnDeleteAll.classList.add('deactive');
        btnSelectedDelete.classList.add('deactive');
    }else{
        btnDeleteAll.classList.remove('deactive');
        btnSelectedDelete.classList.remove('deactive');
    }
}

function selectedItemDelete(){
    if(confirm("Are you sure delete?")){
        let divItems = document.querySelectorAll('.tasks-item');

    divItems.forEach((item) => {
        for(i=0; i<selectedItem.length; i++){
            if(selectedItem[i] === item.children[1].innerText){
                item.classList.toggle('delete');
                localStorageDelete(selectedItem[i]);
                item.addEventListener('transitionend', function(){
                    item.remove();
                });
            }
        }
    })
    selectedItem.splice(0, selectedItem.length);
    if(selectedItem.length === 0){
        btnSelectedDelete.classList.remove('btn-active')
    }
    };

    
    
}

function selectChecbox(e){
    const clickedLement = e.target;

    if(clickedLement.checked){
        let temp = clickedLement.parentElement.children[1].innerText;
        selectedItem.push(temp);
    }else{
        temp = clickedLement.parentElement.children[1].innerText;
        const checkboxDeleteItemIndex = selectedItem.indexOf(temp);
        selectedItem.splice(checkboxDeleteItemIndex, 1);
    }
    if(selectedItem.length>0){
        btnSelectedDelete.classList.add('btn-active');
    }else{
        btnSelectedDelete.classList.remove('btn-active');
    }
    return selectedItem;
}

function taskDeleteAll(e){
    if(confirm("Are you sure delete all list?")){
        let tasks = localStorageArray();

        const divItems = document.querySelectorAll('.tasks-item');
    
        divItems.forEach((item) => {
            item.classList.toggle('delete');
            for(i=0; i<tasks.length; i++){
                localStorageDelete(item.children[i].innerText);
            }
            item.addEventListener('transitionend', function(){
                item.remove();
            });
        });
        selectedItem.splice(0, selectedItem.length);
    };
}


function taskCheckDelete(e){
    const clickedElement = e.target;
    
    if(clickedElement.classList.contains('btn-task-done')){
        clickedElement.parentElement.classList.toggle('task-done');
    }
    if(clickedElement.classList.contains('btn-task-delete') && confirm("are u sure delete?")){   
        clickedElement.parentElement.classList.toggle('delete');

        localStorageDelete(clickedElement.parentElement.children[1].innerText);

        clickedElement.parentElement.addEventListener('transitionend', function(){
            clickedElement.parentElement.remove();
        });
    }
}


function taskAdd(e){
    e.preventDefault();
    taskItemCreate(newTask.value);
    
    //local storage save
    localStorageAdd(newTask.value);
    newTask.value = '';
    activeDeactiveButton();
}

function localStorageArray(){
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function localStorageAdd(newTask){
    let tasks = localStorageArray();

    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function localStorageRead(){
    
    let tasks = localStorageArray();

    tasks.forEach(task => {
        taskItemCreate(task);
    });
    activeDeactiveButton();
}

function localStorageDelete(task){
    let tasks = localStorageArray();    

    const deleteItemIndex = tasks.indexOf(task);
    tasks.splice(deleteItemIndex,1);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    activeDeactiveButton();
}

function taskItemCreate(task){
    //div
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('tasks-item');

    //checkbox
    const taskCheckBox = document.createElement('input');
    taskCheckBox.setAttribute('type', 'checkbox');
    taskCheckBox.classList.add('select');
    taskDiv.appendChild(taskCheckBox);

    //li
    const taskLi = document.createElement('li');
    taskLi.classList.add('task-item');
    taskLi.textContent = task;
    taskDiv.appendChild(taskLi);

    //button done
    const btnTaskDone = document.createElement('button');
    btnTaskDone.classList.add('btn-task-done');
    btnTaskDone.classList.add('btn-task');
    btnTaskDone.innerHTML = '<i class="fa-solid fa-check"></i>';
    taskDiv.appendChild(btnTaskDone);

    //button delete
    const btnTaskDelete = document.createElement('button');
    btnTaskDelete.classList.add('btn-task-delete');
    btnTaskDelete.classList.add('btn-task');
    btnTaskDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
    taskDiv.appendChild(btnTaskDelete);


    //div -> ul
    tasksList.appendChild(taskDiv);
}