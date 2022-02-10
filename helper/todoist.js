import fetch from "node-fetch";

export async function getData(url) {
  let data = null;
  await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer" + " " + process.env.TODOIST_API_TOKEN,
    },
  })
    .then((res) => (data = res.json()))
    .catch((error) => console.log(error));

  return data;
}

export function translateColorIdToHex(colorID) {
  switch (colorID) {
    case "30":
      return "#b8256f";

    case "31":
      return "#db4035";

    case "32":
      return "#ff9933";

    case "33":
      return "#fad000";

    case "34":
      return "#afb83b";

    case "35":
      return "#7ecc49";

    case "36":
      return "#299438";

    case "37":
      return "#6accbc";

    case "38":
      return "#158fad";

    case "39":
      return "#14aaf5";

    case "40":
      return "#96c3eb";

    case "41":
      return "#4073ff";

    case "42":
      return "#884dff";

    case "43":
      return "#af38eb";

    case "44":
      return "#eb96eb";

    case "45":
      return "#e05194";

    case "46":
      return "#ff8d85";

    case "47":
      return "#808080";

    case "48":
      return "#b8b8b8";

    case "49":
      return "#b8256f";

    default:
      return "#ccac93";
  }
}
