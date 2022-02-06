const Reminder = Application("Reminders");
Reminder.includeStandardAdditions = true;

function chooseAccount() {
  const accountnames = Reminder.accounts().map(account => account.name());
  if (accountnames.length === 1) {
    const returnValue = Reminder.displayAlert("Standard Account verwenden?", {
      message: "In deiner Erinnerungs App ist nur ein Account hinterlegt. Wenn du diesen nicht verwenden möchtest, lege vorher einen weiteren Account in den Einstellungen an.",
      buttons: ["Abbrechen", "Standard Account verwenden"],
      cancelButton: "Abbrechen",
      defaultButton: "Abbrechen"
    })
    
    if (returnValue === "Abbrechen") {
      Reminder.displayAlert("Vorgang abgebrochen");
      return;
    }

    return Reminder.defaultAccount();
  } 

  const selectedAccount = Reminder.chooseFromList(accountnames, {
    withTitle: "Account wählen",
    withPrompt: "Wähle deinen Account aus",
    defaultItems: [],
    okButtonName: "OK",
    cancelButtonName: "Cancel",
    multipleSelectionsAllowed: false,
    emptySelectionAllowed: false,
  })

  if (selectedAccount === false) {
    Reminder.displayAlert("Vorgang abgebrochen");
    return;
  } 

  return selectedAccount;
}

const accountName = chooseAccount();
const reminderAccount = Reminder.accounts[accountName];

function createList({listdata, account}) {
  const newList = Reminder.List(listdata);
  account.lists.push(newList);
}
// createList({listdata: {name: "Neue Liste"}, account: reminderAccount});

function createReminder({reminderdata, listname = Reminder.defaultList}) {
  const newReminder = Reminder.Reminder(reminderdata);

  try {
    reminderAccount.lists[listname].reminders.push(newReminder);
  } catch(error) {
    console.log(error);
    Reminder.displayAlert(error.message);
  }
}
// createReminder({reminderdata: {name: "neue Erinnerung"}, listname: "Liste aus" })

