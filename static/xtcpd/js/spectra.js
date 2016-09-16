var SpectraDaemonUI=function(){
	var me={};
	me.data={'keys':[],};
	me.setup=function(){
		console.log("SpectraDaemonUI.setup");
	}
	me.render_data=function(data){
		//console.log("SpectraDaemonUI.render_data");
		//if(!me.data)me.data={};
		//me.data=Object.assign({},me.last_data,data['data']);
		for(var kidx=0;kidx<data['data']['keys'].length;kidx++){
			var netrange=data['data']['keys'][kidx];
			var dummy=me.data['keys'].indexOf(netrange);
			if(dummy<0){
				console.log("adding netrange:"+netrange);
				me.data['keys'].push(netrange);
				me.data[netrange]=data['data'][netrange];
			}
			else{
				var ips=data['data'][netrange]['ips']['keys'];
				console.log("ips="+ips);
				for(var idx=0;idx<ips.length;idx++){
					var ip=ips[idx];
					console.log("considering:"+ip);
					var dummy2=me.data[netrange]['ips']['keys'].indexOf(ip);
					if(dummy2<0){
						console.log("adding ip:"+ip);
						me.data[netrange]['ips'][ip]=data['data'][netrange]['ips'][ip];
						me.data[netrange]['ips']['keys'].push(ip);
					}
					else{
						console.log("increment:"+data['data'][netrange]['ips'][ip]['count']);
						me.data[netrange]['ips'][ip]['count']+=data['data'][netrange]['ips'][ip]['count'];
					}
				}
			}
		}

		var html="";
		var netranges=me.data['keys'];
		for(var k=0;k<netranges.length;k++){
			var netrange=netranges[k];
			html+=netrange+"<br/>";
			var ips=me.data[netrange]['ips']['keys'];
			for(var i=0;i<ips.length;i++){
				ip=ips[i];
				html+="<div style='width:50px;'></div>"+ip+": "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code']+"<br/>";
			}
		}
//		document.getElementById("spectra").innerHTML=JSON.stringify(data['data']);
		document.getElementById("spectra").innerHTML=html;
	}
	return me;
}
