var LAYOUTS={
	'horizontal':{'division':0.60,'font':'12pt sans-serif','label_height':20,'SF':1.0},//AR>1
	'vertical':{'division':0.40,'font':'8pt sans-serif','label_height':15,'SF':0.75},//AR<1
};
var LAYOUT=LAYOUTS['vertical'];
var Spectra2015=function(){

	var me={};
	me.size=[200,100];
	me.canvas=document.createElement("canvas");
	me.TCP_DATA=new Array();

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
	me.render_data=function(t0,t1,INCOMING_TCP_DATA){
		console.log("render_data");
		me.TCP_DATA=me.TCP_DATA.concat(INCOMING_TCP_DATA);
		var targets=[me.TCP_DATA];
		var shift_count=0;
		for(var tidx=0;tidx<targets.length;tidx++){
			while(true){
				if(targets[tidx].length==0)break;
				msg=targets[tidx][0].split(",");
				t=parseFloat(msg[0]);
				if(t<t0){
					targets[tidx].shift();
					shift_count+=1;
					//console.log("shift_count:"+shift_count);
				}
				else break;
			}
		}


		var ctx=me.canvas.getContext("2d");
		ctx.lineWidth="5.0";

		ctx.globalAlpha=1.0;
		ctx.fillStyle="#222222";
		ctx.fillRect(0,0,me.size[0],me.size[1]);

		ctx.globalAlpha=0.35;

		var last_t=0;
		var last_t_spread=0;
		for(var tidx=0;tidx<me.TCP_DATA.length;tidx++){

			//console.log(TCP_DATA[tidx]);

			msg=me.TCP_DATA[tidx].split(",");
			var t=parseFloat(msg[0]);

			var src_device=msg[2];
//			var src_idx=SRCS.indexOf(src_device);

			var dst_device=msg[3];
//			var dst_idx=SRCS.indexOf(dst_device);

			//if(src_device=="208.111.39.69")
			//	src_idx=dst_idx;//i.e. try to reduce amount of src color

			if(t==last_t)
				last_t_spread+=1;
			else{
				last_t=t;
				last_t_spread=0;
			}

			var xc=(t-t0)/(t1-t0)*me.size[0]+last_t_spread*3;

			ctx.strokeStyle=window.clients_widget.get_transparent_color(src_device);//SRC_COLORS[src_idx];
			//ctx.fillStyle=window.clients_widget.get_color(src_device);//SRC_COLORS[src_idx];
			ctx.beginPath();
			ctx.moveTo(xc,0);//LAYOUT['label_height']
			ctx.lineTo(xc,me.size[1]);
			ctx.stroke();

			//ctx.strokeStyle=window.clients_widget.get_transparent_color(dst_device);//SRC_COLORS[dst_idx];
			//ctx.fillStyle=null;//window.clients_widget.get_color(dst_device);//SRC_COLORS[dst_idx];
/*
			ctx.beginPath();
			ctx.moveTo(xc,LAYOUT['label_height']+(me.size[1]-LAYOUT['label_height'])/2);
			ctx.lineTo(xc,me.size[1]);
			ctx.stroke();
*/
		}

/*
		ctx.globalAlpha=1.0;

		ctx.font = LAYOUT['font'];
		ctx.fillStyle="#444444";
		ctx.fillRect(0,0,me.size[0],LAYOUT['label_height']);
		ctx.fillStyle="#FFFFFF";
		ctx.strokeStyle="#FFFFFF";

		var xhtml="PCKTS: "+me.TCP_DATA.length;
		ctx.fillText(xhtml,0,LAYOUT['label_height']);

		var xhtml="SRCS: "+window.clients_widget.get_clients().length;
		ctx.fillText(xhtml,LAYOUT['SF']*120,LAYOUT['label_height']);
*/
	}
	return me;
}
