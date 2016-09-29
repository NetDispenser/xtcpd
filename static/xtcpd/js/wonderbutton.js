var WonderButton=function(opts){
	var me={};
	me.get=function(){
		var wbd0=document.createElement("div");
		wbd0.id=opts['id'];
		console.log(wbd0.id);

		wbd0.className="wbd0";
		var wbdt0=document.createElement("table");
		wbdt0.className="wbdt0";
		var wbdt0r0=wbdt0.insertRow(-1);//swatch,label,check,spinner
		var swatch_cell=wbdt0r0.insertCell(-1);
		var netrange_cell=wbdt0r0.insertCell(-1);
		var checkbox_cell=wbdt0r0.insertCell(-1);
		var spinner_cell=wbdt0r0.insertCell(-1);

		var swatch_table=document.createElement("table");
		var sr=swatch_table.insertRow(-1);
		for(var dummy=0;dummy<3;dummy++){
			var sc=sr.insertCell(-1);
			var swatch_div=document.createElement("div");
			swatch_div.innerHTML="";
			swatch_div.innerHTML+=mkswatchcode(mkrandomcolor());
			sc.appendChild(swatch_div);
		}
		swatch_cell.appendChild(swatch_table);

		var netrange_label=document.createElement("div");
		netrange_label.className="netrange_label";
		netrange_label.innerHTML="192.255.255.255";
		netrange_cell.appendChild(netrange_label);

		var checkbox=new Image();
		checkbox.id="himaggie";
		checkbox.className="roll_up_checkbox";
		checkbox.src="/static/xtcpd/img/checkbox-1.png"
		checkbox_cell.appendChild(checkbox);

		spinner_cell.className="roll_up_icon_cell";
		var roll_up_icon=new Image();
		roll_up_icon.id=opts['id']+"_icon";//IMPORTANT: Needs to be passed-in, it's not "dynamic" from within
		console.log(roll_up_icon.id);
		roll_up_icon.className="roll_up_icon";
		if(opts["roll_up_icon_src"]!=null){
			roll_up_icon.src=opts["roll_up_icon_src"];
			spinner_cell.appendChild(roll_up_icon);
		}

		var wbdt0r1=wbdt0.insertRow(-1);//scrolling info
		var wbdt0r1c0=wbdt0r1.insertCell(-1);
//		wbdt0r1c0.width="200%";
		wbdt0r1c0.colSpan="10";
		scrolldiv=document.createElement("div");
		scrolldiv.className="scrolling_button_text";
		scrolldiv.innerHTML="<h5>32 NetRanges | 257 IPs | 572 Clients | 449 Messages | Beaverton, OR | Comcast | United States</h5>";
		wbdt0r1c0.appendChild(scrolldiv);

		me.rollup=document.createElement("div");
		me.rollup.id=opts['id']+"_rollup";
		me.rollup.className="rollup";
		var t=document.createElement("table");
		var r=t.insertRow(-1);
		var c=r.insertCell(-1);
		var dummy_img=new Image();
		dummy_img.src="/static/xtcpd/img/flag_green_hilite.png";
		dummy_img.style.width="100px";
		c.appendChild(dummy_img);
		me.rollup.appendChild(t);

		wbd0.appendChild(wbdt0);
		wbd0.appendChild(me.rollup);

		console.log("Applying listener for "+"#"+roll_up_icon.id);

		$("#"+roll_up_icon.id).click(function(e){
			console.log("click");
			$(e.target).toggleClass("up");
			console.log("#"+e.target.id.split("_")[0]+"_rollup");
			$("#"+e.target.id.split("_")[0]+"_rollup").animate({height:'toggle'},300,function(){});
//			e.stopPropagation();
		});

		return wbd0;
	}
	return me;
}
