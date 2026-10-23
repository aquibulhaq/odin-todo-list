import './style.css';

import { Todo } from './models/todo.js';
import { Project } from './models/project.js';
import { NonPersistentModel } from './models/non-persistent-model.js';
import { LocalStorageModel } from './models/local-storage-model.js';

import { AppView } from './views/app-view.js';
import { AppController } from './controllers/app-controller.js';

const appModel = new LocalStorageModel();
const appView = new AppView();
const appController = new AppController(appModel, appView);

console.log('Odin Todo List');
