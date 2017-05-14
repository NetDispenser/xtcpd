var Map=function(mapdiv){
	var me={};
	me.data={};
	me.zoom_levels=[3.0,4.0,6.0,12.0];
	me.current_zoom_idx=0;

	me.center=[-50.0,20.0];
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
	  maxZoom: 19,
		center:ol.proj.transform(me.center,"EPSG:4326","EPSG:3857"),
		zoom:me.zoom_levels[me.current_zoom_idx],
	});
	me.OSM2_SOURCE=new ol.source.OSM();
	me.OSM2_LAYER=new ol.layer.Tile({
		preload:14,opacity:1.0,
		title:'OpenStreetMap2',
		source:me.OSM2_SOURCE
	});
	me.WORLD_SOURCE=new ol.source.Vector({
		url: "/static/xtcpd/data/world_borders.geojson",
		format: new ol.format.GeoJSON()
	});
	me.WORLD_LAYER=new ol.layer.Vector({
		source: me.WORLD_SOURCE,
		style:new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgba(150,250,150,0.15)',
				width: 1
			}),
			fill: new ol.style.Fill({
				color:'rgba(0,0,100,0)',
			})
		}),
	});
/*
	me.EARTHLIGHTS_SOURCE=new ol.source.XYZ({
		attributions: [new ol.Attribution({html: 'EarthLights'})],
		url: "/static/xtcpd/data/EarthLights/{z}/{x}/{y}.png",
		minZoom: 0,maxZoom: 5
	});
	me.EARTHLIGHTS_LAYER=new ol.layer.Tile({
		extent: ol.proj.transformExtent([-360., -85.051129, 360., 85.051129], 'EPSG:4326', 'EPSG:3857'),
		source: me.EARTHLIGHTS_SOURCE
	});
*/
	me.map = new ol.Map({
		layers: [me.WORLD_LAYER],//me.EARTHLIGHTS_LAYER,osm,sat,me.osm2_base,polygon_layer
		//interactions:[],
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
	me.flyhome=function(){
		flyin(me.center,me.zoom_levels[0]);
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

/*
			.marker_default {
				width: 8px;height: 8px;border-radius: 4px;opacity:1.0;
				border: 3px solid #00FF00;
				background-color: #FFFF00;
				opacity:1.0;
			}
*/
		x.className=pyld['country_code']+" "+src+" "+netrange;//marker_default
		x.style="width:8px;height:8px;border-radius:8px;border:4px solid "+window.clients_widget.get_color(pyld['src'])+";background-color:"+window.clients_widget.get_color(pyld['src'])+"";
		console.log("map.add_point: "+pyld['netrange']);
		console.log("color="+window.clients_widget.get_color(pyld['src']));
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
		console.log("current resolution: "+window.map_widget.view.getResolution());
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
		var client_device=window.clients_widget.device_by_ip(pyld['src']);
		var swatch_code=mkswatchcode(src_color,client_device,src);
		me.xpopup.innerHTML=swatch_code+" "+pyld['src']+"->"+pyld['dst'];
//		me.xpopup.innerHTML+="<br>"+swatch_code;
		me.xpopup.innerHTML+="<br>"+client_device;
		var bcr=me.xpopup.getBoundingClientRect();
		console.log(bcr.width+"x"+bcr.height);

		var dlon=(-1)*(bcr.width/2.)*window.map_widget.view.getResolution();
		//console.log("dlon[m]="+dlon);
		//var dlonlat=ol.proj.transform([dlon,parseFloat(pyld['latitude'])], 'EPSG:4326', 'EPSG:3857');
		//console.log(dlonlat);
		var lonlat=[parseFloat(pyld['longitude']),parseFloat(pyld['latitude'])];

		var xlonlat=ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857');
		xlonlat[0]+=dlon;
		console.log(xlonlat);
		me.overlay.setPosition(xlonlat);

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
	me.layer_combo=0;
	me.layersCB=function(){
//		try{me.map.removeLayer(me.EARTHLIGHTS_LAYER);}catch(e){}
		try{me.map.removeLayer(me.WORLD_LAYER);}catch(e){}
		try{me.map.removeLayer(me.OSM2_LAYER);}catch(e){}
		me.layer_combos=[
//			[me.EARTHLIGHTS_LAYER,me.WORLD_LAYER],
			[me.WORLD_LAYER],
			[me.OSM2_LAYER,me.WORLD_LAYER],
		];
		me.layer_combo+=1;
		if(me.layer_combo>me.layer_combos.length-1)me.layer_combo=0;
		console.log('layersCB:'+me.layer_combo);
		for(var idx=0;idx<me.layer_combos[me.layer_combo].length;idx++){
			me.map.getLayers().insertAt(idx,me.layer_combos[me.layer_combo][idx]);
		}
	}
	return me;
}
