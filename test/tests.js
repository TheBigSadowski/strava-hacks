test("metersToMiles: distance conversion is accurate enough", function() {
	var expected = 0.0621371;
	var actual = metersToMiles(100);
	strictEqual(actual, expected, "100 meters should be 0.0621371 miles");
});

test("determineBounds: simple case", function() {
	var actual = determineBounds([
		[-1, 9],
		[0, 67],
		[5, 90]
	]);
	deepEqual(actual, { lat: { min: -1, max: 5 }, lng: { min: 9, max: 90 } });
});

test("determineBounds: null points don't break bounds finding", function() {
	var actual = determineBounds([
		[0,0],
		null,
		[0,0]
	]);
	var expected = { lat: { min: 0, max: 0 }, lng: { min: 0, max: 0 } }; 
	deepEqual(actual, expected);
});

test("expandBounds: new bounds are bigger!", function() {
	var original = { lat: { min: 10.01, max: 10.04 }, lng: { min: 45.02, max: 45.87 } };
	var expanded = expandBounds(original);
	ok(original.lat.min > expanded.lat.min, "min latitude should be decreased");
	ok(original.lat.max < expanded.lat.max, "max latitude should be increased");
	ok(original.lng.min > expanded.lng.min, "min longitude should be decreased");
	ok(original.lng.max < expanded.lng.max, "max longitude should be increased");
});

test("getZoomLevel: zoom-level is close enough 1", function() {
	var bounds = {
		lat: { min: -36.374177, max: -36.358801 },
		lng: { min: 146.780473, max: 146.79407 }
	};
	var actual = getZoomLevel(bounds)
	strictEqual(actual, 16);
});