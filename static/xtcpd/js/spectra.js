var SpectraDaemonUI=function(){
	me={};
	me.setup=function(){
		console.log("SpectraDaemonUI.setup");
		return me;
	}
	me.render_data=function(data){
		console.log("SpectraDaemonUI.render_data");
		document.getElementById("spectra").innerHTML=JSON.stringify(data['data']);
	}
	return me;

}
