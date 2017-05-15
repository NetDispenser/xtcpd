
var client_colors=["#5F5","#FF5","#F55","#AAF","#5FF","#F5F",];
var transparent_colors=[
	"rgba(85,255,85,0.2)",
	"rgba(255,255,85,0.2)",
	"rgba(255,85,85,0.2)",
	"rgba(170,170,255,0.2)",
	"rgba(85,255,255,0.2)",
	"rgba(255,85,255,0.2)",
];
var ClientsDaemonUI=function(){
	var me={};
	me.data={
		'keys':['192.168.22.1','176.58.90.212',],
		'176.58.90.212':{
			'color':client_colors[0],
			'transparent_color':transparent_colors[0],
			'device':'LAN-Watch FR',
			'raw':'',
			'tstamp':'',
			'_mac_addr':'',
			'ip_num':'176.58.90.212',
			'mac_addr':'',
		},
    '192.168.22.1':{
      'color':client_colors[1],
      'transparent_color':transparent_colors[1],
      'device':'Raspberry-Pi3',
      'raw':'',
      'tstamp':'',
      '_mac_addr':'',
      'ip_num':'192.168.22.1',
      'mac_addr':'',
    },
	};
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
	me.get_transparent_color=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0){
			return null;
		}
		return me.data[client_ip]['transparent_color'];
	}
	me.get_device=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0)return null;
		try{return me.data[client_ip]['device'];}
		catch(e){return "UNK";}
	}
	me.get_color=function(client_ip){
		if(me.data['keys'].indexOf(client_ip)<0){
			return null;
		}
		return me.data[client_ip]['color'];
	}
	me.add_row=function(client_ip){
		console.log('adding row for '+client_ip);
		var r=me.table.insertRow(-1);
		r.id="row_"+client_ip;
		var c=r.insertCell(-1);
		c.style.width="20%";
		c.style.position="relative";
		c.style.left="20px";
		var swatch_code=mkswatchcode(me.data[client_ip]['color'],me.data[client_ip]['device'],client_ip);
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
		var color,transparent_color;

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
				if(me.data['keys'].length<client_colors.length){
					color=client_colors[me.data['keys'].length-1];
					transparent_color=transparent_colors[me.data['keys'].length-1];
				}
				else{color=mkrandomcolor();transparent_color=color;}//FIXME
				me.data[ip_num]={
					'raw':dnsmasq_data['lines'][idx],
					'color':color,
					'transparent_color':transparent_color,
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
				if(me.data['keys'].length<client_colors.length){
					color=client_colors[me.data['keys'].length-1];
					transparent_color=transparent_colors[me.data['keys'].length-1];
				}
				else{
					color=mkrandomcolor();
					transparent_color=color;
				}
				me.data[client_ip]={'raw':spectra_data[idx],'color':color,'transparent_color':transparent_color,};
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
//	me.add_row('176.58.90.212');
	me.add_row('192.168.22.1');
	return me;
}
