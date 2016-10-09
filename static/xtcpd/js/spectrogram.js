/*
Charles Cosse, Asymptopia Software
ccosse@gmail.com | www.asymptopia.org
September 12, 2016
*/
var Spectrogram=function(){
var me={};
me.svg=null;
var padd=50;
var W;
var H=document.getElementById("theCarousel").getBoundingClientRect().height/2;
me.clear=function(){console.log("spectrogram.clear");}
me.render_data=function(pyld){
		console.log(pyld);
}
me.setup=function(){
	var W=parseInt(document.getElementById("mapdiv").getBoundingClientRect().width);
	console.log(W);
//	if(true)W=380;
	svg = d3.select("#spectrogram_background").append("svg").attr("width",W).attr("height",H).attr('class','swipeable'),
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

	me.svg=svg;

	return me;
}
return me;
}
