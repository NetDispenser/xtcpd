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
	return me;
}
