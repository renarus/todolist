const TODOS = "TODOS";
class Todo {
  
  constructor(id, title = "") {
    this.id = id;
    this.title = title.trim();
  }
}

class TodoService {
  _todos;

  constructor(todos = []) {
    this._init();
    if (!this._todos?.length) {
      this._todos = todos;
      this._commit();
    }
  }

  getTodos() {
    return [...this._todos];
  }

  addTodo(title = "") {
    if (!this._todos.some((t) => !t.title)) {
      this._todos = [...this._todos, new Todo(this._generateId(), title)];
      this._commit();
    } else {
      throw new Error("There is empty element in todo list");
    }
  }
  editTodo(id, title) {
    if (!title) throw new Error("You can not empty title.");
    const todos = [...this._todos];
    todos[this._getIndex(id)].title = title.trim();
    this._todos = todos;
    this._commit();
  }
  deleteTodo(id) {
    this._todos = this._todos.filter((t) => t.id !== id);
    this._commit();
  }
  sortTodos(direction = true) {
    const todos = [...this._todos]
      .filter((t) => t.title)
      .sort((t1, t2) =>
        t1.title.toUpperCase() > t2.title.toUpperCase() ? 1 : -1
      );
    let buttonChange = document.querySelector("#sort-btn");
    buttonChange.setAttribute("src", "./img/2sort.jpg");
    if (!direction) {
      todos.reverse();
      buttonChange.setAttribute("src", "./img/1sort.jpg");
    }
    this._todos = todos;
    this._commit();
  }
  _init() {
    this._todos = JSON.parse(localStorage.getItem(TODOS) || "[]");
  }

  _commit() {
    localStorage.setItem(TODOS, JSON.stringify(this._todos));
  }
  _generateId() {
    return this._todos?.length
      ? [...this._todos].sort((t1, t2) => t2.id - t1.id)[0].id + 1
      : 1;
  }

  _getIndex(id) {
    const index = this._todos.findIndex((t) => t.id === id);

    if (index !== -1) {
      return index;
    }

    throw new Error(`There are no such todo with ${id} id.`);
  }
}

class DOMManipulator {
  _service;

  constructor(service) {
    this._service = service;
    this._init();
  }

  _init() {
    this._todoList = this._getElement("#todo-list");
    this._addBtn = this._getElement("#add-btn");
    this._addBtn.addEventListener("click", (_) => this._handleAdd());
    this._sortBtn = this._getElement("#sort-btn");
    this._sortBtn.addEventListener("click", (_) => this._handleSort());
    this._sortDir = true;

    this.displayTodos();
  }

  displayTodos() {
    const todos = this._service.getTodos();
    const items = todos.map((t) => {
      const item = document.createElement("li");
      item.className = "listsLi";
      const todoInput = document.createElement("input");
      todoInput.className = "listİnputİtem";
      todoInput.value = t.title;
      todoInput.placeholder = "Enter title";
      todoInput.addEventListener("change", (e) =>
        this._handleEdit(t.id, e.target.value)
      );
      item.append(todoInput);

      const delBtn = document.createElement("img");
      delBtn.className = "listXIcon";
      delBtn.setAttribute("src", "./img/xx.jpg");
      delBtn.addEventListener("click", (_) => this._handleDelete(t.id));
      item.append(delBtn);
      return item;
    });

    this._todoList.innerHTML = "";
    this._todoList.append(...items);
  }

  _handleEdit(id, title) {
    try {
      this._service.editTodo(id, title);
      this.displayTodos();
    } catch (error) {
      this._showError(error.message);
    }
  }

  _handleAdd() {
    try {
      this._service.addTodo();
      this._sortDir = true;
      this.displayTodos();
    } catch (error) {
      this._showError(error.message);
    }
  }

  _handleDelete(id) {
    this._service.deleteTodo(id);
    this.displayTodos();
  }

  _handleSort() {
    this._service.sortTodos(this._sortDir);
    this._sortDir = !this._sortDir;
    this.displayTodos();
  }

  _showError(message) {
    alert(message);
    this.displayTodos();
  }
  _getElement(selector) {
    const element = document.querySelector(selector);

    if (element) {
      return element;
    }
    throw new Error(`There are no such element : ${selector}.`);
  }
}

const manipulator = new DOMManipulator(new TodoService([{ id: 1, title: "" }]));
