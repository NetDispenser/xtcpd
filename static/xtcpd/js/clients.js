var ClientsDaemonUI=function(){
	me={};
	me.setup=function(){
		console.log("ClientsDaemonUI.setup");
		return me;
	}
	me.render_data=function(data){
		console.log("ClientsDaemonUI.render_data");
		document.getElementById("netrange").innerHTML=data['lines'];
	}
	return me;
}
