import { Todo } from "./todo.js";
import { Project } from "./project.js";

export class LocalStorageModel {
  constructor(storageKey = 'projects') {
    this.storageKey = storageKey;
    const projectsJson = localStorage.getItem(this.storageKey);
    if (projectsJson === null) {
      this.saveAllProjects([]);
    }
  }

  get size() {
    const projectsJson = localStorage.getItem(this.storageKey);
    const projects = JSON.parse(projectsJson);
    return projects.length;
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

  putProject(newProject) {
    const projects = this.getAllProjects();

    const i = projects.findIndex((project) => project.id === newProject.id);
    if (i >= 0) {
      projects[i].title = newProject.title;
    } else {
      projects.push(newProject);
    }

    this.saveAllProjects(projects);
  }

  deleteProject(projectId) {
    const projects = this.getAllProjects().filter((project) => project.id !== projectId);
    this.saveAllProjects(projects);
  }

  getAllTodos(projectId) {
    return this.getProjectById(projectId)?.getAll();
  }

  getTodoById(projectId, todoId) {
    const project = this.getProjectById(projectId);
    if (project === undefined) {
      return;
    }

    return project.getById(todoId);
  }

  putTodo(projectId, todo) {
    const projects = this.getAllProjects();

    const project = projects.find(project => project.id === projectId);
    if (project === undefined) {
      return;
    }

    project.put(todo);

    this.saveAllProjects(projects);
  }

  deleteTodo(projectId, todoId) {
    const projects = this.getAllProjects();

    const project = projects.find(project => project.id === projectId);
    if (project === undefined) {
      return;
    }

    project.delete(todoId);

    this.saveAllProjects(projects);
  }
}
