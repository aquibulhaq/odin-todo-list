import {
  mdiFileEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';

export class AppView {
  #projectList = document.querySelector('.project-list');

  #addProjectBtn = document.querySelector('.sidebar .add-button');
  #addProjectDialog = document.getElementById('add-project-dialog');

  #editProjectBtns = document.querySelectorAll('.sidebar .edit-button');
  #editProjectDialog = document.getElementById('edit-project-dialog');

  #deleteProjectBtns = document.querySelectorAll('.sidebar .delete-button');
  #deleteProjectDialog = document.getElementById('delete-project-dialog');
  #deleteProjectForm = document.getElementById('delete-project-form');
  #deleteProjectId = document.getElementById('delete-project-id');
  #deleteProjectTitle = document.getElementById('delete-project-title');

  #addTodoBtn = document.querySelector('.content .add-button');
  #addTodoDialog = document.getElementById('add-todo-dialog');

  #editTodoBtns = document.querySelectorAll('.content .edit-button');
  #editTodoDialog = document.getElementById('edit-todo-dialog');

  #deleteTodoBtns = document.querySelectorAll('.content .delete-button');
  #deleteTodoDialog = document.getElementById('delete-todo-dialog');

  constructor(controller) {
    this.controller = controller;
    this.#setEventListeners();
  }

  #setEventListeners() {
    this.#addProjectBtn.addEventListener('click', this.#showAddProjectDialog);
    this.#editProjectBtns.forEach((button) => {
      button.addEventListener('click', this.#showEditProjectDialog);
    });
    this.#deleteProjectBtns.forEach((button) => {
      button.addEventListener('click', this.#onDeleteProjectButtonClick);
    });
    this.#deleteProjectDialog.addEventListener('close', this.#onDeleteProjectDialogClose);

    this.#addTodoBtn.addEventListener('click', this.#showAddTodoDialog);
    this.#editTodoBtns.forEach((button) => {
      button.addEventListener('click', this.#showEditTodoDialog);
    });
    this.#deleteTodoBtns.forEach(button => {
      button.addEventListener('click', this.#showDeleteTodoDialog);
    });
  }

  showProjectList(projects) {
    this.#projectList.textContent = '';

    for (const project of projects) {
      const projectListItem = document.createElement('li');
      projectListItem.classList.add('project-list-item');

      const projectButton = document.createElement('div');
      projectButton.classList.add('project-button');

      const projectTitle = document.createElement('div');
      projectTitle.classList.add('project-title');
      projectTitle.textContent = project.title;
      projectButton.appendChild(projectTitle);

      const projectActions = document.createElement('div');
      projectActions.classList.add('actions');
      projectActions.classList.add('project-actions');
      projectActions.appendChild(AppView.#createEditButton(this.#showEditProjectDialog));
      projectActions.appendChild(AppView.#createDeleteButton(project.id, this.#onDeleteProjectButtonClick));
      projectButton.appendChild(projectActions);

      projectListItem.appendChild(projectButton);
      this.#projectList.appendChild(projectListItem);
    }
  }

  static #createEditButton(onClick) {
    const editButton = document.createElement('button');
    editButton.classList.add('round-button');
    editButton.classList.add('edit-button');
    editButton.title = 'Edit';
    editButton.appendChild(AppView.#createSvg(mdiFileEditOutline));
    editButton.addEventListener('click', onClick);
    return editButton;
  }

  static #createDeleteButton(id, onClick) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('round-button');
    deleteButton.classList.add('delete-button');
    deleteButton.title = 'Delete';
    deleteButton.appendChild(AppView.#createSvg(mdiTrashCanOutline));
    deleteButton.dataset.id = id;
    deleteButton.addEventListener('click', onClick);
    return deleteButton;
  }

  static #createSvg(path) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElem.setAttribute('d', path);
    pathElem.setAttribute('fill', 'currentColor');
    svg.appendChild(pathElem);

    return svg;
  }

  #showAddProjectDialog = () => {
    this.#addProjectDialog.showModal();
  }

  #showEditProjectDialog = () => {
    this.#editProjectDialog.showModal();
  }

  #onDeleteProjectButtonClick = (event) => {
    this.controller.onDeleteProjectButtonClick(event.currentTarget.dataset.id);
  }

  showDeleteProjectDialog = (project) => {
    this.#deleteProjectDialog.returnValue = '';
    this.#deleteProjectId.value = project.id;
    this.#deleteProjectTitle.textContent = project.title;
    this.#deleteProjectDialog.showModal();
  }

  #onDeleteProjectDialogClose = () => {
    if (this.#deleteProjectDialog.returnValue === 'submit') {
      this.controller.deleteProject(this.#deleteProjectId.value);
    }

    this.#deleteProjectForm.reset();
    this.#deleteProjectTitle.textContent = '';
  }

  #showAddTodoDialog = () => {
    this.#addTodoDialog.showModal();
  }

  #showEditTodoDialog = () => {
    this.#editTodoDialog.showModal();
  }

  #showDeleteTodoDialog = () => {
    this.#deleteTodoDialog.showModal();
  }
}
