test("things work?", function() {
	ok( 1 == "1", "Passed!" );
});

test("distance conversion - from meters to miles", function() {
	var expected = 0.0621371;
	var actual = metersToMiles(100);
	strictEqual(actual, expected, "100 meters should be 0.0621371 miles")
})