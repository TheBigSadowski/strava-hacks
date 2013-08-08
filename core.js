var searchForSegments = function(bounds, callback) {
	//TODO: add segment type recognition
	var url = '/api/v3/segments/search?bounds='+bounds.lat.min+'%2C'+bounds.lng.min+'%2C'+bounds.lat.max+'%2C'+bounds.lng.max+'&min_cat=0&max_cat=5&activity_type=cycling';
	http.get(url, function(res) {
		res.body = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) { res.body += chunk; });
		res.on('end', function() {
			var results = JSON.parse(res.body);
			callback(null, results);
		});
	});
};

var metersToMiles = function(distance) {
	return distance * 0.000621371;
};

var formatSegment = function(s) {
	return '' +
		'<li>' +
		'<a href="/segments/'+s.id+'">'+s.name+'</a>' + 
		'<br>' +
		'<span>'+metersToMiles(s.distance).toFixed(1)+' mi</span> <span>'+s.avg_grade.toFixed(1)+'%</span>' +
		'</li>'; 
};

var getExploreUrl = function(bounds) {
	var lat = (bounds.lat.max+bounds.lat.min)/2;
	var lng = (bounds.lng.max+bounds.lng.min)/2;
	var location = $('.location:first').text();
	var zoom = getBoundsZoomLevel(bounds, { width: 918, height: 618 });
	return '/segments/explore#location/'+escape(location).replace('%2C', ',')+'/type/cycling/min/0/max/5/surface/undefined/center/'+lat+','+lng+'/zoom/'+zoom+'/map_type/terrain'
};

function getBoundsZoomLevel(bounds, mapDim) {
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

	var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
	var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

var formatModule = function(segments, bounds) {
	return '' +
		'<div class="module nearby-segments">' +
		'<h4>Nearby Segments</h4>' +
		'<ul>' +
		_.map(segments, formatSegment).join('') +
		'</ul>' +
		'<p><a href="'+getExploreUrl(bounds)+'">Explore...</a></p>' +
		'</div>' +
		'';
};

var expand = function(bounds) {
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

var loadNearbySegmentsSection = function(id) {

	var findNearbySegments = function(bounds, callback) {
		var url = '/api/v3/segments/search?bounds='+bounds.lat.min+'%2C'+bounds.lng.min+'%2C'+bounds.lat.max+'%2C'+bounds.lng.max+'&zoom=15&min_cat=0&max_cat=5&activity_type=cycling';
		$.get(url, function(results) {
			var segments = _.chain(results.segments)
				.reject(function(s) { return s.id == id })
				.take(4)
				.value();
			if (segments.length < 3) {
				findNearbySegments(expand(bounds), callback);
				return;
			}
			var content = formatModule(segments, bounds);
			$('.sidebar .module:last').before(content);
			var exploreUrl = getExploreUrl(bounds);
			$('a[href="/segments/explore"]').each(function(i, v) { v.href = exploreUrl; });
		});	
	};

	$.get('/stream/segments/'+id, function(data) {
		var bounds = determineBounds(data.latlng);
		findNearbySegments(bounds);
	});
};
