var mkswatchcode=function(c,device,ip){
	var rval="<div style='width:10px;height:10px;background-color:"+c+";' title='"+device+": "+ip+"'>";
	rval+="</div>";
	return rval;
}
var mkrandomcolor=function(){
	var hexvals=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
	var rval="#";
	for(var dummy=0;dummy<6;dummy++){
		var idx=parseInt(Math.random()*hexvals.length);
		rval+=hexvals[idx];
	}
	return rval;
}
var mkhidden=function(hval){
	console.log("mkhidden:"+hval);
	dummy=document.createElement("input");
	dummy.type="hidden";
	dummy.value=hval;
	return dummy;
}
var new_xhr=function(){
	var xhr=null;
	try{xhr=new ActiveXObject('Msxml2.XMLHTTP');}
	catch(e){
		try{xhr=new ActiveXObject('Microsoft.XMLHTTP');}
		catch(e2){
			try{xhr=new XMLHttpRequest();}
			catch(e3){xhr=null;}
		}
	}
	return xhr;
}
var decode=function(str){
	var div = document.createElement('div');
	div.innerHTML = str;
	var decoded=str;
	try{
		decoded = div.firstChild.nodeValue;
	}
	catch(e){;}
	return decoded;
}
var xajax=function(what){
	var xhr=new_xhr();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				//console.log(what+" returned "+xhr.responseText);
			}
		}
	}
	xhr.open('Get',server_hostname+"/traffic?"+what,true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("");
}
var update=function(){
	var xhr=new_xhr();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				try{
					//console.log(xhr.responseText);
					pyld=JSON.parse(decode(xhr.responseText));

					//clients first b/c spectra will check client color
					//somehow need to apply so don't have to keep checking.
					//it's actually a const, just under client obj, so ref it!
					console.log("calling clients.render");
					window.clients_widget.render_data(pyld['spectra']['clients'],pyld['clients']);

					console.log("calling spectra.render");
					window.spectra_widget.render_data(pyld['spectra']);

					console.log("calling traffic.render");
					window.traffic_widget.render_data(pyld['traffic']);

					console.log("calling spectra2015.render");
					window.spectra2015.render_data(pyld['t0'],pyld['t1'],pyld['spectra']['tcp']);

					if(RUNNING==true){
						setTimeout("update()",TIMEOUT);
					}
					var W=parseInt(document.getElementById("mapdiv").getBoundingClientRect().width);
					window.traffic_widget.svg.attr("width",W);
					width=W;
//					console.log("width="+width);

				}catch(e){
					console.log(e)
					if(RUNNING==true){
						setTimeout("update()",TIMEOUT);
					}
				}
			}
		}
	}
	xhr.open('Get',server_hostname+"/traffic?get_data",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("");
}
