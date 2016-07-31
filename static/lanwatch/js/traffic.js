var Traffic=function(){
	
	var me={};
	me.size=[200,100];
	me.canvas=document.createElement("canvas");
	
	me.get_canvas=function(){
		return me.canvas;
	}
	me.set_size=function(w,h){
		me.size=[w,h];
		//me.canvas.style.width=me.size[0]+"px";
		//me.canvas.style.height=me.size[1]+"px";
		var ctx=me.canvas.getContext("2d");
		ctx.canvas.width=me.size[0];
		ctx.canvas.height=me.size[1];
	}
	
	me.render_size=function(line_color){
		
		var ctx=me.canvas.getContext("2d");
		
		ctx.lineWidth="1.0";
		ctx.strokeStyle=line_color;
		ctx.fillStyle=line_color;
		
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(me.size[0],me.size[1]);
		ctx.stroke();
	
		ctx.beginPath();
		ctx.moveTo(0,me.size[1]);
		ctx.lineTo(me.size[0],0);
		ctx.stroke();
	}
	
	me.render_data=function(t0,t1,TRAFFIC_DATA){
	
		var COLOR_RX0='#FFCC00';
		var COLOR_TX0='#00AAFF';
		var COLOR_RX1='#FF0000';
		var COLOR_TX1='#0000FF';

		var ymax=0.;
		var ymin=0.;
		var drxdt;
		var dtxdt;
		for(var tidx=0;tidx<TRAFFIC_DATA.length;tidx++){
			try{
				split_msg=TRAFFIC_DATA[tidx].split(",");
				ifpyld=split_msg[2].split(" ");
				//ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				if(drxdt>ymax)ymax=drxdt;
				if(dtxdt>ymax)ymax=dtxdt;
				
				ifpyld=split_msg[3].split(" ");
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				if(drxdt>ymax)ymax=drxdt;
				if(dtxdt>ymax)ymax=dtxdt;
				
				//another section would cover wlan0
			}
			catch(e){
				//console.log(e);
			}
		}
		var dy=ymax-ymin;


		
		var ctx=me.canvas.getContext("2d");
		ctx.lineWidth="1.0";
		
		ctx.fillStyle="#333333";
		ctx.fillRect(0,0,me.size[0],me.size[1]);
		
		//ZEROETH CHANNEL RECEIVE
		ctx.lineWidth="2.0";
		ctx.strokeStyle=COLOR_RX0;
		ctx.fillStyle=COLOR_RX0;
		ctx.moveTo(0,0);
		ctx.beginPath();
		for(var tidx=0;tidx<TRAFFIC_DATA.length;tidx++){
			
			try{
				
				split_msg=TRAFFIC_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				ifpyld=split_msg[2].split(" ");
				ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				
				ctx.lineTo(xc,me.size[1]-drxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
				ctx.stroke();
				ctx.moveTo(xc,me.size[1]-drxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
			}
			catch(e){
				console.log(e);
			}
		}
		
		//ZEROETH CHANNEL TRANSMIT
		ctx.lineWidth="2.0";
		ctx.strokeStyle=COLOR_TX0;
		ctx.fillStyle=COLOR_TX0;
		ctx.moveTo(0,0);
		ctx.beginPath();
		for(var tidx=0;tidx<TRAFFIC_DATA.length;tidx++){
			
			try{
				
				split_msg=TRAFFIC_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				ifpyld=split_msg[2].split(" ");
				ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				
				ctx.lineTo(xc,me.size[1]-dtxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
				ctx.stroke();
				ctx.moveTo(xc,me.size[1]-dtxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
			}
			catch(e){
				console.log(e);
			}
		}
		
		
		//FIRST CHANNEL RECEIVE
		ctx.lineWidth="2.0";
		ctx.strokeStyle=COLOR_RX1;
		ctx.fillStyle=COLOR_RX1;
		ctx.moveTo(0,me.size[1]);
		ctx.beginPath();
		for(var tidx=0;tidx<TRAFFIC_DATA.length;tidx++){
			
			try{
				
				split_msg=TRAFFIC_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				ifpyld=split_msg[3].split(" ");
				ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				
				ctx.lineTo(xc,LAYOUT['label_height']+drxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
				ctx.stroke();
				ctx.moveTo(xc,LAYOUT['label_height']+drxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
			}
			catch(e){
				console.log(e);
			}
		}
		
		//FIRST CHANNEL TRANSMIT
		ctx.strokeStyle=COLOR_TX1;
		ctx.fillStyle=COLOR_TX1;
		ctx.lineWidth="2.0";
		ctx.moveTo(0,me.size[1]);
		ctx.beginPath();
		for(var tidx=0;tidx<TRAFFIC_DATA.length;tidx++){
			
			try{
				
				split_msg=TRAFFIC_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				ifpyld=split_msg[3].split(" ");
				ifname=ifpyld[0];
				drxdt=parseInt(ifpyld[1]);
				dtxdt=parseInt(ifpyld[2]);
				
				ctx.lineTo(xc,LAYOUT['label_height']+dtxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
				ctx.stroke();
				ctx.moveTo(xc,LAYOUT['label_height']+dtxdt/dy*(me.size[1]-LAYOUT['label_height'])/2.);
			}
			catch(e){
				console.log(e);
			}
		}
		
		ctx.globalAlpha=LABEL_OPACITY;
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle="#444444";
		ctx.fillRect(0,0,me.size[0],LAYOUT['label_height']);
		
		ctx.fillStyle="#FFFFFF";
		ctx.strokeStyle="#FFFFFF";
		var xhtml="PEAK: "+window.mkUnits(parseInt(dy/1).toString());
		ctx.fillText(xhtml,LAYOUT['SF']*0,LAYOUT['label_height']);
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle="#FFFFFF";
		ctx.strokeStyle="#FFFFFF";
		var xhtml=IFACE_NAMES[0];
		ctx.fillText(xhtml,LAYOUT['SF']*120,LAYOUT['label_height']);
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle=COLOR_RX0;
		ctx.strokeStyle=COLOR_RX0;
		var xhtml="RX";
		ctx.fillText(xhtml,LAYOUT['SF']*190,LAYOUT['label_height']);
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle=COLOR_TX0;
		ctx.strokeStyle=COLOR_TX0;
		var xhtml="TX";
		ctx.fillText(xhtml,LAYOUT['SF']*215,LAYOUT['label_height']);
		




		ctx.font = LAYOUT['font'];
		ctx.fillStyle="#FFFFFF";
		ctx.strokeStyle="#FFFFFF";
		var xhtml=IFACE_NAMES[1];
		ctx.fillText(xhtml,LAYOUT['SF']*260,LAYOUT['label_height']);
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle=COLOR_RX1;
		ctx.strokeStyle=COLOR_RX1;
		var xhtml="RX";
		ctx.fillText(xhtml,LAYOUT['SF']*310,LAYOUT['label_height']);
		
		ctx.font = LAYOUT['font'];
		ctx.fillStyle=COLOR_TX1;
		ctx.strokeStyle=COLOR_TX1;
		var xhtml="TX";
		ctx.fillText(xhtml,LAYOUT['SF']*335,LAYOUT['label_height']);

		ctx.globalAlpha=1.0;
	}
	return me;
}
