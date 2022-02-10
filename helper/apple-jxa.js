import { runJxa, runJxaSync } from "run-jxa";

export async function displayMessage(message) {
  return await runJxa(
    (insertMessage) => {
      const app = Application.currentApplication();
      app.includeStandardAdditions = true;

      app.displayAlert(insertMessage);
    },
    [message],
  );
}

export async function selectedRemindersAccount() {
  await runJxaSync(() => {
    const Reminder = Application("Reminders");
    Reminder.includeStandardAdditions = true;

    const availableAccountNames = Reminder.accounts().map((account) =>
      account.name(),
    );

    if (availableAccountNames.length === 1) {
      const returnValue = Reminder.displayAlert("Standard Account verwenden?", {
        message:
          "In deiner Erinnerungs App ist nur ein Account hinterlegt. Wenn du diesen nicht verwenden möchtest, lege vorher einen weiteren Account in den Einstellungen an.",
        buttons: ["Abbrechen", "Standard Account verwenden"],
        cancelButton: "Abbrechen",
        defaultButton: "Abbrechen",
      });

      if (returnValue === "Abbrechen") {
        Reminder.displayAlert("Vorgang abgebrochen");
        return;
      }

      return Reminder.defaultAccount();
    }

    const selectedAccount = Reminder.chooseFromList(availableAccountNames, {
      withTitle: "Account wählen",
      withPrompt: "Wähle deinen Account aus",
      defaultItems: [],
      okButtonName: "OK",
      cancelButtonName: "Cancel",
      multipleSelectionsAllowed: false,
      emptySelectionAllowed: false,
    });

    if (selectedAccount === false) {
      Reminder.displayAlert("Vorgang abgebrochen");
      return;
    }

    return selectedAccount;
  }, []);
}

export async function createRemindersList(listdata, accountName) {
  await runJxa(
    (insertListdata, insertAccountName) => {
      const Reminder = Application("Reminders");
      Reminder.includeStandardAdditions = true;

      const newList = Reminder.List(insertListdata);
      insertAccountName.lists.push(newList);
    },
    [listdata, accountName],
  );
}

export async function createNewReminder(reminderdata, listname) {
  await runJxa(
    (insertReminderdata, insertListname) => {
      const Reminder = Application("Reminders");
      Reminder.includeStandardAdditions = true;

      if (!insertListname) {
        insertListname = Reminder.defaultList;
      }

      const newReminder = Reminder.Reminder(insertReminderdata);

      try {
        reminderAccount.lists[insertListname].reminders.push(newReminder);
      } catch (error) {
        console.log(error);
        Reminder.displayAlert(error.message);
      }
    },
    [reminderdata, listname],
  );
}

export function displayBearerTokenInsert() {
  return runJxaSync(() => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;

    const insertToken = () => {
      const value = app.displayDialog(
        "Deinen Todoist API-Token findest du in deinen Accounteinstellungen. Du kannst diese direkt mit folgendem Link öffnen: ",
        {
          withTitle: "Todoist API Token einfügen",
          buttons: ["Abbrechen", "OK"],
          defaultButton: "OK",
          defaultAnswer: "",
        },
      );
      const validatedToken = validateToken(value.textReturned);
      return validatedToken;
    };

    const validateToken = (input) => {
      if (!input.match(/^[0-9a-zA-Z]+$/)) {
        app.displayAlert(
          "Die Eingabe darf nur aus Zahlen und Buchstaben bestehen! Bitte gib die Daten erneut ein.",
          {
            as: "critical",
          },
        );

        insertToken();
      }

      return input;
    };

    return validateToken(insertToken());
  }, []);
}
