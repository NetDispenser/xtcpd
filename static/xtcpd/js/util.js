var traffic_hostname="http://spytools.asymptopia.org";

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
	xhr.open('Get',traffic_hostname+"/traffic?"+what,true);
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
					//if(show_data)me.render_metadata(pyld);
					//console.log(pyld);
					console.log("calling traffic.render");
					window.traffic_widget.render_data(pyld['traffic']);
					console.log("calling spectra.render");
					window.spectra_widget.render_data(pyld['xtcpd']);
					console.log("calling clients.render");
					window.clients_widget.render_data(pyld['clients']);
					console.log(pyld['xtcpd']);
					if(RUNNING==true){
						setTimeout("update()",TIMEOUT);
					}
					var W=parseInt(document.getElementById("mobile_header").getBoundingClientRect().width);
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
	xhr.open('Get',traffic_hostname+"/traffic?get_data",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("");
}
