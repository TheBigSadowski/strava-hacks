test("distance conversion - from meters to miles", function() {
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

test("zoom-level ", function() {
	var bounds = {
		lat: { min: -36.374177, max: -36.358801 },
		lng: { min: 146.780473, max: 146.79407 }
	};
	var actual = getZoomLevel(bounds)
	strictEqual(actual, 16);
});