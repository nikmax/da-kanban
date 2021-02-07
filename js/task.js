/**
 * Generates HTML string from db data
 * @param {object} task - Task data
 */

function getTaskHtmlString(task) {
    // Limit field length
    if (task.description.length > 200) {
        task.description = task.description.substring(0, 199) + '...'
    }
    if (task.title.length > 40) {
        task.title = task.title.substring(0, 39) + '...'
    }
    if (task.category.length > 40) {
        task.category = task.category.substring(0, 39) + '...'
    }
    if (task.user.length > 40) {
        task.user = task.user.substring(0, 39) + '...'
    }
    // Return HTML string
    return `
        <div class="mdl-card mdl-shadow--2dp mdl-cell--12-col task-item" id="${task.id}">
        <div class="mdl-card__title mdl-card--expand">
          <h2 class="mdl-card__title-text">${task.title}</h2>
        </div>
        <div class="mdl-card__title">
          <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Assignee">person</i>${task.user}</div>
        </div>
        <div class="mdl-card__title">
          <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Category">folder</i>${task.category}</div>
        </div>
        <div class="mdl-card__title">
        <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Due date">today</i>${task.duedate}</div>
        </div>
        <div class="mdl-card__supporting-text">${task.description}</div>
        <div class="mdl-card__actions mdl-card--border task-item-action-row">
        <span class="icon-text"><i class="material-icons" title="Urgency">class</i>${task.urgency}</span>
        <span>
            <a href="#" onclick="completeTask('${task.id}')")><i class="material-icons" title="Complete">done</i></a>
            <a href="#" onclick="showForm('${task.id}')"><i class="material-icons" title="Edit">edit</i></a>
            <a href="#" onclick="deleteTask('${task.id}')"><i class="material-icons" title="Delete">delete</i></a>
          </span>
        </div>
      </div>
      `;
}

/**
 * Generates a DOM node from HTML string
 * @param {object} html - The HTML string
 */

function htmlStringToNode(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}