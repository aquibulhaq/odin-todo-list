export class Project {
  constructor({
    id = crypto.randomUUID(),
    title,
    todos = [],
  } = {}) {
    this.id = id;
    this.title = title;
    this.todos = todos;
  }

  getAll() {
    return this.todos;
  }

  getById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  put(newTodo) {
    newTodo.projectId = this.id;

    const i = this.todos.findIndex(todo => todo.id === newTodo.id);
    if (i >= 0) {
      this.todos[i] = newTodo;
    } else {
      this.todos.push(newTodo);
    }
  }

  delete(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
