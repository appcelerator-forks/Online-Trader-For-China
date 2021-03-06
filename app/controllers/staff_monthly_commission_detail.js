var args = arguments[0] || {};
var date = args.date || '';
var clickTime = null;
getSummary();
Ti.App.Properties.setString('module', 'dealer_summary');
//Active icon displayed

function loadTableRow(data){
	var tableData = [];
	for (var i = 0; i<data.length; i++){
        var row = Ti.UI.createTableViewRow({
            className:'forumEvent', // used to improve table performance
            rowIndex:i, // custom property, useful for determining the row during events
            selectionStyle:0,
            separatorColor:'#ccc',
            width: '100%',
            day: data[i]['date'],
        });

        var lblField = Ti.UI.createLabel({
                text: data[i]['date'],
                color:'#222',
                top:'10dp',
                left:'10dp'
            });
            
       var lblField2 = Ti.UI.createLabel({
                realValue: 'Value',
                textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				top :"10dp",
				width: "20%",
				left :"80%",
                text: data[i]['value'],
                color:'#222'
            });
	  var separator = Ti.UI.createView({top:49, backgroundColor:'#9d0404', height:1});

      row.add(lblField);
      row.add(lblField2);
      row.add(separator);
      tableData.push(row);     
    }
	
	$.tableView.setData(tableData);
}

function getSummary(e) {

	var url = Ti.API.GETDAILYSUMMARYBYMONTH + Ti.App.Properties.getString('session') + "&date=" + date;
	var data = [];
	$.activityIndicator.show();
	$.loadingBar.opacity = "1";
	$.loadingBar.height = "100";
	$.loadingBar.top = (PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)/2);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	         var res = JSON.parse(this.responseText); 
	         if(res.status == "Success"){
	         	
				var totalCommission = 0;
				for (var key in res.data){
					var obj = res.data[key];
					data.push({date: obj.date, value: obj.commission });
					totalCommission += parseFloat(obj.commission);
				}
				$.totalCommission.text = totalCommission;
				loadTableRow(data);
				data = null;
				$.activityIndicator.hide();
				$.loadingBar.opacity = "0";
				$.loadingBar.height = "0";
	         }else{
	         	alert(res.status);
	         	createAlert('Error',res.status);
	         }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	         createAlert('Network declined','Failed to contact with server. Please make sure your device are connected to internet.');
	     },
	     timeout : 60000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send();
}

$.tableView.addEventListener("click", function(e){
	var currentTime = new Date();
	if (currentTime - clickTime < 1000) {
	    return;
	}else{
		clickTime = currentTime;
		
	    var prop = e.rowData.day;
	   
	    var param = {
	        date: prop,
	        from: "monthlyCommission"
	    };
		var dailyCommission = Alloy.createController("staff_daily_commission",param).getView();
	    
	    setWindowRelationship(dailyCommission);
   }
});

$.dateSelector.addEventListener('load', function(data) { 
   
});
	
var getDate = function(e) { 
	date = e.year+"-"+e.month;
	getSummary(e); 
};
Ti.App.addEventListener('app:getDate', getDate);

$.staff_monthly_commission_detail.addEventListener("close", function(){
    $.destroy();
    Ti.App.removeEventListener('app:getDate', getDate); 
});
