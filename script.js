document.addEventListener('DOMContentLoaded', () => {

    /*Para criar nova tarefa*/
    const createNewTaskButton = document.getElementById('create-new-task-button');
    const closeNewTaskButton = document.getElementById('close-new-task-button');
    const newTaskModal = document.getElementById('new-task-modal');
    const newTaskForm = document.getElementById('new-task-form');
    
    /*Para editar as colunas*/
    const openEditModal = document.getElementById('tasks-board');
    const todoTasksContainer = document.getElementById('todo-tasks');
    const doingTasksContainer = document.getElementById('doing-tasks');
    const doneTasksContainer = document.getElementById('done-tasks');

    /*Para editar tarefas*/
    const editTaskModal = document.getElementById('edit-task-modal')
    const editTaskForm = document.getElementById('edit-task-form');
    const closeEditButton = document.getElementById('edit-close-modal-button');
    
    /*Para editar os modals de "opções de edição" e "editar título e descrição" */
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskDescriptionInput = document.getElementById('edit-task-description');
    const titleHeader = document.getElementById('edit-task-title-header')

    /*Funções para manipular o localStorage*/
    const getTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];
    const setTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

    let currentTaskId = null;

    /*Função para criar um card de tarefa*/
    function createTaskCard(task) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('edit-task-id', task.id);

    const header = document.createElement('div');
    header.classList.add('task-header');

    const title = document.createElement('h4');
    title.textContent = task.title;
    header.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('task-description');
    description.textContent = task.description;

    const footer = document.createElement('div');
    footer.classList.add('task-footer');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-button-card');
    editBtn.textContent = 'Editar';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-button-card');
    deleteBtn.textContent = 'Apagar';

    if (task.status === 'todo'){
        const doingBtn = document.createElement('button');
        doingBtn.classList.add('doing-button-card');
        doingBtn.textContent = 'Fazendo';   
        footer.append(editBtn, doingBtn, deleteBtn);
    }

    if(task.status === 'doing'){
    const doneBtn = document.createElement('button');
    doneBtn.classList.add('done-button-card');
    doneBtn.textContent = 'Concluído';
    footer.append(editBtn, doneBtn, deleteBtn);
    }

    if(task.status === 'done'){
        footer.append(deleteBtn);
    }

    card.append(header, description, footer);
    return card;
    }

    /*Função para renderizar as tarefas nas colunas*/
    function renderTasks() {
        const tasks = getTasks();

        todoTasksContainer.replaceChildren();
        doingTasksContainer.replaceChildren();
        doneTasksContainer.replaceChildren();

        let todoCount = 0, doingCount = 0, doneCount = 0;

        for (const task of tasks) {
            const card = createTaskCard(task);

            switch (task.status) {
                case 'todo':
                    todoTasksContainer.appendChild(card);
                    todoCount++;
                    break;
                case 'doing':
                    doingTasksContainer.appendChild(card);
                    doingCount++;
                    break;
                case 'done':
                    doneTasksContainer.appendChild(card);
                    doneCount++;
                    break;
            }
        }
        
        document.getElementById('todo-count').textContent = todoCount;
        document.getElementById('doing-count').textContent = doingCount;
        document.getElementById('done-count').textContent = doneCount;

        document.getElementById('status-doing-count').textContent = doingCount;
        document.getElementById('status-done-count').textContent = doneCount;
        document.getElementById('total-count').textContent = tasks.length;
        document.getElementById('progress-count').textContent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) + '%': 0 + '%';
    }

    /*Funções para abrir e fechar modais*/
    function openModal(modalElement) {modalElement.classList.remove('hidden'); }
    function closeModal(modalElement) { modalElement.classList.add('hidden'); }

    createNewTaskButton.addEventListener('click', () => openModal(newTaskModal));
    closeNewTaskButton.addEventListener('click', () => closeModal(newTaskModal));
    closeEditButton.addEventListener('click', () => closeModal(editTaskModal));
    
    /*Abrir formulário de edição de tarefas*/
    openEditModal.addEventListener('click', (event) => {

        const isDeleteButton = event.target.classList.contains('delete-button-card');
        if (isDeleteButton) {
            event.preventDefault();
            const taskCard = event.target.closest('.task-card');
            if (!taskCard) return;
            currentTaskId = parseInt(taskCard.getAttribute('edit-task-id'), 10);

            if(confirm('Tem certeza que deseja apagar esta tarefa?')) {
                let tasks = getTasks();
                tasks = tasks.filter(t => t.id !== currentTaskId);
                setTasks(tasks);
                renderTasks();
                return;
            }

            else return;
        }

        const isDoingButton = event.target.classList.contains('doing-button-card');
        if (isDoingButton) {
            event.preventDefault();
            const taskCard = event.target.closest('.task-card');
            if (!taskCard) return;
            currentTaskId = parseInt(taskCard.getAttribute('edit-task-id'), 10);

            const tasks = getTasks();
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);

            if (taskIndex !== -1) {
            tasks[taskIndex].status = 'doing';
            setTasks(tasks);
            renderTasks();
            return;
        }   
        }

        const isDoneButton = event.target.classList.contains('done-button-card');
        if (isDoneButton) {
            event.preventDefault();
            const taskCard = event.target.closest('.task-card');
            if (!taskCard) return;
            currentTaskId = parseInt(taskCard.getAttribute('edit-task-id'), 10);

            const tasks = getTasks();
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);

            if (taskIndex !== -1) {
            tasks[taskIndex].status = 'done';
            setTasks(tasks);
            renderTasks();
            return;
        }   
        }

        const isEditButton = event.target.classList.contains('edit-button-card');
        if (isEditButton){
            const taskCard = event.target.closest('.task-card');
            if (!taskCard) return;
            currentTaskId = parseInt(taskCard.getAttribute('edit-task-id'), 10);
            
            const tasks = getTasks();
            const task = tasks.find(t => t.id === currentTaskId);

            if (task){
                editTaskTitleInput.value = task.title;
                editTaskDescriptionInput.value = task.description;
                titleHeader.textContent = 'Editar Tarefa';
            }
            openModal(editTaskForm);
            openModal(editTaskModal);
            }
        });

    /*Salvar nova tarefa*/
    newTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskTitle = document.getElementById('new-task-title').value;
        const taskDescription = document.getElementById('new-task-description').value;
        const taskStatus = document.getElementById('new-task-status').value;

        const tasks =  getTasks();

        let highestId = 0
        for (const task of tasks) {
            if (task.id > highestId) {
                highestId = task.id
            }
        }

        const newTask = {id: highestId + 1,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus
        };

        tasks.push(newTask);
        setTasks(tasks);

        renderTasks();
        newTaskForm.reset();       
        closeModal(newTaskModal);
        });

    /*Salvar edição de tarefas*/
    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedTitle = document.getElementById('edit-task-title').value;
        const updatedDescription = document.getElementById('edit-task-description').value;

        const tasks = getTasks();
        const taskIndex = tasks.findIndex(t => t.id === currentTaskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].title = updatedTitle;
            tasks[taskIndex].description = updatedDescription;

            setTasks(tasks);
            closeModal(editTaskModal);
            renderTasks();
        }
    });

    renderTasks();
});
