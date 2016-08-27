var TrafficDaemonUI=function(){
me={};
me.TIMEOUT=1000;
me.RUNNING=true;
var W;
var H=300;
var padd=50;
var units="kB/s";
var points=lines=true;
var show_data=false;
var t_min,pyld,SF,maxdat,maxdatidx;
var traffic_hostname="http://spytools.asymptopia.org";

me.xajax=function(what){
	var xhr=new_xhr();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				//console.log(what+" returned "+xhr.responseText);
			}
		}
	}
	xhr.open('Get',traffic_hostname+"/traffic?"+what,true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("");
}

me.render_data=function(pyld){
		maxdat=1E-6;
		for(var ii=0;ii<pyld['bufferlen'];ii++){
			for(var jj=1;jj<pyld['data'][ii].length+1;jj++){
				if(+pyld['data'][ii][jj]>maxdat){
					maxdat=+pyld['data'][ii][jj];
				}
			}
		}

		SF=0.9*((height-2*padd)/2)/maxdat;
		maxdatidx=pyld['data'].length-1;
		t_min=pyld['data'][maxdatidx][0]-pyld['bufferlen'];

		//***************************
		//AXES LABELS
		//***************************
		g_decor.selectAll(".title")
			.data(['Network Traffic'])
			.enter().append("text")
			.attr('class','title')
			.attr("dx", "-2.5em")
			.attr("dy", -(height/2-padd/3))
			.text(function(d) { return d; });

		g_decor.selectAll(".units_left_up")
				.data([pyld['units'][1],])
				.enter().append("text")
				.attr("class", "axis_label units_left_up")
				.attr("dx", +(height/5))
				.attr("dy", -(width/2-padd/3))
				.attr("transform", function(d) { return "rotate(-90)"; })
				.text(function(d) { return d; });

		g_decor.selectAll(".units_left_dn")
				.data([pyld['units'][5],])
				.enter().append("text")
				.attr("class", "axis_label units_left_dn")
				.attr("dx", -(height/5))
				.attr("dy", -(width/2-padd/3))
				.attr("transform", function(d) { return "rotate(-90)"; })
				.text(function(d) { return d; });

		g_decor.selectAll(".bottom_label")
				.data(['Time [s]',])
				.enter().append("text")
				.attr("class", "bottom_label axis_label")
				.attr("dx", "-15")
				.attr("dy", (height/2-padd/3))
				.text(function(d) { return d; });

		//***************************
		//TOP,BOTTOM AXES
		//***************************
		var tScale=d3
			.scaleLinear()
			.range([padd,width-padd])
			.domain([t_min,pyld['data'][maxdatidx][0]]);

		var topAxis=d3
			.axisTop(tScale)
			.ticks(10);

		var botAxis=d3
			.axisBottom(tScale)
			.ticks(10);

		g_x_axis_top
			.attr("class","x axis")
			.call(topAxis);

		g_x_axis_bottom
			.attr("class","x axis")
			.call(botAxis);

		//***************************
		//L,R AXES
		//***************************

		var kbLowerScale=d3
			.scaleLinear()
			.range([-(height)/2+padd,0])
			.domain([maxdat,0]);

		var kbUpperScale=d3
			.scaleLinear()
			.range([0,(height)/2-padd])
			.domain([0,maxdat]);

		var kbLowerAxisR=d3
			.axisRight(kbLowerScale)
			.ticks(5);
		var kbUpperAxisR=d3
			.axisRight(kbUpperScale)
			.ticks(5);

		var kbLowerAxisL=d3
			.axisLeft(kbLowerScale)
			.ticks(5);
		var kbUpperAxisL=d3
			.axisLeft(kbUpperScale)
			.ticks(5);

		g_y_axis_up_r
			.attr("class","x axis")
			.call(kbUpperAxisR);
		g_y_axis_dn_r
			.attr("class","x axis")
			.call(kbLowerAxisR);

		g_y_axis_up_l
			.attr("class","x axis")
			.call(kbUpperAxisL);
		g_y_axis_dn_l
			.attr("class","x axis")
			.call(kbLowerAxisL);

		//***************************
		//LINES
		//***************************
		if(lines){
		g_lines.selectAll("path").remove();
		var dot_classes=[".wlan0_RX",".wlan0_TX",".wlan1_RX",".wlan1_TX"];
		var classnames=["wlan0_RX","wlan0_TX","wlan1_RX","wlan1_TX",];
		for(var i=1;i<5;i++){

		var SIGN=-1;
		if(i>2)SIGN=+1;
		var dot_class=dot_classes[i-1];
		var classname=classnames[i-1];

		var dataline=d3.line()
			.x(function(d,i) { return padd+(d[0]-t_min)*(width-2*padd)/pyld['bufferlen']; })
			.y(function(d) { return SIGN*(height/2-padd-d[i]*SF); });
		var paths=g_lines.selectAll(dot_class)
			.attr("d",dataline(pyld['data']));
		g_lines.append("path")
			.attr("class",classname)
			.attr("d", dataline(pyld['data']));
		}}

		//***************************
		//POINTS
		//***************************
		if(points){
		for(var i=1;i<5;i++){
			var SIGN=-1;
			if(i>2)SIGN=+1;
			var dot_class=".d"+i+"pts";
			var classname="d"+i+"pts";
			var pts=g_points.selectAll(dot_class)
				.data(pyld['data']);
			pts.attr('class',classname)
				.attr('cx',function(d,i){return padd+(d[0]-t_min)*(width-2*padd)/pyld['bufferlen'];})
				.attr('cy',function(d){return SIGN*(height/2-padd-d[i]*SF);});
			pts.enter().append('circle')
				.attr('class',classname)
				.attr('cx',function(d,i){return padd+(d[0]-t_min)*(width-2*padd)/pyld['bufferlen'];})
				.attr('cy',function(d){return SIGN*(height/2-padd-d[i]*SF);})
				.attr('r',2)
				.merge(pts);
			pts.exit().remove();
		}}

}//render_data

//
me.render_metadata=function(pyld){
	var status=document.getElementById("status");
	try{
		var html="<center><table><tr>";

		//Now names ...
		html+="<tr><td align='center'>"+pyld['names'][0]+"</td>";
		for(var i=1;i<pyld['names'].length;i++)
			html+="<td align='center' colspan='2'>"+pyld['names'][i]+"</td>";
		html+="</tr>";

		//Now units ...
		html+="<td align='center'>"+pyld['units'][0]+"</td>";
		for(var i=1;i<pyld['units'].length;i+=2){
			html+="<td align='center'>"+pyld['units'][i]+" ";
			html+=" "+pyld['units'][i+1]+"</td>";
		}
		html+="</tr>";

		//Now data ...
		for(var i=0;i<pyld['data'].length;i++){
			html+="<tr>";
			html+="<td align='center'>"+pyld['data'][i][0]+"</td>";
			for(var j=1;j<pyld['data'][i].length;j++)
				html+="<td align='center'>"+pyld['data'][i][j]+"</td>";
			html+="</tr>";
		}
		html+="</tr></table></center>";
		status.innerHTML=html;
	}
	catch(e){
		console.log(e);
	}
}

me.update=function(){
	var xhr=new_xhr();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				try{
					//console.log(xhr.responseText);
					pyld=JSON.parse(decode(xhr.responseText));
					if(show_data)me.render_metadata(pyld);
					me.render_data(pyld);
					if(me.RUNNING==true){
						setTimeout("me.update()",me.TIMEOUT);
					}
				}catch(e){
					console.log(e)
					if(me.RUNNING==true){
						setTimeout("me.update()",me.TIMEOUT);
					}
				}
			}
		}
	}
	xhr.open('Get',traffic_hostname+"/traffic?get_data",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("");
}
me.setup=function(){
	console.log('init');
	var W=document.getElementById("svg_background").getBoundingClientRect().width;
	svg = d3.select(".svg_background").append("svg").attr("width",W).attr("height",H),
			width = W,
			height = H,
			g_lines = svg.append("g").attr("transform", "translate(0," + (height / 2) + ")"),
			g_points = svg.append("g").attr("transform", "translate(0," + (height / 2) + ")"),
			g_decor = svg.append("g").attr("transform", "translate("+ (width / 2)+"," + (height / 2) + ")"),

			g_x_axis_top = svg.append("g").attr("transform", "translate(0,"+ (padd) + ")"),
			g_x_axis_bottom = svg.append("g").attr("transform", "translate(0," + (height -padd ) + ")"),

			g_y_axis_up_r = svg.append("g").attr("transform", "translate("+(width-padd) + "," + (padd) + ")"),
			g_y_axis_dn_r = svg.append("g").attr("transform", "translate("+(width-padd) + "," + (height-padd) + ")"),
			g_y_axis_up_l = svg.append("g").attr("transform", "translate("+(padd) + "," + (padd) + ")"),
			g_y_axis_dn_l = svg.append("g").attr("transform", "translate("+(padd) + "," + (height-padd) + ")"),

	me.update();
	return me;
}

me.toggle_updatesCB=function(e){
//	console.log("TOGGLE_UPDATES");
	if(me.RUNNING){
		me.RUNNING=false;
	}
	else{
		me.RUNNING=true;
		setTimeout("me.update()",me.TIMEOUT);
	}
}
me.toggle_pointsCB=function(e){
	if(points){
		points=false;
		g_points.selectAll("circle").remove();
	}
	else{
		points=true;
		me.render_data(pyld);
	}
}
me.toggle_linesCB=function(e){
	if(lines){
		lines=false;
		g_lines.selectAll("path").remove();
	}
	else{
		lines=true;
		me.render_data(pyld);
	}
}
me.toggle_dataCB=function(e){
	if(show_data){
		show_data=false;
		document.getElementById("status").innerHTML="";
	}
	else{
		show_data=true;
		try{me.render_metadata(pyld);}
		catch(e){console.log("failed to render metadata");}
	}
}
return me;
}//TrafficDaemonUI
