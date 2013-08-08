var metersToMiles = function(distance) {
	return distance * 0.000621371;
};

var generateSegmentHtml = function(segment) {
	return '' +
		'<li>' +
		'<a href="/segments/'+segment.id+'">'+segment.name+'</a>' + 
		'<br>' +
		'<span>'+metersToMiles(segment.distance).toFixed(1)+' mi</span> <span>'+segment.avg_grade.toFixed(1)+'%</span>' +
		'</li>'; 
};

var generateModuleHtml = function(segments, bounds) {
	return '' +
		'<div class="module nearby-segments">' +
		'<h4>Nearby Segments</h4>' +
		'<ul>' +
		_.map(segments, generateSegmentHtml).join('') +
		'</ul>' +
		'<p><a href="'+getExploreUrl(bounds)+'">Explore...</a></p>' +
		'</div>' +
		'';
};

var getExploreUrl = function(bounds, location) {
	var lat = (bounds.lat.max+bounds.lat.min)/2;
	var lng = (bounds.lng.max+bounds.lng.min)/2;
	var zoom = getZoomLevel(bounds);
	return '/segments/explore#location/'+escape(location).replace(/%2C/g, ',')+'/type/cycling/min/0/max/5/surface/undefined/center/'+lat+','+lng+'/zoom/'+zoom+'/map_type/terrain'
};

var getSegmentSearchUrl = function(bounds) {
	// TODO: allow for passing in the activity type so we can search for things other than cycling
	return '/api/v3/segments/search?bounds='+bounds.lat.min+'%2C'+bounds.lng.min+'%2C'+bounds.lat.max+'%2C'+bounds.lng.max+'&min_cat=0&max_cat=5&activity_type=cycling';
};

function getZoomLevel(bounds) {
	var STRAVA_MAP_DIM = { height: 618, width: 918 };
	var WORLD_DIM = { height: 256, width: 256 };
	var ZOOM_MAX = 21;

	function latRad(lat) {
		var sin = Math.sin(lat * Math.PI / 180);
		var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	function zoom(mapPx, worldPx, fraction) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

	var latFraction = (latRad(bounds.lat.max) - latRad(bounds.lat.max)) / Math.PI;

	var lngDiff = bounds.lng.max - bounds.lng.min;
	var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

	var latZoom = zoom(STRAVA_MAP_DIM.height, WORLD_DIM.height, latFraction);
	var lngZoom = zoom(STRAVA_MAP_DIM.width, WORLD_DIM.width, lngFraction);

	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

var expandBounds = function(bounds) {
	return {
		lat: {
			min: bounds.lat.min - 0.005,
			max: bounds.lat.max + 0.005
		},
		lng: {
			min: bounds.lng.min - 0.005,
			max: bounds.lng.max + 0.005
		}
	}
};

var determineBounds = function(latlng) {
	return {
		lat: {
			min: _.chain(latlng).reject(function(p) { return p == null; }).map(function(p) { return p[0]; }).min().value(),
			max: _.chain(latlng).reject(function(p) { return p == null; }).map(function(p) { return p[0]; }).max().value()
		},
		lng: {
			min: _.chain(latlng).reject(function(p) { return p == null; }).map(function(p) { return p[1]; }).min().value(),
			max: _.chain(latlng).reject(function(p) { return p == null; }).map(function(p) { return p[1]; }).max().value()
		}
	};
};

var loadNearbySegmentsSection = function(id, locationName) {

	var findNearbySegments = function(bounds, callback) {
		var url = getSegmentSearchUrl(bounds);
		$.get(url, function(results) {
			//console.log(JSON.stringify(results));
			var segments = _.chain(results.segments)
				.reject(function(s) { return s.id == id })
				.take(4)
				.value();
			if (segments.length < 3) {
				findNearbySegments(expandBounds(bounds), callback);
				return;
			}
			var content = generateModuleHtml(segments, bounds);
			$('.sidebar .module:last').before(content);
			var exploreUrl = getExploreUrl(bounds, locationName);
			$('a[href="/segments/explore"]').each(function(i, v) { v.href = exploreUrl; });
		});	
	};

	$.get('/stream/segments/'+id, function(data) {
		//console.log(JSON.stringify(data));
		var bounds = determineBounds(data.latlng);
		findNearbySegments(bounds);
	});
};
