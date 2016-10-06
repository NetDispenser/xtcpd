var Map=function(mapdiv){
	var me={};
	me.data={};
	me.zoom_levels=[1.0,4.0,6.0,12.0];
	me.current_zoom_idx=0;

	me.center=[0.0,35.31];
	me.current_center=me.center;

	me.clear=function(){
		me.data={};
	}
	me.xpopup = document.getElementById('xpopup');
	console.log('xpopup found by map.js');
	me.popup_closer = document.getElementById('popup-closer');

	me.overlay = new ol.Overlay({
		element: document.getElementById('popup'),
		autoPan: false,
		autoPanAnimation: {
			duration: 250
		}
	});
	me.popup_closer.onclick = function() {
		me.overlay.setPosition(undefined);
		me.popup_closer.blur();
		return false;
	};
	me.view = new ol.View({
	  maxZoom: 21,
		center:ol.proj.transform(me.center,"EPSG:4326","EPSG:3857"),
		zoom:me.zoom_levels[me.current_zoom_idx],
	});
	me.osm2_base=new ol.layer.Tile({
		preload:14,
		title:'OpenStreetMap2',
		source:new ol.source.OSM()
	});

	var src_url="/static/xtcpd/data/world_borders.geojson";
	var polygon_source=new ol.source.Vector({
		url: src_url,
		format: new ol.format.GeoJSON()
	});
	var polygon_layer= new ol.layer.Vector({
		source: polygon_source,
		style:new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "rgba(0,0,100,1.0)",
				width: "1"
			}),
			fill: new ol.style.Fill({
				color: "rgba(0,0,200,0.5)",
			})
		}),
	});

	me.map = new ol.Map({
		layers: [polygon_layer,],//osm,sat,me.osm2_base,
		interactions:[],
		controls:[],
		target: mapdiv,
		view:me.view,
	});
	var bcr=document.getElementById(mapdiv).getBoundingClientRect();
	me.map.setSize([bcr.width,bcr.height]);
	me.flyin3=function(){
		if(window.spectra_widget.current_pyld){
			var pyld=window.spectra_widget.current_pyld;
			me.current_center=[pyld['longitude'],pyld['latitude']];
		}
		else{
			me.current_center=me.center;
		}
		me.current_zoom_idx+=1;
		if(me.current_zoom_idx>me.zoom_levels.length-1)
			me.current_zoom_idx=0;
		flyin(me.current_center,me.zoom_levels[me.current_zoom_idx]);
	}
	me.set_center=function(){
		try{
			if(window.spectra_widget.current_pyld){
				var lat=window.spectra_widget.current_pyld['latitude'];
				var lon=window.spectra_widget.current_pyld['longitude'];
				me.current_center=[lon,lat];
				if(me.current_center==me.view.getCenter()){
					console.log("already there ... going to global center");
					me.current_center=me.center;
				}
			}
			else{
				me.current_center=me.center;
			}
//			me.current_zoom_idx=0;
//			flyin(me.current_center,me.zoom_levels[me.current_zoom_idx]);
			bounceto(me.current_center);
		}
		catch(e){console.log(e);}
	}
	me.add_point=function(pyld){
		console.log("add_point");
		var x=document.createElement("div");

		var netrange="nr-"+pyld['netrange'];
		while(netrange.indexOf(".")>-1)
			netrange=netrange.replace(".","ZZZ");

		var src="src-"+pyld['src'];
		while(src.indexOf(".")>-1)
			src=src.replace(".","ZZZ");

		x.className="marker_default "+pyld['country_code']+" "+src+" "+netrange;
		console.log("map.add_point: "+pyld['netrange']);

		document.getElementById("mapdiv").appendChild(x);
		lonlat=[parseFloat(pyld['longitude']),parseFloat(pyld['latitude'])];
		var oly = new ol.Overlay({
			position: ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'),
			positioning: 'center-center',
			element: x,//********
			stopEvent: false
		});
		me.map.addOverlay(oly);
	}
	me.full_info=function(){
		if(me.xpopup.innerHTML!=""){
			me.xpopup.innerHTML="";
			var lonlat=[-160.0,-70.0];
			me.overlay.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));
			return;
		}

		var ms=document.getElementById("myselectra");//reaching into spectra
		var pyld=window.spectra_widget.current_pyld;
		var src=pyld['src'];
		var src_color=window.clients_widget.get_color(src);//.data[src]['color'];
		var swatch_code=mkswatchcode(src_color);
		me.xpopup.innerHTML=pyld['src']+"->"+pyld['dst'];
		me.xpopup.innerHTML+="<br>"+swatch_code;
		var client_device=window.clients_widget.device_by_ip(pyld['src']);
		me.xpopup.innerHTML+=client_device;
		var bcr=me.xpopup.getBoundingClientRect();
		console.log(bcr.width+"x"+bcr.height);
		var lonlat=[parseFloat(pyld['longitude']),parseFloat(pyld['latitude'])];
		me.overlay.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));

		//NEED: -w/2 * dpx2dlon

}

	me.focus_point=function(pyld){
		var lonlat=[parseFloat(pyld['longitude']),parseFloat(pyld['latitude'])];
		me.marker1.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));
		me.marker2.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));

		me.xpopup.innerHTML="";
		var lonlat=[-160.0,-70.0];
		me.overlay.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));

		return null;
	}

	me.mdiv1=document.createElement("div");
	me.mdiv1.className="marker focus_marker hide";
	me.mdiv1.id="marker";
	document.getElementById("mapdiv").appendChild(me.mdiv1);
	me.marker1 = new ol.Overlay({
		position: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
		positioning: 'center-center',
		element: me.mdiv1,//********
		stopEvent: false
	});
	me.map.addOverlay(me.marker1);

	me.mdiv2=document.createElement("div");
	me.mdiv2.className="marker80 focus_marker hide";
	me.mdiv2.id="marker80";
	document.getElementById("mapdiv").appendChild(me.mdiv2);
	me.marker2 = new ol.Overlay({
		position: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
		positioning: 'center-center',
		element: me.mdiv2,
		stopEvent: false
	});
	me.map.addOverlay(me.marker2);
	me.mdiv2.addEventListener("onclick",function(e){console.log("YO");});

	me.xpopup.innerHTML="WHERE IS THIS POPUP?"
	me.overlay.setMap(me.map);
/*
	me.map.on('pointermove',function(evt){
		var latpanel=document.getElementById("lat");
		var lonpanel=document.getElementById("lon");
		var lonlat=ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
		var lon=parseFloat(parseInt(lonlat[0]*1E4)/1E4);
		var lat=parseFloat(parseInt(lonlat[1]*1E4)/1E4);
		latpanel.innerHTML=lat;
		lonpanel.innerHTML=lon;
		if(evt.dragging){return;}
		var found=false;
	});
*/
	me.overlay.on('change:element',function(e){console.log("YOO");});

	return me;
}
