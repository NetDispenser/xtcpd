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
