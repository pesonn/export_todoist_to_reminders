import { runJxa, runJxaSync } from "run-jxa";

export function displayMessage(message) {
  return runJxaSync(
    (insertMessage) => {
      const app = Application.currentApplication();
      app.includeStandardAdditions = true;

      app.displayAlert(insertMessage);
    },
    [message],
  );
}

export function selectedRemindersAccount() {
  return runJxaSync(() => {
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

      return Reminder.defaultAccount.name();
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

    // chooseFromList returns array of selected answers. But we only need one, so we use the first index!
    return selectedAccount[0];
  }, []);
}

export function createRemindersList(listdata, accountName) {
  return runJxaSync(
    (insertListdata, insertAccountName) => {
      const Reminder = Application("Reminders");
      Reminder.includeStandardAdditions = true;

      const newList = Reminder.List(insertListdata);
      try {
        Reminder.accounts[insertAccountName].lists.push(newList);
        console.log(`Projekt ${insertListdata.name} übertragen`);
      } catch (error) {
        console.log(error);
        console.log(`Fehler bei Projekt ${insertListdata.name}`);
      }
    },
    [listdata, accountName],
  );
}

export function createNewReminder(reminderdata, accountName, listname) {
  return runJxaSync(
    (insertReminderdata, insertAccountName, insertListname) => {
      const Reminder = Application("Reminders");
      Reminder.includeStandardAdditions = true;

      if (typeof insertListname === "undefined") {
        insertListname = Reminder.defaultList.name();
      }

      const newReminder = Reminder.Reminder(insertReminderdata);

      try {
        Reminder.accounts[insertAccountName].lists[
          insertListname
        ].reminders.push(newReminder);
        console.log(`Task ${insertReminderdata.name} übertragen`);
      } catch (error) {
        console.log(error);
        console.log(`Fehler bei Task ${insertReminderdata.name}`);
      }
    },
    [reminderdata, accountName, listname],
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
