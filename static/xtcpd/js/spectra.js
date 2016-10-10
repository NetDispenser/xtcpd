var DEBUG=true;
var checkboxCB=function(e,obj){
	console.log(obj.checkbox_icon.id);
	if(!obj)return;
	var netrange=obj['opts']['id'];
	while(netrange.indexOf(".")>-1)
		netrange=netrange.replace(".","ZZZ");
	console.log(netrange+" setting to red");

	var cb=document.getElementById(obj.checkbox_icon.id);
	console.log(cb.src);
	if(cb.src.indexOf('checkbox-0')>-1){
		cb.src='/static/xtcpd/img/checkbox-1.png';
		console.log("checked");
		$("."+netrange).toggleClass("hide");
	}
	else {
		cb.src='/static/xtcpd/img/checkbox-0.png';
		console.log("unchecked");
		$("."+netrange).toggleClass("hide");
	}
}
var allnone_checkboxCB=function(e,obj){
	if(!obj)return;
	var cb=document.getElementById(e.target.id);
	var checked=null;
	if(cb.src.indexOf('checkbox-0')>-1){
		cb.src='/static/xtcpd/img/checkbox-1.png';
		console.log("checked");
		checked=true;
	}
	else {
		cb.src='/static/xtcpd/img/checkbox-0.png';
		console.log("unchecked");
		checked=false;
	}
	for(var kidx=0;kidx<window.spectra_widget.rollups['keys'].length;kidx++){
		var key=window.spectra_widget.rollups['keys'][kidx];
		var rollup=window.spectra_widget.rollups[key];
		var netrange=rollup.opts['id'];
		while(netrange.indexOf(".")>-1)
			netrange=netrange.replace(".","ZZZ");
		console.log(netrange);
		if(rollup.checkbox_icon.src.indexOf('checkbox-0')>-1){
			if(checked==false)continue;
			else{
				console.log("need2show: "+netrange);
				checkboxCB(e,rollup);
			}
		}
		else{
			if(checked==false){
				console.log("need2hide: "+netrange);
				checkboxCB(e,rollup);
			}
			else continue;
		}
	}
}
var allnone_select_rollupCB=function(e,obj){
	console.log(e.target.id);
}
var select_rollupCB=function(e,obj){
	console.log('select_rollupCB');
	window.spectra_widget.deselect_all_rollups();

	var netrange=obj['opts']['id'];
	while(netrange.indexOf(".")>-1)
		netrange=netrange.replace(".","ZZZ");
	console.log(netrange+" setting to red");
	//use netrange to hilite all with className==netrange
	//d3.selectAll("."+netrange).style("border","4px solid red");
	$("."+netrange).toggleClass("marker_default_hilite");//NEED:iff hilited row

	netrange=obj['opts']['netrange'];
	console.log("netrange="+netrange);
	for(var kidx=0;kidx<window.spectra_widget.data['keys'].length;kidx++){
		var key=window.spectra_widget.data['keys'][kidx];
		//console.log("key="+key);
	}
	var ip_keys=window.spectra_widget.data[netrange]['ips']['keys'];
	console.log(ip_keys.length+" ips in this netrange");

	var ip_key=ip_keys[0];
	var pyld=window.spectra_widget.data[netrange]['ips'][ip_key];
	window.map_widget.focus_point(pyld);
	window.spectra_widget.current_pyld=window.spectra_widget.data[netrange]['ips'][ip_key];
}
var SpectraDaemonUI=function(){
	var me={};
	me.data={'keys':[],};
	me.rollups={'keys':[],};
	me.allnone_rollup=null;
	me.current_pyld=null;

	me.mkstatus=function(){
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
		return status;
	}

	me.clear=function(){
		me.data={'keys':[],};
		me.rollups={'keys':[],};
		me.current_pyld=null;
		document.getElementById("selectra2").innerHTML="";
		var s2=document.getElementById("selectra2");
		var s2t=document.createElement("table");
		s2t.width="100%";
		s2.appendChild(s2t);
	}
	me.setup=function(){
		console.log("SpectraDaemonUI.setup");
		var opts={
			'category':'allnone',
			'netrange':'',
			'parent_id':'statusbar',
			'id':'status_rollup',
			'className':'roll_up_div',
			'roll_up_class':'rollup',
			'roll_up_name':'status_rollup',
			'arrow_img':'/static/xtcpd/img/arrow-dn.png',
			'roll_up_icon_src':'/static/xtcpd/img/arrow-dn.png',
			'checkboxCB':allnone_checkboxCB,//note:external to $this
			'select_rollupCB':allnone_select_rollupCB,//note:external to $this
			'checkboxSRC':'/static/xtcpd/img/checkbox-1.png',
			'clients':window.clients_widget.get_clients(),
		};
		me.allnone_rollup=new RollUpDiv(opts);
		me.allnone_rollup.label.innerHTML=me.mkstatus();

		$("#allnone_icon").click(function(e){
			//COLLAPSE
			if(!me.allnone_rollup.expanded){
				console.log("collapsing");
				for(var kidx=0;kidx<me.rollups['keys'].length;kidx++){
					var key=me.rollups['keys'][kidx];
					if(me.rollups[key].expanded){
						console.log("collapsing: "+me.rollups[key].rollup.id);
						$("#"+me.rollups[key].rollup.id).animate({height:'toggle'},300,function(){});
						$("#"+me.rollups[key].roll_up_icon.id).toggleClass("up");
						me.rollups[key].expanded=false;
					}
					else{
						console.log("already collapsed: "+me.rollups[key].rollup.id)
					}
				}
			}
			//EXPAND
			else{
			console.log("expanding");
			console.log(e.target.id+", "+me.rollups['keys'].length);
			for(var kidx=0;kidx<me.rollups['keys'].length;kidx++){
				var key=me.rollups['keys'][kidx];
				if(!me.rollups[key].expanded){
					console.log("expanding: "+me.rollups[key].rollup.id);
					$("#"+me.rollups[key].rollup.id).animate({height:'toggle'},300,function(){});
					$("#"+me.rollups[key].roll_up_icon.id).toggleClass("up");
					me.rollups[key].expanded=true;
				}
				else{
					console.log("already expanded: "+me.rollups[key].rollup.ip)
				}
			}//for
			}//else expand
		});
	}
	me.deselect_all_rollups=function(){
		console.log("spectra_widget.deselect_all_rollups");
		for(var kidx=0;kidx<me.rollups['keys'].length;kidx++){
			var key=me.rollups['keys'][kidx];
			console.log(key);
			me.rollups[key].deselect();

			var netrange=me.rollups[key]['opts']['id'];
			while(netrange.indexOf(".")>-1)
				netrange=netrange.replace(".","ZZZ");
			console.log(netrange+" setting to green");
			if($("."+netrange).hasClass("marker_default_hilite"))
				$("."+netrange).removeClass("marker_default_hilite");
//			d3.selectAll("."+netrange).style("border","3px solid #00FF00");
		}
		$(".focus_marker").addClass("hide");
	}
	me.render_data=function(data){
		for(var kidx=0;kidx<data['data']['keys'].length;kidx++){
			var netrange=data['data']['keys'][kidx];
			if(me.data['keys'].indexOf(netrange)<0){
				me.data['keys'].push(netrange);
				me.data[netrange]=data['data'][netrange];//copy entire sub-{}
				var sanitized=netrange;
				for(var dummy=0;dummy<8;dummy++)
					sanitized=sanitized.replace(".","ZZZ");

				var ip_key=me.data[netrange]['ips']['keys'][0];//
				var roll_up_name=netrange+"<br>"+me.data[netrange]['ips'][ip_key]['city']+", ";
				roll_up_name+=me.data[netrange]['ips'][ip_key]['country_name'];

				var opts={
					'category':sanitized,
					'netrange':netrange,
					'parent_id':'selectra2',
					'id':"nr-"+netrange,
					'className':'roll_up_div',
					'roll_up_class':'rollup',
					'roll_up_name':roll_up_name,
					'arrow_img':'/static/xtcpd/img/arrow-dn.png',
					'roll_up_icon_src':'/static/xtcpd/img/arrow-dn.png',
					'checkboxCB':checkboxCB,//note:external to $this
					'select_rollupCB':select_rollupCB,//note:external to $this
					'checkboxSRC':'/static/xtcpd/img/checkbox-1.png',
					'clients':[],//me.data[netrange]['ips'][ip_key]['src'],//ADD THEM AS THE OCCUR!
				};
				var rollup=new RollUpDiv(opts);
				me.rollups["nr-"+netrange]=rollup;
				me.rollups["keys"].push("nr-"+netrange);

				var lt=document.createElement("table");//lt=LayersTable
				lt.className="layer_table";
				lt.id=netrange+"_layer_table";

				var ips=data['data'][netrange]['ips']['keys'];//incoming list
				for(var idx=0;idx<ips.length;idx++){//cycle over incoming ips
					var ip=ips[idx];
					var src_ip=data['data'][netrange]['ips'][ip]['src'];
					var dst_ip=data['data'][netrange]['ips'][ip]['dst'];
					if(me.rollups["nr-"+netrange].opts['clients'].indexOf(src_ip)<0){
						console.log("adding swatch for ip="+src_ip);
						me.rollups["nr-"+netrange].add_swatch(src_ip);
					}

					//STILL NEED: layer_table rows only single swatch possible still
					//needs to be obj with opts like rollup and methods for add swatch
					var layer_name=ip;
					var r=lt.insertRow(-1);
					var c=r.insertCell(-1);
					c.className='roll_up_icon';//25px indent
					c=r.insertCell(-1);
					c.className='layer_table_indent';
					var swatch_table_div=document.createElement("div");
					var swatch_table=document.createElement("table");
					var sr=swatch_table.insertRow(-1);
					sr.id="sr-"+dst_ip;
					var sc=sr.insertCell(-1);
					sc.id="sc-"+src_ip+"to"+dst_ip;
					var swatch_div=document.createElement("div");
					swatch_div.innerHTML="";
					var src_color=window.clients_widget.get_color(src_ip);
					var src_device=window.clients_widget.get_device(src_ip);
					swatch_div.innerHTML+=mkswatchcode(src_color,src_device,src_ip);
					sc.appendChild(swatch_div);

					swatch_table_div.appendChild(swatch_table);
					c.appendChild(swatch_table_div);
					//
					c=r.insertCell(-1);
					var ip_label=document.createElement("div");
					ip_label.id=ip+"ip_label";

					ip_label.innerHTML="<a title='"+src_ip+"->"+dst_ip+"'>"+ip+"</a>&nbsp;";
					ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a> &nbsp;";
					ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['city']+"</a> &nbsp;";
					ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a> &nbsp;";
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
					//our list
					if(me.data[netrange]['ips']['keys'].indexOf(ip)<0){
						//NEED:insert new select option into corresponding netrange rollup
						me.data[netrange]['ips'][ip]=data['data'][netrange]['ips'][ip];
						me.data[netrange]['ips']['keys'].push(ip);
						var src_ip=data['data'][netrange]['ips'][ip]['src'];
						var dst_ip=ip;//=data['data'][netrange]['ips'][ip]['dst'];
						var swatch_color=window.clients_widget.get_color(src_ip);
						var client_device=window.clients_widget.get_device(src_ip);
						var lt=document.getElementById(netrange+"_layer_table");
						var layer_name=ip;
						var r=lt.insertRow(-1);
						var c=r.insertCell(-1);
						c.className="roll_up_icon";
						c=r.insertCell(-1);
						c.className='layer_table_indent';//swatches should go here
						var swatch_table_div=document.createElement("div");
						var swatch_table=document.createElement("table");
						var sr=swatch_table.insertRow(-1);
						sr.id="sr-"+dst_ip;
						var sc=sr.insertCell(-1);
						sc.id="sc-"+src_ip+"to"+dst_ip;
						var swatch_div=document.createElement("div");
						swatch_div.innerHTML="";
						console.log(src_ip+" -> "+dst_ip+" == "+ip);
						swatch_div.innerHTML+=mkswatchcode(swatch_color,client_device,src_ip);
						sc.appendChild(swatch_div);

						swatch_table_div.appendChild(swatch_table);
						c.appendChild(swatch_table_div);
						//
						c=r.insertCell(-1);
						var ip_label=document.createElement("div");
						ip_label.id=ip+"ip_label";
						ip_label.innerHTML="<a title='"+src_ip+"->"+dst_ip+"'>"+ip+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a> &nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['city']+"</a> &nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a> &nbsp;";
						ip_label.className="ip_label";
						c.appendChild(ip_label);
						window.map_widget.add_point(me.data[netrange]['ips'][ip]);
					}
					else{
						try{
						me.data[netrange]['ips'][ip]['count']+=data['data'][netrange]['ips'][ip]['count'];
						var target_idx=0;
						var src_ip=data['data'][netrange]['ips'][ip]['src'];
						var dst_ip=data['data'][netrange]['ips'][ip]['dst'];
						if(me.rollups["nr-"+netrange].opts['clients'].indexOf(src_ip)<0){
							console.log("adding swatch for ip="+src_ip);
							me.rollups["nr-"+netrange].add_swatch(src_ip);
						}
						//check this swatch now
						var sc_id="sc-"+src_ip+"to"+dst_ip;
						console.log("checking for sc_id="+sc_id);
						if(!document.getElementById(sc_id)){
							console.log(sc_id+" not found");
							var swatch_color=window.clients_widget.get_color(src_ip);
							var client_device=window.clients_widget.get_device(src_ip);
							if(!swatch_color)continue;
							var sr_id="sr-"+dst_ip;
							var sr=document.getElementById(sr_id);
							var sc=sr.insertCell(-1);
							sc.id=sc_id;
							var swatch_div=document.createElement("div");
							swatch_div.innerHTML="";
							console.log(src_ip+" -> "+dst_ip+" == "+ip);
							swatch_div.innerHTML+=mkswatchcode(swatch_color,client_device,src_ip);
							sc.appendChild(swatch_div);
						}

						var ip_label=document.getElementById(ip+"ip_label");
						ip_label.innerHTML="<a title='"+src_ip+"->"+dst_ip+"'>"+ip+"</a>&nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['count']+"</a> &nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['city']+"</a> &nbsp;";
						ip_label.innerHTML+="<a>"+me.data[netrange]['ips'][ip]['country_code']+"</a> &nbsp;";
						ip_label.className="ip_label";
						}catch(e){console.log(e);}
					}
				}
			}
		}//for netrange in keys

		//put up some useful statistics:
		var status=me.mkstatus();
		console.log(status);
		me.allnone_rollup.label.innerHTML=status;

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
