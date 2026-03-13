const tasks = [];

function generateId(){
	return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

function createTask(title, priority, status){
	return { id: generateId(), title, priority, status, completed: false };
}

function addTask(task){
	tasks.push(task);
}

function removeTaskById(id){
	const idx = tasks.findIndex(t => t.id === id);
	if(idx !== -1) tasks.splice(idx, 1);
}

function toggleCompleteById(id){
	const t = tasks.find(x => x.id === id);
	if(!t) return;
	t.completed = !t.completed;
}

function taskListItem(task){
	const li = document.createElement('li');
	li.className = 'list-group-item d-flex justify-content-between align-items-center';
	li.dataset.id = task.id;

	const left = document.createElement('div');
	const titleSpan = document.createElement('span');
	titleSpan.className = 'task-title';
	titleSpan.textContent = task.title;

	const meta = document.createElement('small');
	meta.className = 'text-muted';
	meta.dataset.originalStatus = task.status || 'Pending';
	meta.textContent = ` [${task.priority}] - ${meta.dataset.originalStatus}`;

	left.appendChild(titleSpan);
	left.appendChild(document.createTextNode(' ')); 
	left.appendChild(meta);

	const controls = document.createElement('div');
	controls.className = 'task-controls';

	const completeBtn = document.createElement('button');
	completeBtn.type = 'button';
	completeBtn.className = 'btn btn-success btn-sm';
	completeBtn.textContent = task.completed ? 'Undo' : 'Done';
	completeBtn.addEventListener('click', () => {
		toggleCompleteById(task.id);
		const now = tasks.find(t => t.id === task.id);
		if(!now) return;
		if(now.completed){
			titleSpan.classList.add('completed');
			meta.textContent = ` [${task.priority}] - Completed`;
			completeBtn.textContent = 'Undo';
		} else {
			titleSpan.classList.remove('completed');
			meta.textContent = ` [${task.priority}] - ${meta.dataset.originalStatus}`;
			completeBtn.textContent = 'Done';
		}
	});

	const removeBtn = document.createElement('button');
	removeBtn.type = 'button';
	removeBtn.className = 'btn btn-danger btn-sm';
	removeBtn.textContent = 'Remove';
	removeBtn.addEventListener('click', () => {
		removeTaskById(task.id);
		li.remove();
	});

	controls.appendChild(completeBtn);
	controls.appendChild(removeBtn);

	if(task.completed){
		titleSpan.classList.add('completed');
		meta.textContent = ` [${task.priority}] - Completed`;
	}

	li.appendChild(left);
	li.appendChild(controls);
	return li;
}

function handleFormSubmit(e){
	e.preventDefault();
	const title = document.getElementById('taskTitle').value.trim();
	const priority = document.getElementById('taskPriority').value;
	const statusEl = document.querySelector('input[name="task-status"]:checked');
	const status = statusEl ? statusEl.value : 'Pending';
	if(!title) return alert('Enter a task to complete!');
	const task = createTask(title, priority, status);
	addTask(task);
	const li = taskListItem(task);
	document.getElementById('taskList').appendChild(li);
	e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('taskForm');
	if(form) form.addEventListener('submit', handleFormSubmit);
});