import "dotenv/config";
import {
  getTodoistData,
  translateTodoistColorIdToHex,
  translateTodoistPrioritiesToReminderPrio,
} from "./helper/todoist.js";
import {
  createNewReminder,
  createRemindersList,
  displayBearerTokenInsert,
  displayMessage,
  selectedRemindersAccount,
} from "./helper/apple-jxa.js";

const remindersAccountName = selectedRemindersAccount();
// const api_token = displayBearerTokenInsert();

// createNewReminder({ name: "Reminder from node" }, remindersAccountName);

// createRemindersList(
//   { name: "List from node", color: "#FFFFFF" },
//   remindersAccountName,
// );

async function createRemindersListForProjects() {
  return await getTodoistData({
    typeOrURL: "projects",
    api_token: "9ac0ec432afab4129a43cda8a5929bb0f7f7e66c",
  })
    .then((res) => {
      res.forEach((project, index) => {
        createRemindersList(
          {
            name: project.name,
            color: translateTodoistColorIdToHex(project.color),
          },
          remindersAccountName,
        );
      });

      return res;
    })
    .catch((error) => console.error(error.message));
}
async function createReminderForEachList(projects) {
  return await projects.forEach((project, index) => {
    if (index == 0) {
      getTodoistData({
        typeOrURL: "tasksfromproject",
        api_token: "9ac0ec432afab4129a43cda8a5929bb0f7f7e66c",
        projectID: project.id,
      })
        .then((res) => {
          res.forEach((task, index) => {
            if (index === 0) {
              console.log(task);
              let taskDatetime =
                typeof task.due !== "undefined"
                  ? new Date(task.due.datetime)
                  : null;
              console.log(project.name);
              createNewReminder(
                {
                  name: task.content,
                  body: task.description,
                  completed: task.completed,
                  dueDate: taskDatetime,
                  priority: task.priority,
                },
                remindersAccountName,
                project.name,
              );
            }
          });
        })
        .catch((error) => console.error(error.message));
    }
  });
}

createRemindersListForProjects();
// .then((res) => createReminderForEachList(res));
