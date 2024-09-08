function sendWhatsAppMessages() {
    var sheetID = '10ZUjQqsA7WYlWxobT0_NEdqxZwlXZPFhBI80_Xj92fo';
    
    var spreadsheet = SpreadsheetApp.openById(sheetID);
    var sheetData = spreadsheet.getSheetByName('data');
    var sheetWAContent = spreadsheet.getSheetByName('wa content');
    
    var messageTemplate = sheetWAContent.getRange('B4').getValue();
    
    var waID = sheetWAContent.getRange('B6').getValue();
    var waPassword = sheetWAContent.getRange('B7').getValue();
    var waAPI = sheetWAContent.getRange('B8').getValue();
    
    var lastRow = sheetData.getLastRow();
    
    for (var i = 2; i <= lastRow; i++) {
      var customerNumber = sheetData.getRange(i, 3).getValue(); // (Customer Mobile Number)
      var deliveryCharges = sheetData.getRange(i, 5).getValue(); // (Delivery Charges)
      var customerName = sheetData.getRange(i, 7).getValue(); // Customer Name)
      var deliveryBoyName = sheetData.getRange(i, 8).getValue(); // (Delivery Boy Name)
      var deliveryBoyMobile = sheetData.getRange(i, 9).getValue(); // (Delivery Boy Mobile Number)
      var status = sheetData.getRange(i, 6).getValue(); //(Status)
      
      if (customerNumber !== "" && status === "") {
        var message = messageTemplate
          .replace("{customerName}", customerName)
          .replace("{deliveryBoyName}", deliveryBoyName)
          .replace("{deliveryBoyMobile}", deliveryBoyMobile)
          .replace("{deliveryCharges}", deliveryCharges);
        
        var apiUrl = ''
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
          
          sheetData.getRange(i, 6).setValue(new Date());
        } catch (e) {
          Logger.log('Message sending failed for ' + customerNumber + ': ' + e.message);
        }
      }
    }
  }
  
