var args = arguments[0] || {};

//Active icon displayed
var poslist = $.footer.getView('poslist'); 
poslist.image = "/images/icons/icon-pos-active.png";
Ti.App.Properties.setString('module', 'dealer_poslist');

/**Experiment**/
Ti.App.fireEvent("getSession", {session:Ti.App.Properties.getString("session")});
/**End**/
 
function goPosDetails(e){
	
	var roles = Ti.App.Properties.getString('roles');
	var param = {
        p_id: e.p_id,
    };
	var posdetail = Alloy.createController(roles + "_posdetail",param).getView();
    
    setWindowRelationship(posdetail);
};

function refreshPage(e){
	Ti.App.fireEvent('app:refreshPage');
}
///////////function//////////// 
var onSuccessCallback = function(e) {
	Ti.App.fireEvent('html:realDrawTable', { 
		data: JSON.parse(e.data),
	});
};

var onErrorCallback = function(e) {
	alert('no cache or connection lost');
	// Handle your errors in here
};
 
if(!Ti.App.staff_poslist ){
	Ti.App.addEventListener("app:viewPosDetail", goPosDetails); 
	Ti.App.staff_poslist = true;
}   
 	      
$.poslistview.addEventListener('load', function(data) { 
	
  	Ti.App.fireEvent('app:posListParam', { 
		session: Ti.App.Properties.getString('session'), 
		posUrl : Ti.API.GETPOS + Ti.App.Properties.getString('session'),
	});
	
});

$.dealer_poslist.addEventListener('close', function(e){				// when this window close, trigger this event to remove the event.
	Ti.App.removeEventListener('app:viewPosDetail',goPosDetails); 
});

$.dealer_poslist.addEventListener('androidback', function(e){				// when this window close, trigger this event to remove the event.
	Ti.App.removeEventListener('app:viewPosDetail',goPosDetails); 
});

$.rightNav.addEventListener("touchstart", function(e){
	this.setBackgroundColor("#fff");
	this.setColor("#e02222");
});

$.rightNav.addEventListener("touchend", function(e){
	this.setBackgroundColor("transparent");
	this.setColor("#fff");
});
