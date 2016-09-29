var DEBUG=true;
var checkboxCB=function(e){
	console.log(e.target.id);

	var cb=document.getElementById(e.target.id);
	console.log(cb.src);
	if(cb.src.indexOf('checkbox-0')>-1){
		cb.src='/static/xtcpd/img/checkbox-1.png';
		console.log("checked");
	}
	else {
		cb.src='/static/xtcpd/img/checkbox-0.png';
		console.log("unchecked");
	}
}
var SpectraDaemonUI=function(){
	var me={};
	me.current_selection=0;
	me.data={'keys':[],};
	me.setup=function(){
		console.log("SpectraDaemonUI.setup");
	}
	me.netrangeCB=function(e){//replace with toggleClass (via d3 toggleClass?)
		try{
			console.log("netrangeCB: ");
		}
		catch(e){console.log(e);}
	}
	me.selclickCB=function(e){
		console.log('id='+e.target.id);
		var ms=document.getElementById("myselectra");
		for(var oidx=0;oidx<ms.options.length;oidx++){
			if(ms.options[oidx].id==e.target.id){
				me.current_selection=oidx;
				ms.options[oidx].selected=true;
			}
			else ms.options[oidx].selected=false;//explicit to prevent mult select
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
		try{
			var c=JSON.parse(ms.options[me.current_selection].value)['color'];
			console.log(c);
			ms.options[me.current_selection].style.color=c;
			console.log('color='+c);
		}
		catch(e){console.log(e);}

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
				o.selected=false;
				o.addEventListener("click",me.selclickCB,false);
				o.addEventListener("mouseover",me.netrangeCB,false);
				ms.add(o,ms.options[0]);//NEED:add ips ... like code below
				document.getElementById("spectra_status").innerHTML="NetRange "+netrange;

				//SELECTRA2
				var sanitized=netrange;
				for(var dummy=0;dummy<8;dummy++)
					sanitized=sanitized.replace(".","ZZZ");

				var ip_key=me.data[netrange]['ips']['keys'][0];
//				var roll_up_name=netrange;

				var roll_up_name=netrange+"<br>"+me.data[netrange]['ips'][ip_key]['city']+", ";
				roll_up_name+=me.data[netrange]['ips'][ip_key]['region_name']+", ";
				roll_up_name+=me.data[netrange]['ips'][ip_key]['country_name'];

				var opts={
					'category':sanitized,
					'parent_id':'selectra2',
					'id':netrange,
					'className':'roll_up_div',
					'roll_up_class':'rollup',
					'roll_up_name':roll_up_name,
					'arrow_img':'/static/xtcpd/img/arrow-dn.png',
					'roll_up_icon_src':'/static/xtcpd/img/arrow-dn.png',
					'checkboxCB':checkboxCB,
					'checkboxSRC':'/static/xtcpd/img/checkbox-1.png',
				};
				var rollup=new RollUpDiv(opts);



				var lt=document.createElement("table");//lt=LayersTable
				lt.className="layer_table";
				lt.id=netrange+"_layer_table";

				var ips=data['data'][netrange]['ips']['keys'];//incoming list
				for(var idx=0;idx<ips.length;idx++){//cycle over incoming ips
					var ip=ips[idx];
					var o=document.createElement("option");
					o.text=ip+" "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code'];
					o.id=ip;
					o.selected=false;
					o.style.color=window.clients_widget.get_color(me.data[netrange]['ips'][ip]['src']);//
					console.log("setting o.value="+JSON.stringify(me.data[netrange]['ips'][ip]));
					o.value=JSON.stringify(me.data[netrange]['ips'][ip]);//me.data[netrange]['ips'][ip]['src'];
					console.log("assigning src_ip="+JSON.stringify(me.data[netrange]['ips'][ip]['src']));
					o.addEventListener("click",me.selclickCB,false);
					ms.add(o,ms.options[idx+1]);//NEED:add at correct place in stack (append)

					var layer_name=ip;
					var r=lt.insertRow(-1);
					var c=r.insertCell(-1);
					var ip_label=document.createElement("div");
					ip_label.id=ip+"ip_label";
					ip_label.innerHTML="<a>"+ip+"</a>&nbsp;";
					ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a>&nbsp;";
					ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a>&nbsp;";
					ip_label.className="ip_label";
					c.appendChild(ip_label);

					window.map_widget.add_point(me.data[netrange]['ips'][ip]);
				}
				rollup.rollup.appendChild(lt);
			}
			else{
				var ips=data['data'][netrange]['ips']['keys'];//incoming list
				for(var idx=0;idx<ips.length;idx++){//cycle over incoming ips
					var ip=ips[idx];
					var dummy2=me.data[netrange]['ips']['keys'].indexOf(ip);//our list
					if(dummy2<0){

						document.getElementById("spectra_status").innerHTML="IP "+ip;

						//NEED:insert new select option into corresponding netrange rollup
						me.data[netrange]['ips'][ip]=data['data'][netrange]['ips'][ip];
						me.data[netrange]['ips']['keys'].push(ip);

						var o=document.createElement("option");
						o.text=ip+" "+me.data[netrange]['ips'][ip]['count']+" "+me.data[netrange]['ips'][ip]['country_code'];
						o.id=ip;
						o.selected=false;
						o.style.color=window.clients_widget.get_color(me.data[netrange]['ips'][ip]['src']);//
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

						var lt=document.getElementById(netrange+"_layer_table");
						var layer_name=ip;
						var r=lt.insertRow(-1);
						var c=r.insertCell(-1);
						var ip_label=document.createElement("div");
						ip_label.id=ip+"ip_label";
						ip_label.innerHTML="<a>"+ip+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a>&nbsp;";
						ip_label.className="ip_label";
						c.appendChild(ip_label);


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

						ip_label=document.getElementById(ip+"ip_label");
						ip_label.innerHTML="<a>"+ip+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a>&nbsp;";
						ip_label.className="ip_label";
					}
				}
			}
		}//for netrange in keys

		//put up some useful statistics:
		var status="Ranges: "+me.data['keys'].length+"&nbsp;&nbsp;";
		var ip_count=0;
		var pkt_count=0;
		for(var kidx=0;kidx<me.data['keys'].length;kidx++){
			var netrange=me.data['keys'][kidx];
			ip_count+=me.data[netrange]['ips']['keys'].length;
			for(var jidx=0;jidx<me.data[netrange]['ips']['keys'].length;jidx++){
				var ip_key=me.data[netrange]['ips']['keys'][jidx];
				pkt_count+=me.data[netrange]['ips'][ip_key]['count'];
			}
		}
		status+="IPs: "+ip_count+"&nbsp;&nbsp;";
		status+="Pkt: "+pkt_count+"&nbsp;&nbsp;";

		document.getElementById("spectra_status").innerHTML=status;
		console.log(status);

		d3.selectAll(".marker_default")
			.on("mouseover",me.markermouseover)
			.on("mouseout",me.markermouseout);


	}//me.render_data
	me.markermouseout=function(){
		d3.select(this)
			.style("background-color","#FFFF00");
	}
	me.markermouseover=function(){
		d3.select(this)
		.style("background-color","#FFFFFF");
	}
	return me;
}
