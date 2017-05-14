var RollUpDiv=function(opts){
	var me={};
	me.selected=false;
	me.opts=opts;
	me.className="rollup";
	me.expanded=false;

	me.add_swatch=function(client_ip){
		if(me.opts['clients'].indexOf(client_ip)<0)
			me.opts['clients'].push(client_ip);
		//so we store it, but if color=null then we don't make no swatch
		var client_color=window.clients_widget.get_color(client_ip);
		var client_device=window.clients_widget.get_device(client_ip);
		if(client_color){
			var sc=me.sr.insertCell(-1);
			var swatch_div=document.createElement("div");
			swatch_div.innerHTML="";
			var swatchcode=mkswatchcode(client_color,client_device,client_ip);
			console.log(swatchcode);
			swatch_div.innerHTML+=swatchcode;
			sc.appendChild(swatch_div);
		}
	}
	var CB=opts['checkboxCB'];
	var callCB=function(e,obj){
		try{
			if(DEBUG)console.log("callCB");
			if(DEBUG)console.log(opts['checkboxCB']);
			CB(e,obj);
		}
		catch(e){
			if(DEBUG)console.log("Failed to call checkboxCB");
			if(DEBUG)console.log(e);
		}
	}
	var CB2=opts['select_rollupCB'];
	var callCB2=function(e,obj){
		try{
			if(DEBUG)console.log("callCB2");
			if(DEBUG)console.log(opts['select_rollupCB']);
			CB2(e,obj);
		}
		catch(e){
			if(DEBUG)console.log("Failed to call select_rollupCB");
			if(DEBUG)console.log(e);
		}
	}

	var solid_id=opts['category'];//handles up to 10 spaces!
	for(var dummy=0;dummy<10;dummy++)
		solid_id=solid_id.replace(" ","ZZZ");//can't be _ b/c splitting on _ already

	me.head=document.createElement("div");
	me.head.className='roll_up_div';
	me.head.id=solid_id;

	var swatch_table_div=document.createElement("div");
	swatch_table_div.className="swatch_table_div";
	var t=document.createElement("table");
	t.style.width="100%";
	me.tr=t.insertRow(-1);
	var td=me.tr.insertCell(-1);
	td.className="swatch_cell";//unused dummy for symmetry
	me.swatch_table=document.createElement("table");
	me.sr=me.swatch_table.insertRow(-1);
	for(var cidx=0;cidx<me.opts['clients'].length;cidx++){
		me.add_swatch(me.opts['clients'][cidx]);
	}
	swatch_table_div.appendChild(me.swatch_table);
	td.appendChild(swatch_table_div);

	td=me.tr.insertCell(-1);
	td.align="center";
	me.label=document.createElement("div");
	me.label.id=me.head.id+"_label";
	me.label.innerHTML=me.opts['roll_up_name'];
	me.label.className="roll_up_label";
	td.appendChild(me.label);

	if(me.opts['checkboxCB']){
		td=me.tr.insertCell(-1);
		td.className="roll_up_icon_cell";
		me.checkbox_icon=new Image();
		me.checkbox_icon.id=me.head.id+"_checkbox";
		me.checkbox_icon.className="roll_up_icon";
		me.checkbox_icon.src=me.opts['checkboxSRC'];
		console.log(me.opts['checkboxSRC']);
		me.checkbox_icon.addEventListener("click",callCB,false);
		td.appendChild(me.checkbox_icon);
	}
	else{if(DEBUG)console.log("no checkboxCB");}

	td=me.tr.insertCell(-1);
	td.className="roll_up_icon_cell";
	me.roll_up_icon=new Image();
	me.roll_up_icon.id=me.head.id+"_icon";
	me.roll_up_icon.className="roll_up_icon up";
	if(me.opts["roll_up_icon_src"]!=null){
		me.roll_up_icon.src=me.opts["roll_up_icon_src"];
		td.appendChild(me.roll_up_icon);
	}

	me.head.appendChild(t);
	$("#"+me.opts['parent_id']).append(me.head);

	me.rollup=document.createElement("div");
	me.rollup.id=me.head.id+"_rollup";
	me.rollup.style="display:none;"
	//me.rollup.className=opts['roll_up_class'];
	//$("#"+opts['parent_id']).append(me.rollup);
	me.head.appendChild(me.rollup);

	if(me.opts['checkboxCB']){
		$("#"+me.checkbox_icon.id).click(function(e){
			callCB(e,me);
		});
	}
	$("#"+me.label.id).click(function(e){
		var final_selected_state=true;
		if(me.selected)final_selected_state=false;
		callCB2(e,me);//deselect all from list @spectrad
		if(final_selected_state){
			me.select(e);
			if($(".focus_marker").hasClass("hide")){
				$(".focus_marker").removeClass("hide");
				window.map_widget.map.render();
			}
		}
		else{
			me.deselect(e);
			$(".focus_marker").addClass("hide");
		}
	});
	me.select=function(e){
//		me.tr.style.backgroundColor="#666666";
		me.selected=true;
		window.map_widget.set_center(e);
	}
	me.deselect=function(e){
//		me.tr.style.backgroundColor="#333333";
		me.selected=false;
	}
	$("#"+me.roll_up_icon.id).click(function(e){
		$(e.target).toggleClass("up");
		$("#"+e.target.id.split("_")[0]+"_rollup").animate({height:'toggle'},300,function(){});
		if(!me.expanded)me.expanded=true;
		else me.expanded=false;
	});

	me.set_name=function(val){
		me.label.innerHTML=val;
	}

	return me;
}
