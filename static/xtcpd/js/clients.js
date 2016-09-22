var ClientsDaemonUI=function(){
	me={};
	me.data={'keys':[],};
	me.table=document.getElementById("clients_table");//pass-in as arg
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
	me.mkswatchcode=function(c){
		var rval="<div style='width:20px;height:20px;background-color:"+c+";'>";
		rval+="</div>";
		return rval;
	}
	me.get_color=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0)return "#FF0000";
		return me.data[client_ip]['color'];
	}
	me.render_data=function(data){
		var current_keys=[];
		for(var idx=0;idx<data['lines'].length;idx++){
			if(data['lines'][idx].length<3){continue};
			var client_ip=data['lines'][idx][2];
			current_keys.push(client_ip);
			if(me.data['keys'].indexOf(client_ip)<0){//add new clients
				me.data['keys'].push(client_ip);
				me.data[client_ip]={'raw':data['lines'][idx],'color':mkrandomcolor(),};
				console.log('NEED ADD THIS CLIENT '+client_ip);
				var r=me.table.insertRow(-1);
				r.id="row_"+client_ip;
				var c=r.insertCell(-1);
				var d=document.createElement("div");
				var src_id='src_'+client_ip;
				d.id=src_id;
				d.innerHTML=client_ip+" "+me.data[client_ip]['raw'][3].slice(0,12);
				var swatch_code=me.mkswatchcode(me.data[client_ip]['color']);
				d.innerHTML+=swatch_code;
				c.appendChild(d);
			}
		}
		for(var idx=0;idx<me.data['keys'].length;idx++){
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
