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
			if(data['lines'][idx].length<3){html+=idx+": "+data['lines'][idx]+"<br>";continue};
			var ip=data['lines'][idx][2];
			var src_id='src_'+ip;
			html+=idx+": <input type='button' id='"+src_id+"' value='"+ip+"'></input>"
			html+=data['lines'][idx][3].slice(0,12)+"<br>";
		}
		document.getElementById("netrange").innerHTML=html;
	}
	return me;
}
