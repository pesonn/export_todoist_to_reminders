import fetch from "node-fetch";

/**
 * Get Data From Todoist API with Bearer Token.
 *
 * @param {string} typeOrURL Either insert one of the types "projects", "projectsWithID", "tasks", "tasksfromproject" to use predefined URL or insert a "Custom Query URL" from Todoist. 
  Both "projectWithID" and "tasksfromproject" require a projectID.
 * @returns {Promise<any>} "fetched Data from Todoist API"
 */
export async function getTodoistData({ typeOrURL, projectID, api_token }) {
  if (!typeOrURL) {
    throw new Error("Insert a Type or a Custom URL from Todoist!");
  }
  if (!api_token) {
    throw new Error("Insert a API Token from Todoist!");
  }

  function handleURL() {
    switch (typeOrURL) {
      case "projects":
        return "https://api.todoist.com/rest/v1/projects";
      case "projectWithID":
        return `https://api.todoist.com/rest/v1/projects?project_id=${projectID}`;
      case "tasks":
        return "https://api.todoist.com/rest/v1/tasks";
      case "tasksfromproject":
        return `https://api.todoist.com/rest/v1/tasks?project_id=${projectID}`;
      default:
        return typeOrURL;
    }
  }

  const response = await fetch(handleURL(projectID), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${api_token}`,
    },
  });

  const json = await response.json();

  return json;
}

export function translateTodoistColorIdToHex(colorID) {
  switch (colorID) {
    case 30:
      return "#b8256f";
    case 31:
      return "#db4035";
    case 32:
      return "#ff9933";
    case 33:
      return "#fad000";
    case 34:
      return "#afb83b";
    case 35:
      return "#7ecc49";
    case 36:
      return "#299438";
    case 37:
      return "#6accbc";
    case 38:
      return "#158fad";
    case 39:
      return "#14aaf5";
    case 40:
      return "#96c3eb";
    case 41:
      return "#4073ff";
    case "4":
      return "#884dff";
    case 43:
      return "#af38eb";
    case 44:
      return "#eb96eb";
    case 45:
      return "#e05194";
    case 46:
      return "#ff8d85";
    case 47:
      return "#808080";
    case 48:
      return "#b8b8b8";
    case 49:
      return "#b8256f";
    default:
      return "#ccac93";
  }
}

export function translateTodoistPrioritiesToReminderPrio(prio) {
  switch (prio) {
    case 1:
      return 0;
    case 2:
      return 6;
    case 3:
      return 5;
    case 4:
      return 1;
    default:
      return 0;
  }
}
