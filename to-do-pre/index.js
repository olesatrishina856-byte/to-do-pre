let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

// ===== Функции =====

// Загружает задачи из localStorage или возвращает исходный массив
function loadTasks() {
	const savedTasks = localStorage.getItem('tasks');
	if (savedTasks) {
		return JSON.parse(savedTasks);
	}
	return items; // исходный массив, если в хранилище ничего нет
}

// Создаёт DOM-элемент задачи из шаблона, устанавливает текст и обработчики
function createItem(taskText) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	// Устанавливаем текст задачи
	textElement.textContent = taskText;

	// --- Удаление ---
	deleteButton.addEventListener('click', function () {
		clone.remove(); // удаляем сам элемент задачи
		items = getTasksFromDOM();
		saveTasks(items);
	});

	// --- Копирование ---
	duplicateButton.addEventListener('click', function () {
		const currentText = textElement.textContent;
		const newItem = createItem(currentText);
		listElement.prepend(newItem);
		items = getTasksFromDOM();
		saveTasks(items);
	});

	// --- Редактирование (дополнительное задание) ---
	editButton.addEventListener('click', function () {
		textElement.setAttribute('contenteditable', 'true');
		textElement.focus();
	});

	textElement.addEventListener('blur', function () {
		textElement.setAttribute('contenteditable', 'false');
		items = getTasksFromDOM();
		saveTasks(items);
	});

	return clone;
}

// Собирает текст всех задач из DOM в массив
function getTasksFromDOM() {
	const taskElements = listElement.querySelectorAll('.to-do__item-text');
	const tasks = [];
	taskElements.forEach(el => tasks.push(el.textContent));
	return tasks;
}

// Сохраняет массив задач в localStorage
function saveTasks(tasks) {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== Инициализация страницы =====
items = loadTasks(); // теперь items содержит актуальные данные (из хранилища или исходные)
items.forEach(task => {
	const taskElement = createItem(task);
	listElement.append(taskElement);
});

// ===== Обработчик формы (добавление новой задачи) =====
formElement.addEventListener('submit', function (evt) {
	evt.preventDefault(); // не перезагружать страницу

	const taskText = inputElement.value.trim();
	if (taskText === '') return; // игнорируем пустые задачи

	// Создаём и добавляем задачу в начало списка
	const newTask = createItem(taskText);
	listElement.prepend(newTask);

	// Очищаем поле ввода
	inputElement.value = '';

	// Обновляем items и сохраняем в localStorage
	items = getTasksFromDOM();
	saveTasks(items);
});