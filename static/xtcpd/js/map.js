var Map=function(mapdiv){
	var me={};
	me.data={};
	me.center=[-35,35.31];

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
	me.set_center=function(){
		me.map.getView().setCenter(ol.proj.transform(me.center,"EPSG:4326","EPSG:3857"));
		me.map.getView().setZoom(1);
	}
	me.view = new ol.View({
	  maxZoom: 21,
		center:ol.proj.transform(me.center,"EPSG:4326","EPSG:3857"),
		zoom:1,
	});
	me.osm2_base=new ol.layer.Tile({
		preload:14,
		title:'OpenStreetMap2',
		source:new ol.source.OSM()
	});
	me.map = new ol.Map({
		layers: [me.osm2_base,],//osm,sat
//		interactions:[],
//		controls:[],
		target: mapdiv,
		view:me.view,
	});
	var bcr=document.getElementById(mapdiv).getBoundingClientRect();
	me.map.setSize([bcr.width,bcr.height]);
/*
	//091416: this section just pasted-in to get animated marker on map @HOME
	locations=[[-122.8037,45.4871],[-57.7215, 6.7938]];
	for(var dummy=0;dummy<locations.length;dummy++){
		var d=document.createElement("div");
		d.style="display:none;";

		var m=document.createElement("div");
		m.id='marker'+dummy
		m.className="marker";

		d.appendChild(m);
		document.body.appendChild(d);

		var lon=-180+parseInt(360.*Math.random());
		var lat=-60+parseInt(120.*Math.random());
		console.log(lon+", "+lat);
		var pos = ol.proj.fromLonLat(locations[dummy]);//

		var marker = new ol.Overlay({
		  position: pos,
		  positioning: 'center-center',
		  element: document.getElementById('marker'+dummy),
		  stopEvent: false
		});
		me.map.addOverlay(marker);
	}
*/
	me.add_point=function(pyld){
		console.log("add_point");
		var x=document.createElement("div");
		x.className="marker_default";
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
	me.focus_point=function(pyld){
		lonlat=[parseFloat(pyld['longitude']),parseFloat(pyld['latitude'])];
		me.marker1.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));
		me.marker2.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));

		me.overlay.setPosition(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'));
		me.xpopup.innerHTML=pyld['src']+"->"+pyld['dst'];
		return null;
	}

	me.mdiv1=document.createElement("div");
	me.mdiv1.className="marker";
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
	me.mdiv2.className="marker80";
	me.mdiv2.id="marker80";
	document.getElementById("mapdiv").appendChild(me.mdiv2);
	me.marker2 = new ol.Overlay({
		position: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
		positioning: 'center-center',
		element: me.mdiv2,//********
		stopEvent: false
	});
	me.map.addOverlay(me.marker2);
	me.mdiv2.addEventListener("onclick",function(e){console.log("YO");});

	me.xpopup.innerHTML="WHERE IS THIS POPUP?"
	me.overlay.setMap(me.map);

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

		//NEED: when mouseover mdiv/overlay/something!!

//		me.xpopup.innerHTML=lon+", "+lat;
//		me.overlay.setPosition(ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857'));

	});
	me.overlay.on('change:element',function(e){console.log("YOO");});

	return me;
}
