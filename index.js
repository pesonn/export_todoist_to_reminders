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
const api_token = displayBearerTokenInsert();

// createNewReminder({ name: "Reminder from node" }, remindersAccountName);

// createRemindersList(
//   { name: "List from node", color: "#FFFFFF" },
//   remindersAccountName,
// );

async function createRemindersListForProjects() {
  console.log("Beginne Projekte zu übertragen...");
  try {
    const res = await getTodoistData({
      typeOrURL: "projects",
      api_token: "9ac0ec432afab4129a43cda8a5929bb0f7f7e66c",
    });
    await Promise.all(
      res.map((project, index) => {
        return createRemindersList(
          {
            name: project.name,
            color: translateTodoistColorIdToHex(project.color),
          },
          remindersAccountName,
        );
      }),
    );

    console.log("Alle Projekte Übertragen");
    return res;
  } catch (error) {
    return console.error(error.message);
  }
}
function createReminderForEachList(projects) {
  console.log(projects);
  console.log("Beginne Tasks zu übertragen...");
  projects.forEach(async (project, index) => {
    try {
      const res = await getTodoistData({
        typeOrURL: "tasksfromproject",
        api_token: api_token,
        projectID: project.id,
      });
      res.forEach((task, index) => {
        let taskDatetime =
          typeof task.due !== "undefined" ? new Date(task.due.datetime) : null;

        return createNewReminder(
          {
            name: task.content,
            body: task.description,
            completed: task.completed,
            dueDate: taskDatetime,
            priority: translateTodoistPrioritiesToReminderPrio(task.priority),
          },
          remindersAccountName,
          project.name,
        );
      });
    } catch (error) {
      return console.log(error.message);
    }
  });

  return displayMessage("Alle Tasks wurden übertragen!");
}

createRemindersListForProjects()
  .then((res) => createReminderForEachList(res))
  .catch((error) => console.log(error));
