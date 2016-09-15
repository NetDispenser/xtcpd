var Map=function(mapdiv){
	var me={};
	me.view = new ol.View({
	  maxZoom: 21,
		center:ol.proj.transform([-120,35.31],"EPSG:4326","EPSG:3857"),
		zoom:2,
	});
	me.osm2_base=new ol.layer.Tile({
		preload:14,
		title:'OpenStreetMap2',
		source:new ol.source.OSM()
	});
	me.map = new ol.Map({
		layers: [me.osm2_base,],//osm,sat
		interactions:[],
		controls:[],
		target: mapdiv,
		view:me.view,
	});
	var bcr=document.getElementById(mapdiv).getBoundingClientRect();
	me.map.setSize([bcr.width,bcr.height]);

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
	return me;
}
