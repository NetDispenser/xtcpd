var Overview=function(latlon){
	
	var me={};
	
	me.DEMO=true;
	me.LATLON=latlon;
	
	me.RUNNING=0;
	me.TIMEOUT=5000;
	me.CLIENT_BUFFSIZE=100;
	me.APACHE_DATA=new Array();
	me.TRAFFIC_DATA=new Array();
	me.DJANGO_DATA=new Array();
	me.TCP_DATA=new Array();
	me.GEOIP_DATA={"keys":[],};
	me.SRC_COLORS=new Array();
	
	me.SRCS=new Array();
	me.SRCS.push("Django");//This reserves the 0th row
	me.DESTS={};
	me.SRC_COUNTS={};
	
	me.VFUDGE=0;
	me.W_TCP_RECT=5;
	me.H_TCP_RECT=100;
	me.EXPANDED=false;
	var PAD=20.;
	
//	me.MESSAGES_COLOR="#55AAFF";
//	me.APACHE_COLOR="#F775FF";
	me.DJANGO_COLOR="#ff7a68";
	me.SRC_COLORS.push(me.DJANGO_COLOR);
	me.SRC_COLORS.push("#00FFAA");
	me.SRC_COLORS.push("#ffb267");
	me.SRC_COLORS.push("#dc92ff");
	me.SRC_COLORS.push("#6e9bff");
	me.SRC_COLORS.push("#FF00AA");
	
	me.LAST_LOADED=null;
	
	me.engageCB=function(e){
		if(me.RUNNING==0){
			document.getElementById("engageB").checked=1;
			me.RUNNING=1;
			me.update();
		}
		else{
			document.getElementById("engageB").checked=0;
			me.RUNNING=0;
		}
	}
	me.mkUnits=function(bps){
		units=[' b/s',' kb/s',' Mb/s',' Gb/s',' Tb/s',' Eb/s'];
		var uidx=0;
		while(bps.length>3){
			bps=bps.slice(0,-3);
			uidx+=1;
		}
		label=bps+units[uidx];
		return label;
	}
	me.map_stuff=function(){
		var canvas=document.getElementById("canvas");
		var cW=canvas.clientWidth;
		var cH=canvas.clientHeight;
		var AR=cW/cH;
		
		var ctx=canvas.getContext("2d");
		ctx.canvas.width  = cW;
	  	ctx.canvas.height = cH;
		ctx.globalAlpha = 1.0;
		
		ctx.lineWidth="1.0";
		ctx.font='10px sans-serif';
		ctx.strokeStyle='#00FF00';
		ctx.fillStyle = '#00FF00';
		
		var xc=cW/2.;
		var yc=cH/2.;
		var LATLON=me.LATLON
		
		ctx.drawImage(window.mapimage,0-LATLON[0]*window.mapimage.width/360.,0,window.mapimage.width,window.mapimage.height);
		ctx.drawImage(window.mapimage,-1*window.mapimage.width-1*LATLON[0]*window.mapimage.width/360.,0,window.mapimage.width,window.mapimage.height);

		//x'=x+106 (for las cruces, nm)
		var x0=parseInt(xc+( LATLON[0]+121.886 )/180.*cW/2.);
		var y0=parseInt(yc-LATLON[1]/90.*cH/2.);
		
		var loc="SanJose";//"LasCruces"
		ctx.fillText(loc,x0,y0);
		ctx.stroke();
		
		for(var gidx=0;gidx<me.GEOIP_DATA['keys'].length;gidx++){
			ctx.beginPath();
			ctx.moveTo(x0,y0);
			
			var x1;
			var lon=me.GEOIP_DATA[ me.GEOIP_DATA['keys'][gidx] ]['lon'];
			if( lon > (LATLON[0]+180.) )lon-=360.;
			x1=xc+(lon+121.886)/180.*cW/2.;
			
			var y1=yc-me.GEOIP_DATA[ me.GEOIP_DATA['keys'][gidx] ]['lat']/90.*cH/2.;
			ctx.lineTo(x1,y1);
			ctx.fillText(me.GEOIP_DATA[ me.GEOIP_DATA['keys'][gidx] ]['city'],x1,y1);
			ctx.stroke();
		}
	}
	me.render=function(x){
		var pyld=JSON.parse(decode(x));
		
		if(me.DEMO==true){
			//normally we assumed single client and passed economical minimum of new data
			//with multi-clients (potentially) we need to pass whole buffer each call so
			//everyone can see whole buffer ... hence this DEMO==true section:
			me.TRAFFIC_DATA=pyld['traffic_data'];
			me.TCP_DATA=pyld['tcp_data'];
			me.DJANGO_DATA=pyld['django_data'];
		}
		else{
			me.TRAFFIC_DATA=me.TRAFFIC_DATA.concat(pyld['traffic_data']);
			me.TCP_DATA=me.TCP_DATA.concat(pyld['tcp_data']);
			me.DJANGO_DATA=me.DJANGO_DATA.concat(pyld['django_data']);
		}
		var keys=pyld['geoip_buffer']['keys'];
		//var d=document.getElementById("details");
		//d.innerHTML="";
		for(var kidx=0;kidx<keys.length;kidx++){
			var key=keys[kidx];
			//d.innerHTML+=key+"<br>";
			try{
			if(me.GEOIP_DATA['keys'].indexOf(key)<0){
				me.GEOIP_DATA[key]=pyld['geoip_buffer'][key];
				me.GEOIP_DATA['keys'].push(key);
				//plot the new destination on map overlay:
				
			}
			}catch(e){console.log(e);}
		}

		var t0=pyld['t1']-me.CLIENT_BUFFSIZE;
		var targets=[me.TRAFFIC_DATA,me.TCP_DATA,me.DJANGO_DATA,];//me.APACHE_DATA,
		var shift_count=0;
		for(var tidx=0;tidx<targets.length;tidx++){
			while(true){
				if(targets[tidx].length==0)break;
				msg=targets[tidx][0].split(",");
				t=parseFloat(msg[0]);
				if(t<t0){
					targets[tidx].shift();
					shift_count+=1;
				}
				else break;
			}
		}

		me.map_stuff();
		me.traffic_stuff( pyld['t1'] );
		me.tcp_stuff(pyld['t1']);

	}
	me.traffic_stuff=function(t1){
		
		var canvas=document.getElementById("canvas");
		
		var cW=canvas.clientWidth;
		var cH=canvas.clientHeight;
		var AR=cW/cH;
		var VHEIGHT=parseInt(0.25*cH-2.*PAD);
		var t0=t1-me.CLIENT_BUFFSIZE;
		
		//get vertical range for traffic data scale:
		var ymax=0.;
		var ymin=0.;
		var ecount=0;
		var wcount=0;
		var drxdt;
		var dtxdt;
		for(var tidx=0;tidx<me.TRAFFIC_DATA.length;tidx++){
			try{
				split_msg=me.TRAFFIC_DATA[tidx].split(",");
				ifpyld=split_msg[2].split(" ");
				//ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				if(drxdt>ymax)ymax=drxdt;
				if(dtxdt>ymax)ymax=dtxdt;
			}
			catch(e){
				//console.log(e);
			}
		}
		
		var dy=ymax-ymin;
		
		var ctx=canvas.getContext("2d");
		
		ctx.lineWidth="1.0";
		if(AR>1)ctx.font = '12pt sans-serif';
		else ctx.font='10px sans-serif';
		ctx.strokeStyle='#CCCCCC';
		ctx.fillStyle = '#CCCCCC';
		ctx.fontWeight = 'bold';
		
		ctx.strokeStyle='#CCCCCC';
		
		var VOFFSET=parseInt(cH-PAD-VHEIGHT);
		ctx.fillText(me.mkUnits(parseInt(dy/1).toString()),0,VOFFSET+PAD+0.*VHEIGHT/4.);
		ctx.beginPath();
		ctx.moveTo(3*PAD,VOFFSET+PAD+0*VHEIGHT/4.);
		ctx.lineTo(cW-3*PAD,VOFFSET+PAD+0*VHEIGHT/4.);
		ctx.stroke();
		
		ctx.fillText(me.mkUnits(parseInt(dy/2).toString()),0,VOFFSET+PAD+2*VHEIGHT/4.);
		ctx.beginPath();
		ctx.moveTo(3*PAD,VOFFSET+PAD+2.*VHEIGHT/4.);
		ctx.lineTo(cW-3*PAD,VOFFSET+PAD+2.*VHEIGHT/4.);
		ctx.stroke();
	
		ctx.fillText(me.mkUnits(parseInt(0).toString()),0,VOFFSET+PAD+4.*VHEIGHT/4.);
		ctx.moveTo(3*PAD,VOFFSET+PAD+4.*VHEIGHT/4.);
		ctx.lineTo(cW-3*PAD,VOFFSET+PAD+4.*VHEIGHT/4.);
		ctx.stroke();
		
		ctx.lineWidth="1.0";
		//ctx.strokeStyle='#FF5E87';
		ctx.moveTo(PAD,0);
		ctx.beginPath();
		for(var tidx=0;tidx<me.TRAFFIC_DATA.length;tidx++){
			
			try{
			split_msg=me.TRAFFIC_DATA[tidx].split(",");
			
			t=parseFloat(split_msg[0]);
			xc=3*PAD+(t-t0)/(t1-t0)*(cW-6*PAD);
			if(xc<3*PAD)continue;
			
			ifpyld=split_msg[2].split(" ");
			ifname=ifpyld[0];
			if(ifname=="wlan0")ctx.strokeStyle='#FF5E87';
			else ctx.strokeStyle='#0000FF';
			drxdt=parseInt(ifpyld[1]);
			dtxdt=parseInt(ifpyld[2]);
			
			ctx.lineTo(xc,VOFFSET+PAD+VHEIGHT-VHEIGHT*(0.+drxdt/dy));
			ctx.stroke();
			ctx.moveTo(xc,VOFFSET+PAD+VHEIGHT-VHEIGHT*(0.+drxdt/dy));
			}
			catch(e){
				//console.log(e);
			}
		}		
	
		ctx.lineWidth="1.0";
		//ctx.strokeStyle='#00AAFF';
		ctx.moveTo(PAD,0);
		ctx.beginPath();
		//ctx.globalAlpha=0.5;
		for(var tidx=0;tidx<me.TRAFFIC_DATA.length;tidx++){
			
			try{
			split_msg=me.TRAFFIC_DATA[tidx].split(",");
			
			t=parseFloat(split_msg[0]);
			xc=3*PAD+(t-t0)/(t1-t0)*(cW-6*PAD);
			if(xc<PAD)continue;
			
			ifpyld=split_msg[2].split(" ");
			ifname=ifpyld[0];
			if(ifname=="wlan0")ctx.strokeStyle='#00AAFF';
			else ctx.strokeStyle='#FFFF00';
			drxdt=parseInt(ifpyld[1]);
			dtxdt=parseInt(ifpyld[2]);
			
			ctx.lineTo(xc,VOFFSET+PAD+VHEIGHT-VHEIGHT*(0+dtxdt/dy));
			ctx.stroke();
			ctx.moveTo(xc,VOFFSET+PAD+VHEIGHT-VHEIGHT*(0+dtxdt/dy));
			}
			catch(e){
				//console.log(e);
			}
		}		
		
	}
	me.update=function(){
		xhr=new_xhr();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					try{
						me.render(xhr.responseText);
						if(me.RUNNING==1){
							setTimeout("window.theOverviewInstance.update()",me.TIMEOUT);//NEED: TIMEOUT->database value in user profile
						}
					}catch(e){alert(e);alert(xhr.responseText.length);alert(xhr.responseText);}
				}
			}
		}
		xhr.open('GET',"/services/overview_data",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send("");
	}
	me.load_channelCB=function(e){
		//alert(JSON.stringify(me.SRC_COUNTS));
		try{
			var eid;
			if(e==null){
				eid=me.LAST_LOADED;
			}
			else{
				eid=e.target.id;
			}
			if(!eid)return;
			
			sidx=me.SRCS.indexOf(eid);
			src=me.SRCS[sidx];
			me.LAST_LOADED=eid;
			
			d=document.getElementById("info_panel2");
			d.style.color=me.SRC_COLORS[sidx];
			d.innerHTML="";
			
			if(src=='Django'){
				for(var midx=0;midx<me.DJANGO_DATA.length;midx++){
					msg=me.DJANGO_DATA[midx];
					d.innerHTML+=msg+"<br><br>";
				}
			}
			else{
				//alert(JSON.stringify(me.DESTS));
				for(var kidx=0;kidx<me.DESTS[src]['dest_keys'].length;kidx++){
					key=me.DESTS[src]['dest_keys'][kidx];
					d.innerHTML+="<a class='dest' style='text-decoration:none;' target='_blank' href='http://"+key+"'>"+key+"</a> ("+me.DESTS[src][key]+")<br>";
				}
			}
		}catch(e){
			document.getElementById("info_panel2").innerHTML=e;
		}
		
		
	}
	me.launchCB=function(e){
		//alert(e.target.id);
		//url="http://"+e.target.id;
		//var win = window.open(url,'_blank');
		me.LAST_LOADED=null;
		d=document.getElementById("info_panel2");
		d.innerHTML="";
		//d.innerHTML+=e.target.title+"<br>";
		try{
			
			pyld=document.getElementById(e.target.id).firstChild.value.split(",");
			src=pyld[2];
			
			if(src=="Apache"){
				d.style.color=me.APACHE_COLOR;
				d.innerHTML+=document.getElementById(e.target.id).firstChild.value.split("Apache,")[1];
			}
			else if(src=="Django"){
				d.style.color=me.DJANGO_COLOR;
				d.innerHTML=document.getElementById(e.target.id).firstChild.value.split("Django,")[1];
			}
			else if(src=="Messages"){
				d.style.color=me.MESSAGES_COLOR;
				d.innerHTML=document.getElementById(e.target.id).firstChild.value;
			}
			else{
				raw_time=pyld[0];
				tstamp=pyld[1];
				dest=pyld[3];
				sidx=me.SRCS.indexOf(src);
				d.style.color=me.SRC_COLORS[sidx];
				if(me.DESTS[src]['dest_keys'].indexOf(dest)>-1)
					d.innerHTML+="<a target='_blank' class='dest' href='http://"+dest+"'>"+dest+"</a>"+" ("+me.DESTS[src][dest]+")<br>";
			}
		
		}
		catch(e){d.innerHTML+=e;}
	}
	me.mkhidden=function(hval){
		dummy=document.createElement("input");
		dummy.type="hidden";
		dummy.value=hval;
		return dummy;
	}
	me.tcp_stuff=function(t1){
		
		var ib=document.getElementById("rhs_panel");
		//ib.style.background="red";
		var cW=ib.clientWidth;
		var cH=ib.clientHeight;
		
		var html="";
		var t0=t1-me.CLIENT_BUFFSIZE;

		for(var sidx=0;sidx<me.SRCS.length;sidx++){
			try{me.SRC_COUNTS[me.SRCS[sidx]]=0;}
			catch(e){;}
		}
		for(var tidx=0;tidx<me.TCP_DATA.length;tidx++){
			//NEED:mv draw to here ... new SRCS just go down a line as they would if already defined
			msg=me.TCP_DATA[tidx].split(",");
			t=parseFloat(msg[0]);
			
			src_device=msg[2];
			//dst_device=msg[3]
			
			//if(src=="0.0.0.0")continue;
			
			try{
				dummy=me.SRCS.indexOf(src_device);
				if(dummy<0){
					me.SRCS.push(src_device);
					me.SRC_COUNTS[src_device]=1;
				}
				else{
					me.SRC_COUNTS[src_device]+=1;
				}
			}catch(e){
				html+=e;
			}
		}
		me.SRC_COUNTS['Django']=me.DJANGO_DATA.length;
		
		srcs=document.getElementById("lhs_panel");
		//srcs.style.width=parseInt(Math.floor(0.3*cW))+"px";
		//srcs.style.height="200px";
		srcs.innerHTML="";
		for(var sidx=0;sidx<me.SRCS.length;sidx++){
			//srcs.innerHTML+="<a href='' class='src_link'>"+me.SRCS[sidx]+"</a><br>";
			
			dummy=document.createElement("div");
			b=document.createElement("b");
			t=document.createTextNode(me.SRCS[sidx]);
			b.appendChild(t);
			
			b.id=me.SRCS[sidx];
			b.className="traffic_src";
			b.style.color=me.SRC_COLORS[sidx];
			b.addEventListener("click",me.load_channelCB,false);
			
			dummy.appendChild(b);
			
			b=document.createElement("b");
			b.style.color="#CCCCCC";
			t=document.createTextNode(" ("+me.SRC_COUNTS[me.SRCS[sidx]]+")");
			b.appendChild(t);
			dummy.appendChild(b);
			
			dummy.style.position="absolute";
			dummy.style.left=PAD+"px";
			
			srcs.appendChild(dummy);
			srcs.appendChild(document.createElement("br"));
		}
/*
		var Wp=window.innerWidth;
		var Hp=window.innerHeight;
		details=document.getElementById("info_panel2");
		details.style.width=parseInt(Math.floor(0.35*Wp))+"px";
		details.style.height="200px";
		//details.innerHTML=me.TCP_DATA[0];
		
		system=document.getElementById("system");
		system.style.width=parseInt(Math.floor(0.35*Wp))+"px";
		system.style.height="200px";
		
		var num_srcs=me.SRCS.length;
		html+="num_srcs="+num_srcs+"<br>";
*/		
		ib.innerHTML="";
		if(me.EXPANDED)
			ib.style.height=num_srcs*me.H_TCP_RECT+"px";
		else 
			ib.style.height=me.H_TCP_RECT+"px";
		
//		html+="<br>"+me.pyld['messages_status'];

/*		
		html+="tcpdump_buffer_length:"+me.pyld['tcpdump_buffer_length']+"<br>";
		html+="me.TCP_DATA:"+me.TCP_DATA.length+"<br>";
		html+="me.TRAFFIC_DATA:"+me.TRAFFIC_DATA.length+"<br>";
		html+="me.MESSAGES_DATA:"+me.MESSAGES_DATA.length+"<br>";
		html+="shift_count:"+shift_count+"<br>";
		html+="screen.availWidth="+screen.availWidth+"<br>";
*/
		me.DESTS={};
		for(var sidx=0;sidx<me.SRCS.length;sidx++){
			me.DESTS[me.SRCS[sidx]]={'dest_keys':[],};
		}
		
		for(var tidx=0;tidx<me.TCP_DATA.length;tidx++){
			msg=me.TCP_DATA[tidx].split(",");
			var t=parseFloat(msg[0]);
			
			src_device=msg[2];
			src_idx=me.SRCS.indexOf(src_device);
			
			dest=msg[3];
			if(me.DESTS[src_device][dest]){
				me.DESTS[src_device][dest]+=1;
			}
			else{
				me.DESTS[src_device][dest]=1;
				me.DESTS[src_device]['dest_keys'].push(dest);
			}
			var HWIDTH=cW;
			xc=3*PAD+(t-t0)/(t1-t0)*(cW-6*PAD);
			if(xc<3*PAD)continue;
			
			d=document.createElement("div");
			d.className="tdat";
			d.style.background=me.SRC_COLORS[src_idx];
			
			d.style.position="absolute";
			d.style.left=parseInt(PAD+xc)+"px";
			if(me.EXPANDED)
				d.style.top=me.VFUDGE+src_idx*me.H_TCP_RECT+"px";
			else
				d.style.top=me.VFUDGE+0*me.H_TCP_RECT+"px";
			
			d.title=msg[2]+" -> "+msg[3];
			d.appendChild(me.mkhidden(me.TCP_DATA[tidx]));
			
			d.id=msg[3];
			d.addEventListener("click",me.launchCB,false);
			
			ib.appendChild(d);
			
		}
		
		//The following messages are much more sparse than tcpdump so alpha=0.8
		
		
		src_idx=me.SRCS.indexOf("Django");
		for(var tidx=0;tidx<me.APACHE_DATA.length;tidx++){
			msg=me.APACHE_DATA[tidx].split(",");
			t=parseFloat(msg[0]);
			//src_device=msg[2];
			
			xc=(t-t0)/(t1-t0)*(HWIDTH);
			if(xc<0)continue;
			/*
			ctx.beginPath();
			ctx.fillRect(parseInt(xc)-me.W_TCP_RECT/2,0*me.H_TCP_RECT,me.W_TCP_RECT/2,me.H_TCP_RECT);
			*/
			d=document.createElement("div");
			d.className="mdat";
			//d.style.width=me.W_TCP_RECT/2+"px";
			//d.style.height=me.H_TCP_RECT+"px";
			d.style.background=me.APACHE_COLOR
			//d.style.opacity=0.8;
			
			d.style.position="absolute";
			d.style.left=parseInt(PAD+xc)+"px";
			if(me.EXPANDED)
				d.style.top=me.VFUDGE+src_idx*me.H_TCP_RECT+"px";
			else
				d.style.top=me.VFUDGE+0*me.H_TCP_RECT+"px";
			
			d.title=msg[2]+" -> "+msg[3];
			//NOTE: This should be done server-side:
			split_data=me.APACHE_DATA[tidx].split(",");
			src_chunk=split_data[3].split(" ")[0];
			data=me.APACHE_DATA[tidx];
			d.appendChild(me.mkhidden(data));
			
			//d.data-message=me.APACHE_DATA[tidx];
			
			d.id=split_data[0];
			d.addEventListener("click",me.launchCB,false);
			
			ib.appendChild(d);
		}

		src_idx=me.SRCS.indexOf("Django");
		
		for(var tidx=0;tidx<me.DJANGO_DATA.length;tidx++){
			
			//html+="<br>"+me.DJANGO_DATA[tidx]+"<br>";
			
			msg=me.DJANGO_DATA[tidx].split(",");
			t=parseFloat(msg[0]);
			//src_device=msg[2];
			
			xc=(t-t0)/(t1-t0)*(HWIDTH);
			//if(xc<0)continue;
			/*
			ctx.beginPath();
			ctx.fillRect(parseInt(xc)-me.W_TCP_RECT/2,0*me.H_TCP_RECT,me.W_TCP_RECT/2,me.H_TCP_RECT);
			*/
			d=document.createElement("div");
			d.className="mdat";
			//d.style.width=me.W_TCP_RECT/2+"px";
			//d.style.height=me.H_TCP_RECT+"px";
			d.style.background=me.DJANGO_COLOR
			//d.style.opacity=0.8;
			
			d.style.position="absolute";
			d.style.left=parseInt(PAD+xc)+"px";
			if(me.EXPANDED)
				d.style.top=me.VFUDGE+src_idx*me.H_TCP_RECT+"px";
			else
				d.style.top=me.VFUDGE+0*me.H_TCP_RECT+"px";
			
			d.title=msg[3];
			d.appendChild(me.mkhidden(me.DJANGO_DATA[tidx]));
			
			//d.data-message=me.DJANGO_DATA[tidx];
			
			d.id=Math.random().toString();
			
			d.addEventListener("click",me.launchCB,false);
			
			ib.appendChild(d);
			//html+="<br>Appended!";
		}
		
	}

	return me;
}
