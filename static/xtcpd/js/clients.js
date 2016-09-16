var ClientsDaemonUI=function(){
	me={};
	me.setup=function(){
		console.log("ClientsDaemonUI.setup");
		return me;
	}
	me.render_data=function(data){
		console.log("ClientsDaemonUI.render_data");
		var html="";
		for(var idx=0;idx<data['lines'].length;idx++){
			if(data['lines'][idx].length<2)continue;
			html+=idx+": "+data['lines'][idx][2]+" ";
			html+=data['lines'][idx][3].slice(0,12)+"<br>";
		}
		document.getElementById("netrange").innerHTML=html;
	}
	return me;
}
