import { Project } from "../models/project.js";

export class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.controller = this;

    if (this.model.size === 0) {
      this.model.putProject(new Project({ title: 'Default' }));
    }

    const projects = this.model.getAllProjects();
    this.selectedProjectId = projects[0].id;
    this.view.showProjectList(projects);
    this.view.setSelectedProject(this.selectedProjectId);
    this.view.showTodoList(projects[0].todos);
  }

  addProject(project) {
    this.model.putProject(project);
    this.view.showProjectList(this.model.getAllProjects());
  }

  onEditProjectButtonClick(projectId) {
    this.view.showEditProjectDialog(this.model.getProjectById(projectId));
  }

  editProject(projectId) {
    this.model.putProject(projectId);
    this.view.showProjectList(this.model.getAllProjects());
  }

  onDeleteProjectButtonClick(projectId) {
    this.view.showDeleteProjectDialog(this.model.getProjectById(projectId));
  }

  deleteProject(project) {
    this.model.deleteProject(project);
    this.view.showProjectList(this.model.getAllProjects());
  }

  onProjectButtonClick(projectId) {
    this.selectedProjectId = projectId;
    this.view.setSelectedProject(this.selectedProjectId);
    this.view.showTodoList(this.model.getAllTodos(this.selectedProjectId));
  }
}
