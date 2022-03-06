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

async function createRemindersListForProjects() {
  console.log("Start syncing projects...");
  try {
    const res = await getTodoistData({
      typeOrURL: "projects",
      api_token: api_token,
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

    console.log("Finished project sync.");
    return res;
  } catch (error) {
    return console.error(error.message);
  }
}

async function createReminderForEachList(projects) {
  console.log("Start syncing Tasks...");
  await Promise.all(
    projects.forEach(async (project, index) => {
      try {
        const res = await getTodoistData({
          typeOrURL: "tasksfromproject",
          api_token: api_token,
          projectID: project.id,
        });

        (await res.length) > 0 &&
          res.forEach((task, index) => {
            let taskDatetime =
              typeof task.due !== "undefined"
                ? new Date(task.due.datetime)
                : null;

            return createNewReminder(
              {
                name: task.content,
                body: task.description,
                completed: task.completed,
                dueDate: taskDatetime,
                priority: translateTodoistPrioritiesToReminderPrio(
                  task.priority,
                ),
              },
              remindersAccountName,
              project.name,
            );
          });
      } catch (error) {
        return console.log(error.message);
      }
    }),
  );

  return displayMessage("Alle Tasks wurden übertragen!");
}

createRemindersListForProjects()
  .then((res) => createReminderForEachList(res))
  .catch((error) => console.log(error));
