import {
  format,
  isValid,
  parseISO,
} from 'date-fns';
import {
  mdiCalendar,
  mdiFileEditOutline,
  mdiStar,
  mdiStarOutline,
  mdiTrashCanOutline,
} from '@mdi/js';

import { Project } from '../models/project';
import { Todo } from '../models/todo';

export class AppView {
  #projectList = document.querySelector('.project-list');
  #todoList = document.querySelector('.todo-list');

  #addProjectBtn = document.querySelector('.sidebar .add-button');
  #addProjectDialog = document.getElementById('add-project-dialog');
  #addProjectForm = document.getElementById('add-project-form');

  #editProjectBtns = document.querySelectorAll('.sidebar .edit-button');
  #editProjectDialog = document.getElementById('edit-project-dialog');
  #editProjectForm = document.getElementById('edit-project-form');

  #deleteProjectBtns = document.querySelectorAll('.sidebar .delete-button');
  #deleteProjectDialog = document.getElementById('delete-project-dialog');
  #deleteProjectForm = document.getElementById('delete-project-form');
  #deleteProjectId = document.getElementById('delete-project-id');
  #deleteProjectTitle = document.getElementById('delete-project-title');

  #addTodoBtn = document.querySelector('.content .add-button');
  #addTodoDialog = document.getElementById('add-todo-dialog');
  #addTodoForm = document.getElementById('add-todo-form');

  #editTodoBtns = document.querySelectorAll('.content .edit-button');
  #editTodoDialog = document.getElementById('edit-todo-dialog');
  #editTodoForm = document.getElementById('edit-todo-form');

  #deleteTodoBtns = document.querySelectorAll('.content .delete-button');
  #deleteTodoDialog = document.getElementById('delete-todo-dialog');
  #deleteTodoForm = document.getElementById('delete-todo-form');
  #deleteTodoId = document.getElementById('delete-todo-id');
  #deleteTodoTitle = document.getElementById('delete-todo-title');

  constructor(controller) {
    this.controller = controller;
    this.#setEventListeners();
  }

  #setEventListeners() {
    this.#addProjectBtn.addEventListener('click', this.#showAddProjectDialog);
    this.#addProjectDialog.addEventListener('close', this.#onAddProjectDialogClose);

    this.#editProjectBtns.forEach((button) => {
      button.addEventListener('click', this.#onEditProjectButtonClick);
    });
    this.#editProjectDialog.addEventListener('close', this.#onEditProjectDialogClose);

    this.#deleteProjectBtns.forEach((button) => {
      button.addEventListener('click', this.#onDeleteProjectButtonClick);
    });
    this.#deleteProjectDialog.addEventListener('close', this.#onDeleteProjectDialogClose);


    this.#addTodoBtn.addEventListener('click', this.#showAddTodoDialog);
    this.#addTodoDialog.addEventListener('close', this.#onAddTodoDialogClose);

    this.#editTodoBtns.forEach((button) => {
      button.addEventListener('click', this.#onEditTodoButtonClick);
    });
    this.#editTodoDialog.addEventListener('close', this.#onEditTodoDialogClose);

    this.#deleteTodoBtns.forEach(button => {
      button.addEventListener('click', this.#onDeleteTodoButtonClick);
    });
    this.#deleteTodoDialog.addEventListener('close', this.#onDeleteTodoDialogClose);
  }

  showProjectList(projects) {
    this.#projectList.textContent = '';

    for (const project of projects) {
      const projectListItem = document.createElement('li');
      projectListItem.classList.add('project-list-item');

      const projectButton = document.createElement('div');
      projectButton.classList.add('project-button');
      projectButton.dataset.id = project.id;
      projectButton.addEventListener('click', this.#onProjectButtonClick);

      const projectTitle = document.createElement('div');
      projectTitle.classList.add('project-title');
      projectTitle.textContent = project.title;
      projectButton.appendChild(projectTitle);

      const projectActions = document.createElement('div');
      projectActions.classList.add('actions');
      projectActions.classList.add('project-actions');
      projectActions.appendChild(AppView.#createEditButton(project.id, this.#onEditProjectButtonClick));
      projectActions.appendChild(AppView.#createDeleteButton(project.id, this.#onDeleteProjectButtonClick));
      projectButton.appendChild(projectActions);

      projectListItem.appendChild(projectButton);
      this.#projectList.appendChild(projectListItem);
    }
  }

  setSelectedProject(projectId) {
    document.querySelectorAll('.project-button').forEach((element) => {
      element.classList.toggle('selected', element.dataset.id === projectId);
    });
  }

  showTodoList(todos) {
    this.#todoList.textContent = '';

    for (const todo of todos) {
      const todoDiv = document.createElement('div');
      todoDiv.classList.add('todo');

      const todoLabel = document.createElement('label');
      todoLabel.classList.add('todo-label');

      const todoCompleted = document.createElement('input');
      todoCompleted.type = 'checkbox';
      todoCompleted.classList.add('todo-completed');
      todoCompleted.name = 'completed';
      todoCompleted.checked = todo.completed;
      todoCompleted.dataset.id = todo.id;
      todoCompleted.addEventListener('change', this.#onTodoCompletedChange);
      todoLabel.appendChild(todoCompleted);

      const todoTitle = document.createElement('h3');
      todoTitle.classList.add('todo-title');
      todoTitle.textContent = todo.title;
      todoLabel.appendChild(todoTitle);
      todoDiv.appendChild(todoLabel);

      const todoStatistics = document.createElement('div');
      todoStatistics.classList.add('todo-statistics');

      const todoRating = document.createElement('div');
      todoRating.classList.add('todo-rating');

      for (let i = 0; i < todo.priority; ++i) {
        todoRating.appendChild(AppView.#createSvg(mdiStar));
      }
      for (let i = todo.priority; i < 5; ++i) {
        todoRating.appendChild(AppView.#createSvg(mdiStarOutline));
      }

      todoStatistics.appendChild(todoRating);

      const todoDueDateContainer = document.createElement('div');
      todoDueDateContainer.classList.add('todo-due-date-container');
      todoDueDateContainer.appendChild(AppView.#createSvg(mdiCalendar));

      const todoDueDate = document.createElement('p');
      todoDueDate.classList.add('todo-due-date');
      todoDueDate.textContent = format(todo.dueDate, 'h:mm aaa, MMMM d, yyyy');
      todoDueDateContainer.appendChild(todoDueDate);

      todoStatistics.appendChild(todoDueDateContainer);
      todoDiv.appendChild(todoStatistics);

      const todoDescription = document.createElement('p');
      todoDescription.classList.add('todo-description');
      todoDescription.textContent = todo.description;
      todoDiv.appendChild(todoDescription);

      const todoActions = document.createElement('div');
      todoActions.classList.add('actions');
      todoActions.classList.add('todo-actions');

      todoActions.appendChild(AppView.#createEditButton(todo.id, this.#onEditTodoButtonClick));
      todoActions.appendChild(AppView.#createDeleteButton(todo.id, this.#onDeleteTodoButtonClick));
      todoDiv.appendChild(todoActions);

      this.#todoList.appendChild(todoDiv);
    }
  }

  static #createEditButton(id, onClick) {
    const editButton = document.createElement('button');
    editButton.classList.add('round-button');
    editButton.classList.add('edit-button');
    editButton.title = 'Edit';
    editButton.appendChild(AppView.#createSvg(mdiFileEditOutline));
    editButton.dataset.id = id;
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
    this.#addProjectDialog.returnValue = '';
    this.#addProjectDialog.showModal();
  }

  #onAddProjectDialogClose = () => {
    if (this.#addProjectDialog.returnValue === 'submit') {
      const project = new Project(AppView.#getFormValues(this.#addProjectForm));
      this.controller.addProject(project);
    }

    this.#addProjectForm.reset();
  }

  #onEditProjectButtonClick = (event) => {
    this.controller.onEditProjectButtonClick(event.currentTarget.dataset.id);
  }

  showEditProjectDialog = (project) => {
    this.#editProjectDialog.returnValue = '';
    AppView.#setFormValues(this.#editProjectForm, project);
    this.#editProjectDialog.showModal();
  }

  #onEditProjectDialogClose = () => {
    if (this.#editProjectDialog.returnValue === 'submit') {
      const project = new Project(AppView.#getFormValues(this.#editProjectForm));
      this.controller.editProject(project);
    }

    this.#editProjectForm.reset();
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

  #onProjectButtonClick = (event) => {
    this.controller.onProjectButtonClick(event.currentTarget.dataset.id);
  }

  #showAddTodoDialog = () => {
    this.#addTodoDialog.returnValue = '';
    this.#addTodoDialog.showModal();
  }

  #onAddTodoDialogClose = () => {
    if (this.#addTodoDialog.returnValue === 'submit') {
      const todo = new Todo(AppView.#getFormValues(this.#addTodoForm));
      this.controller.addTodo(todo);
    }

    this.#addTodoForm.reset();
  }

  #onEditTodoButtonClick = (event) => {
    this.controller.onEditTodoButtonClick(event.currentTarget.dataset.id);
  }

  showEditTodoDialog = (todo) => {
    this.#editTodoDialog.returnValue = '';
    AppView.#setFormValues(this.#editTodoForm, todo);
    this.#editTodoDialog.showModal();
  }

  #onEditTodoDialogClose = () => {
    if (this.#editTodoDialog.returnValue === 'submit') {
      const todo = new Todo(AppView.#getFormValues(this.#editTodoForm));
      this.controller.editTodo(todo);
    }

    this.#editTodoForm.reset();
  }

  #onTodoCompletedChange = (event) => {
    const el = event.currentTarget;
    this.controller.onTodoCompletedChange(el.dataset.id, el.checked);
  }

  #onDeleteTodoButtonClick = (event) => {
    this.controller.onDeleteTodoButtonClick(event.currentTarget.dataset.id);
  }

  showDeleteTodoDialog = (todo) => {
    this.#deleteTodoDialog.returnValue = '';
    this.#deleteTodoId.value = todo.id;
    this.#deleteTodoTitle.textContent = todo.title;
    this.#deleteTodoDialog.showModal();
  }

  #onDeleteTodoDialogClose = () => {
    if (this.#deleteTodoDialog.returnValue === 'submit') {
      this.controller.deleteTodo(this.#deleteTodoId.value);
    }

    this.#deleteTodoForm.reset();
    this.#deleteTodoTitle.textContent = '';
  }

  static #getFormValues(form) {
    const values = {};

    for (const el of form.elements) {
      if (!el.name || el.disabled) {
        continue;
      }

      switch (el.type) {
        case 'submit':
        case 'button':
        case 'reset':
          break;

        case 'checkbox':
          values[el.name] = el.checked;
          break;

        case 'number':
          if (el.value !== '') {
            values[el.name] = el.valueAsNumber;
          }
          break;

        case 'datetime-local':
          if (el.value !== '') {
            values[el.name] = parseISO(el.value);
          }
          break;

        default: {
          const trimmed = el.value.trim();
          if (trimmed !== '') {
            values[el.name] = trimmed;
          }
          break;
        }
      }
    }

    return values;
  }

  static #setFormValues(form, values) {
    for (const el of form.elements) {
      if (!el.name || !(el.name in values)) {
        continue;
      }

      const value = values[el.name];

      switch (el.type) {
        case 'submit':
        case 'button':
        case 'reset':
          break;

        case 'checkbox':
          el.checked = Boolean(value);
          break;

        case 'datetime-local':
          el.value = value && isValid(value) ? format(value, "yyyy-MM-dd'T'HH:mm") : '';
          break;

        default:
          el.value = value ?? '';
          break;
      }
    }
  }
}
