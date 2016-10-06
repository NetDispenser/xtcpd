var ClientsDaemonUI=function(){
	me={};
	me.data={'keys':[],};
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
	me.get_color=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0)return "#FF0000";
		return me.data[client_ip]['color'];
	}
	me.render_data=function(data){
		console.log("clients.render_data()");
		var current_keys=[];
		//for(var idx=0;idx<data['lines'].length;idx++){
		for(var idx=0;idx<data.length;idx++){
			if(data[idx].length<3){continue};
			var client_ip=data[idx];
			current_keys.push(client_ip);
			if(me.data['keys'].indexOf(client_ip)<0){//This section adds
				me.data['keys'].push(client_ip);
				console.log("added "+client_ip);
				var color;
				var client_colors=["#0F0","#F00","#00F","#FF0","#0FF","#F0F",];
				if(client_ip=="192.168.66.127")color=client_colors[0];
				else if(client_ip=="192.168.66.114")color=client_colors[1];
				else if(me.data['keys'].length<client_colors.length)color=client_colors[me.data['keys'].length-1];
				else color=mkrandomcolor();
				me.data[client_ip]={'raw':data[idx],'color':color,};
				//var tstamp=data['lines'][idx][0];
				//var _mac_addr=data['lines'][idx][1];
				//var ip_num=data['lines'][idx][2];
				//var device_name=data['lines'][idx][3];
				//var mac_addr=data['lines'][idx][4];

				me.data[client_ip]['device']="unk device";//me.data[client_ip]['raw'][3];

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
		}
		for(var idx=0;idx<me.data['keys'].length;idx++){//This section preps4 delete
			var key=me.data['keys'][idx];
			if(current_keys.indexOf(key)<0 && !document.getElementById("delete "+key)){
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
