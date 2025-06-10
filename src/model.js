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

export class PersistentModel {
  constructor(storageKey = 'projects') {
    this.storageKey = storageKey;
    const projectsJson = localStorage.getItem(this.storageKey);
    if (projectsJson === null)
      this.saveAllProjects([]);
  }

  getAllProjects() {
    const projectsJson = localStorage.getItem(this.storageKey);

    const projects = JSON.parse(projectsJson, (key, value) => {
      switch (key) {
        case 'dueDate':
          return new Date(value);
        case 'todos':
          return value.map(todo => new Todo(todo));
        case '':
          return value.map(project => new Project(project));
        default:
          return value;
      }
    });

    return projects;
  }

  saveAllProjects(projects) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getProjectById(projectId) {
    return this.getAllProjects().find(project => project.id === projectId);
  }

  createProject(newProject) {
    const projects = this.getAllProjects();
    projects.push(newProject);
    this.saveAllProjects(projects);
  }

  deleteProject(projectId) {
    const projects = this.getAllProjects();
    projects = this.projects.filter(project => project.id !== projectId);
    this.saveAllProjects(projects);
  }

  putTodo(projectId, todo) {
    const projects = this.getAllProjects();

    const project = projects.find(project => project.id === projectId);
    if (project === undefined)
      return;

    todo.projectId = projectId;
    project.put(todo);

    this.saveAllProjects(projects);
  }

  deleteTodo(projectId, todoId) {
    const projects = this.getAllProjects();

    const project = projects.find(project => project.id === projectId);
    if (project === undefined)
      return;

    project.delete(todoId);

    this.saveAllProjects(projects);
  }
}
