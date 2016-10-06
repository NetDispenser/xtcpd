var flyin=function(target_center,target_zoom){

	var start = +new Date();
	var duration = 2000;

	var zoom = ol.animation.zoom({
		resolution: window.map_widget.map.getView().getResolution(),
		duration:duration,
		start:start
	});

	var pan = ol.animation.pan({
	  duration: duration,
	  source: /** @type {ol.Coordinate} */ (window.map_widget.map.getView().getCenter()),
	  start: start
	});
	var bounce = ol.animation.bounce({
	  duration: duration,
	  resolution: 2 * window.map_widget.map.getView().getResolution(),
	  start: start
	});
	window.map_widget.map.beforeRender(pan, zoom);//
	window.map_widget.map.getView().setZoom(target_zoom);
	window.map_widget.map.getView().setCenter(ol.proj.fromLonLat(target_center));

//	window.map_widget.map.getView().setCenter(target_center);
	console.log(target_center);
}
var bounceto=function(target_center){

	var start = +new Date();
	var duration = 2000;

	var zoom = ol.animation.zoom({
		resolution: window.map_widget.map.getView().getResolution(),
		duration:duration,
		start:start
	});

	var pan = ol.animation.pan({
	  duration: duration,
	  source: /** @type {ol.Coordinate} */ (window.map_widget.map.getView().getCenter()),
	  start: start
	});
	var bounce = ol.animation.bounce({
	  duration: duration,
	  resolution: 1.2 * window.map_widget.map.getView().getResolution(),
	  start: start
	});
	window.map_widget.map.beforeRender(pan, bounce);//
	window.map_widget.map.getView().setCenter(ol.proj.fromLonLat(target_center));

//	window.map_widget.map.getView().setCenter(target_center);
	console.log(target_center);
}
