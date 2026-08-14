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
    if (project === undefined) {
      return;
    }

    todo.projectId = projectId;
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
