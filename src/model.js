export class Todo {
  constructor({
    id = crypto.randomUUID(),
    title,
    description = '',
    dueDate = new Date(),
    priority = 1,
    completed = false,
    projectId,
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = Math.min(Math.max(priority, 1), 5);
    this.completed = Boolean(completed);
    this.projectId = projectId;
  }
}

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
    const i = this.todos.findIndex(todo => todo.id === newTodo.id);
    if (i >= 0)
      this.todos[i] = newTodo;
    else
      this.todos.push(newTodo);
  }

  delete(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}

export class NonPersistentModel {
  constructor(projects = []) {
    this.projects = projects;
  }

  getAllProjects() {
    return this.projects;
  }

  getProjectById(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  createProject(newProject) {
    this.projects.push(newProject);
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(project => project.id !== projectId);
  }

  putTodo(projectId, todo) {
    const project = this.getProjectById(projectId);
    if (project === undefined)
      return;

    todo.projectId = projectId;
    project.put(todo);
  }

  deleteTodo(projectId, todoId) {
    const project = this.getProjectById(projectId);
    if (project === undefined)
      return;

    project.delete(todoId);
  }
}
