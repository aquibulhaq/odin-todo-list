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
    if (project === undefined) {
      return;
    }

    todo.projectId = projectId;
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
