function sendWhatsAppMessages() {
    // Google Sheets ID
    var sheetID = '10ZUjQqsA7WYlWxobT0_NEdqxZwlXZPFhBI80_Xj92fo';
    
    // Sheets reference
    var spreadsheet = SpreadsheetApp.openById(sheetID);
    var sheetData = spreadsheet.getSheetByName('data');
    var sheetWAContent = spreadsheet.getSheetByName('wa content');
    
    // Message template from 'wa content'
    var messageTemplate = sheetWAContent.getRange('B4').getValue();
    
    // WhatsApp API details from 'wa content'
    var waID = sheetWAContent.getRange('B6').getValue();
    var waPassword = sheetWAContent.getRange('B7').getValue();
    var waAPI = sheetWAContent.getRange('B8').getValue();
    
    // Getting customer data from 'data' sheet
    var lastRow = sheetData.getLastRow();
    
    for (var i = 2; i <= lastRow; i++) {
      var customerNumber = sheetData.getRange(i, 3).getValue(); // Column C (Customer Mobile Number)
      var deliveryCharges = sheetData.getRange(i, 5).getValue(); // Column E (Delivery Charges)
      var customerName = sheetData.getRange(i, 7).getValue(); // Column G (Customer Name)
      var deliveryBoyName = sheetData.getRange(i, 8).getValue(); // Column H (Delivery Boy Name)
      var deliveryBoyMobile = sheetData.getRange(i, 9).getValue(); // Column I (Delivery Boy Mobile Number)
      var status = sheetData.getRange(i, 6).getValue(); // Column F (Status)
      
      // Check if the mobile number is not blank and the status is not blank
      if (customerNumber !== "" && status === "") {
        // Customize message for each customer by replacing placeholders
        var message = messageTemplate
          .replace("{customerName}", customerName)
          .replace("{deliveryBoyName}", deliveryBoyName)
          .replace("{deliveryBoyMobile}", deliveryBoyMobile)
          .replace("{deliveryCharges}", deliveryCharges);
        
        // Construct the API URL with the specific parameters
        var apiUrl = `https://irq.innojar.com/api/SendMsg?lLCNNo=21373&PIN=TJECHULVE&sPhNo=${customerNumber}&mob=${customerNumber}&sMsg=${encodeURIComponent(message)}&lTType=11`;
        
        var options = {
          'method': 'post',
          'contentType': 'application/json',
          'payload': JSON.stringify({
            'id': waID,
            'password': waPassword
          })
        };
        
        try {
          UrlFetchApp.fetch(apiUrl, options);
          
          // Update the 'F' column with the current date and time after the message is sent
          sheetData.getRange(i, 6).setValue(new Date());
        } catch (e) {
          Logger.log('Message sending failed for ' + customerNumber + ': ' + e.message);
        }
      }
    }
  }
  
