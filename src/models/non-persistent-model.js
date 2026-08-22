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

  addProject(newProject) {
    this.projects.push(newProject);
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(project => project.id !== projectId);
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
    const project = this.getProjectById(projectId);
    if (project === undefined) {
      return;
    }

    project.put(todo);
  }

  deleteTodo(projectId, todoId) {
    const project = this.getProjectById(projectId);
    if (project === undefined) {
      return;
    }

    project.delete(todoId);
  }
}
