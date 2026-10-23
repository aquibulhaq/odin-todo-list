import { Project } from "../models/project.js";

export class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.controller = this;

    if (this.model.size === 0) {
      this.model.putProject(new Project({ title: 'Default' }));
    }

    this.view.showProjectList(this.model.getAllProjects());
  }

  addProject(project) {
    this.model.putProject(project);
    this.view.showProjectList(this.model.getAllProjects());
  }

  onDeleteProjectButtonClick(projectId) {
    this.view.showDeleteProjectDialog(this.model.getProjectById(projectId));
  }

  deleteProject(projectId) {
    this.model.deleteProject(projectId);
    this.view.showProjectList(this.model.getAllProjects());
  }
}
