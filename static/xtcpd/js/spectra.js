var SpectraDaemonUI=function(){
	var me={};
	me.current_selection=0;
	me.data={'keys':[],};
	me.setup=function(){
		console.log("SpectraDaemonUI.setup");
	}
	me.selclickCB=function(e){
		var ms=document.getElementById("myselectra");
		for(var oidx=0;oidx<ms.options.length;oidx++){
			if(ms.options[oidx].selected==true)me.current_selection=oidx;
		}
		var pyld=JSON.parse(ms.options[me.current_selection].value);
		window.clients_widget.hilite_src(pyld['src']);
		window.map_widget.focus_point(pyld);
	}
	me.selectCB=function(direction){
		console.log("selectCB:"+direction);
		//get selectedID and go up/down
		var ms=document.getElementById("myselectra");
		var delta=+1;
		if(direction=='up')delta=-1;
		ms.options[me.current_selection].selected=false;
		me.current_selection+=delta;
		if(me.current_selection>=ms.options.length)
			me.current_selection=0;
		if(me.current_selection<0)
			me.current_selection=ms.options.length-1;
		ms.options[me.current_selection].selected=true;//CB: Here is where update others

		//this throwing syntax error when netrange b/c only ips have pyld as o.value
		var pyld=JSON.parse(ms.options[me.current_selection].value);
		window.clients_widget.hilite_src(pyld['src']);
		window.map_widget.focus_point(pyld);
	}
	me.render_data=function(data){
		//console.log("SpectraDaemonUI.render_data");
		//if(!me.data)me.data={};
		//me.data=Object.assign({},me.last_data,data['data']);
		var ms=document.getElementById("myselectra");
		for(var kidx=0;kidx<data['data']['keys'].length;kidx++){
			var netrange=data['data']['keys'][kidx];
			var dummy=me.data['keys'].indexOf(netrange);
			if(dummy<0){
				me.data['keys'].push(netrange);
				me.data[netrange]=data['data'][netrange];//copy entire sub-{}
				//NEED: insert new netrange rollup
				var o=document.createElement("option");
				o.text=netrange;
				o.id=netrange;
				o.addEventListener("click",me.selclickCB,false);
				ms.add(o,ms.options[0]);//NEED:add ips ... like code below

				var ips=data['data'][netrange]['ips']['keys'];//incoming list
				for(var idx=0;idx<ips.length;idx++){//cycle over incoming ips
					var ip=ips[idx];
					var o=document.createElement("option");
					o.text=ip+" "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code'];
					o.id=ip;
					console.log("setting o.value="+JSON.stringify(me.data[netrange]['ips'][ip]));
					o.value=JSON.stringify(me.data[netrange]['ips'][ip]);//me.data[netrange]['ips'][ip]['src'];
					console.log("assigning src_ip="+JSON.stringify(me.data[netrange]['ips'][ip]['src']));
					o.addEventListener("click",me.selclickCB,false);
					ms.add(o,ms.options[idx+1]);//NEED:add at correct place in stack (append)

					window.map_widget.add_point(me.data[netrange]['ips'][ip]);
				}
			}
			else{
				var ips=data['data'][netrange]['ips']['keys'];//incoming list
				for(var idx=0;idx<ips.length;idx++){//cycle over incoming ips
					var ip=ips[idx];
					var dummy2=me.data[netrange]['ips']['keys'].indexOf(ip);//our list
					if(dummy2<0){
						//NEED:insert new select option into corresponding netrange rollup
						me.data[netrange]['ips'][ip]=data['data'][netrange]['ips'][ip];
						me.data[netrange]['ips']['keys'].push(ip);

						var o=document.createElement("option");
						o.text=ip+" "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code'];
						o.id=ip;
						console.log("setting o.value2="+JSON.stringify(me.data[netrange]['ips'][ip]));
						o.value=JSON.stringify(me.data[netrange]['ips'][ip]);//me.data[netrange]['ips'][ip]['src'];
						o.addEventListener("click",me.selclickCB,false);
						//Now insert at right place:
						var target_idx=0;
						for(var tidx=0;tidx<ms.options.length;tidx++){
							if(ms.options[tidx].text==netrange){
								target_idx=tidx;
								break;
							}
						}
						ms.add(o,ms.options[target_idx+1]);//NEED:add at correct place in stack (append)

						window.map_widget.add_point(me.data[netrange]['ips'][ip]);
					}
					else{
						me.data[netrange]['ips'][ip]['count']+=data['data'][netrange]['ips'][ip]['count'];
						var target_idx=0;
						for(var tidx=0;tidx<ms.options.length;tidx++){
							if(ms.options[tidx].id==ip){
								target_idx=tidx;
								break;
							}
						}
						var o=ms.options[target_idx];
						o.text=ip+" "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code'];
						//if does have that ip then we need to update count of existing
					}
				}
			}
		}//for netrange in keys
	}//me.render_data

	return me;
}
