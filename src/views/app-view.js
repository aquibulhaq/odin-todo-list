export class AppView {
  #projectList = document.querySelector('.project-list');

  #addProjectBtn = document.querySelector('.sidebar .add-button');
  #addProjectDialog = document.getElementById('add-project-dialog');

  #editProjectBtns = document.querySelectorAll('.sidebar .edit-button');
  #editProjectDialog = document.getElementById('edit-project-dialog');

  #deleteProjectBtns = document.querySelectorAll('.sidebar .delete-button');
  #deleteProjectDialog = document.getElementById('delete-project-dialog');

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
      button.addEventListener('click', this.#showDeleteProjectDialog);
    });

    this.#addTodoBtn.addEventListener('click', this.#showAddTodoDialog);
    this.#editTodoBtns.forEach((button) => {
      button.addEventListener('click', this.#showEditTodoDialog);
    });
    this.#deleteTodoBtns.forEach(button => {
      button.addEventListener('click', this.#showDeleteTodoDialog);
    });
  }

  #showAddProjectDialog = () => {
    this.#addProjectDialog.showModal();
  }

  #showEditProjectDialog = () => {
    this.#editProjectDialog.showModal();
  }

  #showDeleteProjectDialog = () => {
    this.#deleteProjectDialog.showModal();
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
