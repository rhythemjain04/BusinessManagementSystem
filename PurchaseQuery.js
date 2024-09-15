function handleEditEvent(e) {
    const sheetId = '1VYh53hcxQl6tUqVmLmGSety9hoyfeWMbPu1fwYbNAk8'; 
    const sheet = SpreadsheetApp.openById(sheetId);
    const dataSheet = sheet.getSheetByName('DATA');
    const contentSheet = sheet.getSheetByName('WA CONTENT');
  
    if (!dataSheet || !contentSheet) {
      Logger.log('One or both sheets not found');
      return;
    }
  
    if (!e || !e.range) {
      Logger.log('Event object or range is undefined');
      return;
    }
  
    const queryMessageTemplate = contentSheet.getRange('B4').getValue();
    const buyMessageTemplate = contentSheet.getRange('B10').getValue();
    const apiUrlTemplate = contentSheet.getRange('B8').getValue();
    const waID = contentSheet.getRange('B6').getValue();
    const waPassword = contentSheet.getRange('B7').getValue();
  
    Logger.log(`queryMessageTemplate: ${queryMessageTemplate}`);
    Logger.log(`buyMessageTemplate: ${buyMessageTemplate}`);
    Logger.log(`apiUrlTemplate: ${apiUrlTemplate}`);
    Logger.log(`waID: ${waID}`);
    Logger.log(`waPassword: ${waPassword}`);
  
    const editedRow = e.range.getRow();
    const row = dataSheet.getRange(editedRow, 1, 1, dataSheet.getLastColumn()).getValues()[0];
    const phoneNumber = row[2];
    const trigger = row[5];
    const triggerStatus = row[7];
    const name = row[14];
    const item = row[3];
    const amt = row[4];
  
    Logger.log(`phoneNumber: ${phoneNumber}`);
    Logger.log(`trigger: ${trigger}`);
    Logger.log(`triggerStatus: ${triggerStatus}`);
    Logger.log(`name: ${name}`);
    Logger.log(`item: ${item}`);
    Logger.log(`amt: ${amt}`);
  
    const today = new Date();
    const currentDateStr = today.toISOString().split('T')[0]; // YYYY/MM/DD
  
    if (trigger && !triggerStatus) {
      let message = '';
      if (trigger.toLowerCase() === 'query') {
        message = queryMessageTemplate.replace('{NAME}', name).replace('{ITEM}', item).replace('{AMT}', amt);
      } else if (trigger.toLowerCase() === 'buy') {
        message = buyMessageTemplate.replace('{NAME}', name).replace('{ITEM}', item).replace('{AMT}', amt);
      }
      Logger.log(`Message to send: ${message}`);
      sendMessage(phoneNumber, message, apiUrlTemplate, waID, waPassword);
      dataSheet.getRange(editedRow, 8).setValue(currentDateStr);
    }
  }
  
  function handleTimeBasedEvent() {
    const sheetId = '1VYh53hcxQl6tUqVmLmGSety9hoyfeWMbPu1fwYbNAk8'; // Google Sheet ID
    const sheet = SpreadsheetApp.openById(sheetId);
    const dataSheet = sheet.getSheetByName('DATA');
    const contentSheet = sheet.getSheetByName('WA CONTENT');
  
    if (!dataSheet || !contentSheet) {
      Logger.log('One or both sheets not found');
      return;
    }
  
    // Get WA Content
    const birthdayMessageTemplate = contentSheet.getRange('B12').getValue();
    const anniversaryMessageTemplate = contentSheet.getRange('B14').getValue();
    const apiUrlTemplate = contentSheet.getRange('B8').getValue();
    const waID = contentSheet.getRange('B6').getValue();
    const waPassword = contentSheet.getRange('B7').getValue();
  
    // Log WA Content values for debugging
    Logger.log(`birthdayMessageTemplate: ${birthdayMessageTemplate}`);
    Logger.log(`anniversaryMessageTemplate: ${anniversaryMessageTemplate}`);
    Logger.log(`apiUrlTemplate: ${apiUrlTemplate}`);
    Logger.log(`waID: ${waID}`);
    Logger.log(`waPassword: ${waPassword}`);
  
    const today = new Date();
    const currentHour = today.getHours();
    const currentDateStr = today.toISOString().split('T')[0];
  
    const dataRange = dataSheet.getDataRange();
    const dataValues = dataRange.getValues();
  
    for (let i = 1; i < dataValues.length; i++) { 
      const row = dataValues[i];
      const phoneNumber = row[2];
      const birthdayDate = row[9];
      const birthdayStatus = row[12];
      const anniversaryDate = row[11];      const anniversaryStatus = row[13];
      const name = row[14];
  
      Logger.log(`Row ${i + 1}: phoneNumber: ${phoneNumber}`);
      Logger.log(`Row ${i + 1}: birthdayDate: ${birthdayDate}`);
      Logger.log(`Row ${i + 1}: birthdayStatus: ${birthdayStatus}`);
      Logger.log(`Row ${i + 1}: anniversaryDate: ${anniversaryDate}`);
      Logger.log(`Row ${i + 1}: anniversaryStatus: ${anniversaryStatus}`);
      Logger.log(`Row ${i + 1}: name: ${name}`);
      if (birthdayDate && !birthdayStatus) {
        const birthday = new Date(birthdayDate);
        if (birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate() && currentHour >= 8 && currentHour <= 9) {
          const message = birthdayMessageTemplate.replace('{NAME}', name);
          Logger.log(`Birthday message to send: ${message}`);
          sendMessage(phoneNumber, message, apiUrlTemplate, waID, waPassword);
          dataSheet.getRange(i + 1, 13).setValue(currentDateStr);
        }
      }
  
      if (anniversaryDate && !anniversaryStatus) {
        const anniversary = new Date(anniversaryDate);
        if (anniversary.getMonth() === today.getMonth() && anniversary.getDate() === today.getDate() && currentHour >= 8 && currentHour <= 9) {
          const message = anniversaryMessageTemplate.replace('{NAME}', name);
          Logger.log(`Anniversary message to send: ${message}`);
          sendMessage(phoneNumber, message, apiUrlTemplate, waID, waPassword);
          dataSheet.getRange(i + 1, 14).setValue(currentDateStr);
        }
      }
    }
  }
  
  function sendMessage(phoneNumber, message, apiUrlTemplate, waID, waPassword) {
    const apiUrl = apiUrlTemplate.replace('sPhNo=mob', `sPhNo=${phoneNumber}`)
                                 .replace('sMsg=message', `sMsg=${encodeURIComponent(message)}`);
    Logger.log(`API URL: ${apiUrl}`);
    UrlFetchApp.fetch(apiUrl, {
      method: 'get'
    });
  }
  
  function resetAnnualStatuses() {
    const sheetId = '1VYh53hcxQl6tUqVmLmGSety9hoyfeWMbPu1fwYbNAk8';
    const sheet = SpreadsheetApp.openById(sheetId);
    const dataSheet = sheet.getSheetByName('DATA');
  
    if (!dataSheet) {
      Logger.log('DATA sheet not found');
      return;
    }
  
    const dataRange = dataSheet.getDataRange();
    const dataValues = dataRange.getValues();
  
    for (let i = 1; i < dataValues.length; i++) { 
      dataSheet.getRange(i + 1, 13).setValue(''); 
      dataSheet.getRange(i + 1, 14).setValue('');
    }
  }
  
  function setUpAnnualResetTrigger() {
    ScriptApp.newTrigger('resetAnnualStatuses')
             .timeBased()
             .onMonthDay(1)  
             .atHour(0)   
             .create();
  }
  
  function setUpTriggers() {
    const sheetId = '1VYh53hcxQl6tUqVmLmGSety9hoyfeWMbPu1fwYbNAk8'; 
    const sheet = SpreadsheetApp.openById(sheetId);
  
    const allTriggers = ScriptApp.getProjectTriggers();
    for (const trigger of allTriggers) {
      ScriptApp.deleteTrigger(trigger);
    }
  
    ScriptApp.newTrigger('handleEditEvent')
             .forSpreadsheet(sheet)
             .onEdit()
             .create();
  
    ScriptApp.newTrigger('handleTimeBasedEvent')
             .timeBased()
             .everyDays(1)
             .atHour(8)
             .create();
  
    setUpAnnualResetTrigger();
  }
  
  function testHandleEditEvent() {
    const testEvent = {
      range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DATA').getRange('F2')
    };
    handleEditEvent(testEvent);
  }
  
  function testHandleTimeBasedEvent() {
    handleTimeBasedEvent();
  }
  
