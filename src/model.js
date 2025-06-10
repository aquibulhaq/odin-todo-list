export class Todo {
  constructor({
    id = crypto.randomUUID(),
    title,
    description = '',
    dueDate = new Date(),
    priority = 1,
    completed = false,
    projectId,
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = Math.min(Math.max(priority, 1), 5);
    this.completed = Boolean(completed);
    this.projectId = projectId;
  }
}
