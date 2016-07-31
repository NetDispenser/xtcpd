var MEM_COLOR="#00AAFF";
var SWAP_COLOR="#33FF33";
var LOADAVG_COLOR="yellow";
var OVERLOAD_COLOR="red";

var Memory=function(){
	
	
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
	
	me.render_data=function(t0,t1,MEMORY_DATA){

		var ctx=me.canvas.getContext("2d");
		ctx.lineWidth="1.0";
		
		ctx.fillStyle="#333333";
		ctx.fillRect(0,0,me.size[0],me.size[1]);
		
		//MEMORY (RAM)
		ctx.lineWidth="2.0";
		ctx.strokeStyle=MEM_COLOR;
		ctx.fillStyle=MEM_COLOR;
		ctx.moveTo(0,0);
		ctx.beginPath();
		for(var tidx=0;tidx<MEMORY_DATA.length;tidx++){
			
			try{
				
				split_msg=MEMORY_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				mem_use=parseFloat(split_msg[2]);
				mem_tot=parseFloat(split_msg[3]);
				swap_use=parseFloat(split_msg[4]);
				swap_tot=parseFloat(split_msg[5]);
				
				ctx.lineTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*(mem_use)/mem_tot);
				ctx.stroke();
				ctx.moveTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*(mem_use)/mem_tot);
			}
			catch(e){
				console.log(e);
			}
		}
		//console.log("PLOTTED "+MEMORY_DATA.length);
		
		//SWAP
		ctx.strokeStyle=SWAP_COLOR;
		ctx.fillStyle=SWAP_COLOR;
		ctx.moveTo(0,0);
		ctx.beginPath();
		for(var tidx=0;tidx<MEMORY_DATA.length;tidx++){
			
			try{
				
				split_msg=MEMORY_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				mem_use=parseFloat(split_msg[2]);
				mem_tot=parseFloat(split_msg[3]);
				swap_use=parseFloat(split_msg[4]);
				swap_tot=parseFloat(split_msg[5]);
				
				ctx.lineTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*(swap_use)/swap_tot);
				ctx.stroke();
				ctx.moveTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*(swap_use)/swap_tot);
			}
			catch(e){
				console.log(e);
			}
		}
		
		//LOADAVGS
		var LOADAVG_COLOR="yellow";
		var LAST_LOADAVG=0;
		ctx.strokeStyle=LOADAVG_COLOR;
		ctx.fillStyle=LOADAVG_COLOR;
		ctx.moveTo(0,0);
		ctx.beginPath();
		for(var tidx=0;tidx<MEMORY_DATA.length;tidx++){
			
			try{
				
				//console.log(MEMORY_DATA[tidx]);
				
				split_msg=MEMORY_DATA[tidx].split(",");
				t=parseFloat(split_msg[0]);
				xc=(t-t0)/(t1-t0)*me.size[0];
				
				LAST_LOADAVG=parseFloat(split_msg[6]);
				if(LAST_LOADAVG <1.){
					ctx.strokeStyle=LOADAVG_COLOR;
					ctx.fillStyle=LOADAVG_COLOR;
				ctx.lineTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*LAST_LOADAVG);
				ctx.stroke();
				ctx.moveTo(xc,me.size[1]-(me.size[1]-LAYOUT['label_height'])*LAST_LOADAVG);
				}
				else{
					ctx.strokeStyle="red";
					ctx.fillStyle="red";
					ctx.lineTo(xc,LAYOUT['label_height']+1);
					ctx.stroke();
					ctx.moveTo(xc,LAYOUT['label_height']+1);
				}
			}
			catch(e){
				console.log(e);
			}
		}

		ctx.globalAlpha=1.0;
		ctx.font = LAYOUT['font'];
		ctx.fillStyle="#444444";
		ctx.fillRect(0,0,me.size[0],LAYOUT['label_height']);
		
		if(MEMORY_DATA.length<1)return;
		
		msg=MEMORY_DATA[MEMORY_DATA.length-1];
		split_msg=msg.split(",");
		
		mem_use=parseFloat(split_msg[2]);
		mem_tot=parseFloat(split_msg[3]);
		swap_use=parseFloat(split_msg[4]);
		swap_tot=parseFloat(split_msg[5]);
		
		//MEMORY TEXT
		ctx.fillStyle="white";
		ctx.strokeStyle="white";
		var xhtml="MEM: "
		ctx.fillText(xhtml,0,LAYOUT['label_height']);

		ctx.fillStyle=MEM_COLOR;
		ctx.strokeStyle=MEM_COLOR;
		xhtml=parseInt((mem_use)/mem_tot*100.)+"%";
		ctx.fillText(xhtml,LAYOUT['SF']*50,LAYOUT['label_height']);
		
		ctx.fillStyle="white";
		ctx.strokeStyle="white";
		xhtml="("+parseInt(mem_tot/1E3)+"M)";
		ctx.fillText(xhtml,LAYOUT['SF']*90,LAYOUT['label_height']);

		
		//SWAP TEXT
		ctx.fillStyle="white";
		ctx.strokeStyle="white";
		var xhtml="SWP: "
		ctx.fillText(xhtml,LAYOUT['SF']*150,LAYOUT['label_height']);
		
		ctx.fillStyle=SWAP_COLOR;
		ctx.strokeStyle=SWAP_COLOR;
		xhtml=parseInt((swap_use)/swap_tot*100.)+"%";
		ctx.fillText(xhtml,LAYOUT['SF']*200,LAYOUT['label_height']);
		
		ctx.fillStyle="white";
		ctx.strokeStyle="white";
		xhtml="("+parseInt(swap_tot/1E3)+"M)";
		ctx.fillText(xhtml,LAYOUT['SF']*240,LAYOUT['label_height']);
		
		
		
		//LOADAVG TEXT
		ctx.fillStyle="white";
		ctx.strokeStyle="white";
		var xhtml="LOAD: "
		ctx.fillText(xhtml,LAYOUT['SF']*300,LAYOUT['label_height']);
		
		if(LAST_LOADAVG<1.0){
			ctx.fillStyle=LOADAVG_COLOR;
			ctx.strokeStyle=LOADAVG_COLOR;
		}
		else{
			ctx.fillStyle="red";
			ctx.strokeStyle="red";
		}
		xhtml=parseInt(LAST_LOADAVG*100.)+"%";
		ctx.fillText(xhtml,LAYOUT['SF']*360,LAYOUT['label_height']);
	}
	return me;
}
