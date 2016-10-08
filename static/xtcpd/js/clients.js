var client_colors=["#FF0","#0F0","#F00","#00F","#0FF","#F0F",];
var ClientsDaemonUI=function(){
	var me={};
	me.data={'keys':[],};
	me.current_keys=[];
	me.table=document.getElementById("clients_table");//pass-in as arg
	me.clear=function(){
		console.log("clients.clear()");
		me.data={'keys':[],};
	}
	me.setup=function(){
		console.log("ClientsDaemonUI.setup");
		return me;
	}
	me.unhilite=function(){
		for(var kidx=0;kidx<me.data['keys'].length;kidx++){
			var client_ip=me.data['keys'][kidx];
			var src_id="src_"+client_ip;
			var src_label=document.getElementById(src_id);
			src_label.style.background="#CCCCCC";
			src_label.style.color="#000000";
		}
	}
	me.device_by_ip=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0)return "unknown device";
		return me.data[client_ip]['raw'][3];
	}
	me.hilite_src=function(src_ip){
		me.unhilite();
		var src_id="src_"+src_ip;
		console.log(src_id);
		try{
			var src_label=document.getElementById(src_id);
			src_label.style.background="#555555";
			src_label.style.color="#FFFFFF";
		}
		catch(e){}
	}
	me.get_clients=function(){
		try{return me.data['keys'];}
		catch(e){return [];}
	}
	me.get_color=function(client_ip){
		console.log()
		if(me.data['keys'].indexOf(client_ip)<0){
			if(client_ip=="192.168.66.1"){return client_colors[0];}
			console.log("returning null for "+client_ip)
			return null;
		}
		return me.data[client_ip]['color'];
	}
	me.add_row=function(client_ip){
		var r=me.table.insertRow(-1);
		r.id="row_"+client_ip;
		var c=r.insertCell(-1);
		var swatch_code=mkswatchcode(me.data[client_ip]['color']);
		var d=document.createElement("div");
		d.innerHTML=swatch_code;
		c.appendChild(d);

		c=r.insertCell(-1);
		d=document.createElement("div");
		d.innerHTML=client_ip;
		c.appendChild(d);

		c=r.insertCell(-1);
		d=document.createElement("div");
		d.innerHTML=me.data[client_ip]['device'].slice(0,12);
		c.appendChild(d);
	}
	me.render_data=function(spectra_data,dnsmasq_data){
		console.log("clients.render_data()");
		var color;

		if(!me.data){
			console.log("remaking data!");
			me.clear();
			console.log(me.data);
		}
		me.current_keys=[];
		console.log(dnsmasq_data);
		for(var idx=0;idx<dnsmasq_data['lines'].length;idx++){
			var tstamp=dnsmasq_data['lines'][idx][0];
			var _mac_addr=dnsmasq_data['lines'][idx][1];
			var ip_num=dnsmasq_data['lines'][idx][2];
			var device_name=dnsmasq_data['lines'][idx][3];
			var mac_addr=dnsmasq_data['lines'][idx][4];
			if(me.data['keys'].indexOf(ip_num)<0){
				me.data['keys'].push(ip_num);
				if(ip_num=="192.168.66.127")color=client_colors[1];
				else if(ip_num=="192.168.66.114")color=client_colors[2];
				else if(ip_num=="192.168.66.1")color=client_colors[0];
				else if(me.data['keys'].length<client_colors.length)color=client_colors[me.data['keys'].length-1];
				else color=mkrandomcolor();
				me.data[ip_num]={
					'raw':dnsmasq_data['lines'][idx],
					'color':color,
					'tstamp':tstamp,
					'_mac_addr':_mac_addr,
					'ip_num':ip_num,
					'device':device_name,
					'mac_addr':mac_addr,
				};
				me.add_row(ip_num);
			}
		}
		for(var idx=0;idx<spectra_data.length;idx++){
			if(spectra_data[idx].length<3){continue};
			var client_ip=spectra_data[idx];
			console.log("clients.render_data client_ip "+client_ip);
			me.current_keys.push(client_ip);
			if(me.data['keys'].indexOf(client_ip)<0){//This section adds
				me.data['keys'].push(client_ip);
				console.log("added "+client_ip);
				if(client_ip=="192.168.66.127")color=client_colors[1];
				else if(client_ip=="192.168.66.114")color=client_colors[2];
				else if(client_ip=="192.168.66.1")color=client_colors[0];
				else if(me.data['keys'].length<client_colors.length)color=client_colors[me.data['keys'].length-1];
				else color=mkrandomcolor();
				me.data[client_ip]={'raw':spectra_data[idx],'color':color,};
				//var tstamp=data['lines'][idx][0];
				//var _mac_addr=data['lines'][idx][1];
				//var ip_num=data['lines'][idx][2];
				//var device_name=data['lines'][idx][3];
				//var mac_addr=data['lines'][idx][4];

				me.data[client_ip]['device']="unk device";//me.data[client_ip]['raw'][3];
				me.add_row(client_ip);
			}
		}
/*
		for(var idx=0;idx<me.data['keys'].length;idx++){//This section preps4 delete
			var key=me.data['keys'][idx];
			if(me.current_keys.indexOf(key)<0 && !document.getElementById("delete "+key)){
				console.log("NEED: Fade2Inactive and Red Remove Button to remove once seen.");
				var src_ip="src_"+key;
				var d=document.getElementById(src_ip);
				var delB=document.createElement('input');
				delB.type="button";
				delB.value="X";
				delB.style.background="#CC4444";
				delB.style.color="#CCCCCC";
				delB.id="delete "+key;
				delB.addEventListener("click",me.delCB,false);
				d.appendChild(delB);
			}
		}
*/
	}
	me.delCB=function(e){
		var target_ip=e.target.id.split(" ")[1];
		var target_id="row_"+target_ip;
		var target_element=document.getElementById(target_id);
		target_element.parentNode.removeChild(target_element);
		var idx2pop=me.data['keys'].indexOf(target_ip);
		for(var dummy=0;dummy<idx2pop;dummy++){
			me.data['keys'].push(me.data['keys'].shift());
		}
		var garbage=me.data['keys'].shift()
		delete me.data[target_ip];
		console.log("all traces removed");
	}
	return me;
}
