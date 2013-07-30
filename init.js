//var id = $('.starred:first').data('segment-id');

var searchForSegments = function(bounds, callback) {
	//TODO: add segment type recognition
	var url = '/api/v3/segments/search?bounds='+bounds.lat.min+'%2C'+bounds.lng.min+'%2C'+bounds.lat.max+'%2C'+bounds.lng.max+'&zoom=15&min_cat=0&max_cat=5&activity_type=cycling';
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
}

var formatSegment = function(s) {
	return '' +
		'<li>' +
		'<a href="/segments/'+s.id+'">'+s.name+'</a>' + 
		'<br>' +
		'<span>'+metersToMiles(s.distance).toFixed(1)+' mi</span> <span>'+s.avg_grade.toFixed(1)+'%</span>' +
		'</li>'; 
};

var formatModule = function(segments) {
	return '' +
		'<div class="module nearby-segments">' +
		'<h4>Nearby Segments</h4>' +
		'<ul>' +
		_.map(segments, formatSegment).join('') +
		'</ul>' +
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
			var content = formatModule(segments);
			$('.sidebar .module:last').before(content);
		});	
	};

	$.get('/stream/segments/'+id, function(data) {
		var bounds = {
			lat: {
				min: _.chain(data.latlng).map(function(p) { return p[0]; }).min().value(),
				max: _.chain(data.latlng).map(function(p) { return p[0]; }).max().value()
			},
			lng: {
				min: _.chain(data.latlng).map(function(p) { return p[1]; }).min().value(),
				max: _.chain(data.latlng).map(function(p) { return p[1]; }).max().value()
			}
		}
		findNearbySegments(bounds);
	});
};

loadNearbySegmentsSection($('.starred:first').data('segment-id'));
