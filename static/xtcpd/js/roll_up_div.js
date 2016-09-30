var RollUpDiv=function(opts){
	var me={};
	me.selected=false;
	me.opts=opts;
	me.className="rollup";

	var CB=opts['checkboxCB'];
	var callCB=function(e){
		try{
			if(DEBUG)console.log("callCB");
			if(DEBUG)console.log(opts['checkboxCB']);
			CB(e);
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
	var swatch_table=document.createElement("table");
	var sr=swatch_table.insertRow(-1);
	for(var dummy=0;dummy<1;dummy++){
		var sc=sr.insertCell(-1);
		var swatch_div=document.createElement("div");
		swatch_div.innerHTML="";
		swatch_div.innerHTML+=mkswatchcode("#00FFFF");
		sc.appendChild(swatch_div);
	}
	swatch_table_div.appendChild(swatch_table);
	td.appendChild(swatch_table_div);

	td=me.tr.insertCell(-1);
	td.align="center";
	me.label=document.createElement("div");
	me.label.id=me.head.id+"_label";
	me.label.innerHTML=opts['roll_up_name'];
	me.label.className="roll_up_label";
	td.appendChild(me.label);

	if(opts['checkboxCB']){//BASE_LAYERS are laid out differently
		td=me.tr.insertCell(-1);
		td.className="roll_up_icon_cell";
		var roll_up_icon=new Image();
		roll_up_icon.id=me.head.id+"_checkbox";
		roll_up_icon.className="roll_up_icon";
		roll_up_icon.src=opts['checkboxSRC'];
		roll_up_icon.addEventListener("click",callCB,false);
		td.appendChild(roll_up_icon);
	}
	else{if(DEBUG)console.log("no checkboxCB");}

	td=me.tr.insertCell(-1);
	td.className="roll_up_icon_cell";
	var roll_up_icon=new Image();
	roll_up_icon.id=me.head.id+"_icon";
	roll_up_icon.className="roll_up_icon up";
	if(opts["roll_up_icon_src"]!=null){
		roll_up_icon.src=opts["roll_up_icon_src"];
		td.appendChild(roll_up_icon);
	}

	me.head.appendChild(t);
	$("#"+opts['parent_id']).append(me.head);

	me.rollup=document.createElement("div");
	me.rollup.id=me.head.id+"_rollup";
	me.rollup.style="display:none;"
	//me.rollup.className=opts['roll_up_class'];
	//$("#"+opts['parent_id']).append(me.rollup);
	me.head.appendChild(me.rollup);
	$("#"+me.label.id).click(function(e){
		var final_selected_state=true;
		if(me.selected)final_selected_state=false;
		callCB2(e,me);//deselect all from list @spectrad
		if(final_selected_state){
			me.select(e);
		}
		else{
			me.deselect(e);
		}
	});
	me.select=function(e){
		me.tr.style.backgroundColor="#666666";
		me.selected=true;
	}
	me.deselect=function(e){
		me.tr.style.backgroundColor="#333333";
		me.selected=false;
	}
	$("#"+roll_up_icon.id).click(function(e){
		$(e.target).toggleClass("up");
		$("#"+e.target.id.split("_")[0]+"_rollup").animate({height:'toggle'},300,function(){});
	});

	me.set_name=function(val){
		me.label.innerHTML=val;
	}

	return me;
}
