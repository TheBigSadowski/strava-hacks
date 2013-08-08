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

test("getZoomLevel: zoom-level is close enough", function() {
	var bounds = {
		lat: { min: -36.374177, max: -36.358801 },
		lng: { min: 146.780473, max: 146.79407 }
	};
	var actual = getZoomLevel(bounds)
	strictEqual(actual, 16);
});

test("getSegmentSearchUrl: formatting is correct", function() {
	var bounds = { lat: { min: 10.01, max: 10.04 }, lng: { min: 45.02, max: 45.87 } };
	var expected = '/api/v3/segments/search?bounds=10.01%2C45.02%2C10.04%2C45.87&min_cat=0&max_cat=5&activity_type=cycling';
	var actual = getSegmentSearchUrl(bounds);
	deepEqual(actual, expected)
});


module('DOM Manipulation& AJAX');
test("searchIt!", function() {
	// setup (ajax)
	$.get = function(url, callback) {
		if (/stream/.test(url)) {
			callback({
				"latlng":[[37.787991,-122.459445],[37.78803,-122.459442],[37.788065,-122.459448],[37.78813,-122.459458],[37.788168,-122.459457],[37.788204,-122.459453],[37.788295,-122.459438],[37.788374,-122.45943],[37.788453,-122.45942],[37.788526,-122.459413],[37.788552,-122.459417],[37.78858,-122.459423],[37.788617,-122.459413],[37.788666,-122.459404],[37.788706,-122.459403],[37.788741,-122.459403],[37.788772,-122.459398],[37.788793,-122.459397],[37.788838,-122.4594],[37.788877,-122.459404],[37.788904,-122.459402],[37.788918,-122.459403],[37.788959,-122.459398],[37.789003,-122.459405],[37.789043,-122.459408],[37.789063,-122.459407],[37.7891,-122.459405],[37.789138,-122.459401],[37.78917,-122.459403],[37.789189,-122.459395],[37.789222,-122.459399],[37.789261,-122.459413],[37.789315,-122.459421],[37.789377,-122.459424],[37.789448,-122.459439],[37.789495,-122.459454],[37.789512,-122.459465],[37.789535,-122.45947],[37.789576,-122.459479]],
				"distance":[0,4.300000000000182,8.300000000000182,15.399999999999636,19.599999999999454,23.599999999999454,33.69999999999982,42.399999999999636,51,59.099999999999454,61.899999999999636,65.09999999999945,69.30000000000018,74.5,79,82.69999999999982,86.09999999999945,88.39999999999964,93.39999999999964,97.69999999999982,100.59999999999945,102.19999999999982,106.80000000000018,111.69999999999982,116.19999999999982,118.39999999999964,122.39999999999964,126.69999999999982,130.09999999999945,132.39999999999964,136.09999999999945,140.59999999999945,146.59999999999945,153.39999999999964,161.5,166.80000000000018,168.89999999999964,171.5,176.09999999999945],
				"altitude":[59.2,59.2,59.6,60.2,60.4,60.6,61,61.4,61.6,61.8,62,62.6,63,63.4,63.8,64.4,64.8,65.2,65.8,66.4,67,67.4,68,68.6,69,69.4,70.2,70.8,71.2,71.6,72.4,72.8,73.4,73.8,74,74.6,74.8,75.2,75.6]
			});
		} else {
			callback({"segments":[
				{"id":652196,"name":"Arguello Bump","climb_category":0,"climb_category_desc":"NC","avg_grade":9.31078,"start_latlng":[37.787990821525455,-122.4594452418387],"end_latlng":[37.789576007053256,-122.4594793561846],"elev_difference":16.39999999999999,"distance":176.14},
				{"id":623067,"name":"Camino Alto Loop","climb_category":0,"climb_category_desc":"NC","avg_grade":0.000457691,"start_latlng":[37.7885601203889,-122.459334265441],"end_latlng":[37.7886601164937,-122.459445325658],"elev_difference":103.2,"distance":43697.6},
				{"id":711109,"name":"Arguello Sprint (without running stop signs)","climb_category":0,"climb_category_desc":"NC","avg_grade":-1.89542,"start_latlng":[37.79279340058565,-122.46117384172976],"end_latlng":[37.790863048285246,-122.45892388746142],"elev_difference":6.799999999999997,"distance":358.76},
				{"id":1926913,"name":"Sacramento Bump","climb_category":0,"climb_category_desc":"NC","avg_grade":3.94657,"start_latlng":[37.78670310974121,-122.4589024297893],"end_latlng":[37.78717911802232,-122.45521095581353],"elev_difference":13.000000000000007,"distance":329.4},
				{"id":1284313,"name":"Arguello bump one block only","climb_category":0,"climb_category_desc":"NC","avg_grade":10.1148,"start_latlng":[37.788404552266,-122.45940643362701],"end_latlng":[37.789234360679984,-122.45939444750547],"elev_difference":9.600000000000009,"distance":94.91},
				{"id":1486529,"name":"Cherry Pop","climb_category":0,"climb_category_desc":"NC","avg_grade":5.54549,"start_latlng":[37.786146719008684,-122.4567408207804],"end_latlng":[37.7894719876349,-122.45736309327185],"elev_difference":20.200000000000003,"distance":364.26},
				{"id":2618317,"name":"Arguello ramp","climb_category":0,"climb_category_desc":"NC","avg_grade":6.34872,"start_latlng":[37.78591328300536,-122.45908842422068],"end_latlng":[37.78972872532904,-122.45921021327376],"elev_difference":28,"distance":441.034},
				{"id":2553079,"name":"Clay Climb","climb_category":0,"climb_category_desc":"NC","avg_grade":5.57766,"start_latlng":[37.78751028701663,-122.45919546112418],"end_latlng":[37.78798034414649,-122.45562292635441],"elev_difference":17.799999999999997,"distance":319.13}
			]});
		}
	};
	
	// setup (structure)
	$('#structure').html(
		'<a id="link1" href="/segments/explore">one</a>' +
		'<a id="link2" href="/some/other/link">two</a>' +
		'<a id="link3" href="/segments/explore">three</a>' +
		'<div class="sidebar">' +
			'<div class="module">bla</div>' +
			'<div class="module">bla</div>' +
			'<div class="module">bla</div>' +
		'</div>'
	);
	
	// act
	loadNearbySegmentsSection(652196);
	
	// verify
	var html = $('#structure').html();
	ok(/Nearby Segments/.test(html), "Nearby Segments section should be added");
	ok(!/652196/.test(html), "nearby segments should not inculde the segment we are currently viweing");
	ok(/623067/.test(html), "nearby segments should include segment 623067");
	ok(/711109/.test(html), "nearby segments should include segment 711109");
	ok(/1926913/.test(html), "nearby segments should include segment 1926913");
	ok(/1284313/.test(html), "nearby segments should include segment 1284313");
	ok(!/1486529/.test(html), "nearby segments should not include segment 623067 - we should limit the segments to 4");
	
	ok(/explore#location/.test($('#link1').attr('href')), "location of link 1 should be refined");
	equal($('#link2').attr('href'), '/some/other/link', "location of link 2 should not be changed");
	ok(/explore#location/.test($('#link3').attr('href')), "location of link 3 should be refined");	
});

test("loadNearbySegmentsSection: bounds expand when first search doesn't find enough segments", function() {
	// setup (ajax)
	var firstCall = true;
	$.get = function(url, callback) {
		if (/stream/.test(url)) {
			callback({
				"latlng":[[37.787991,-122.459445],[37.78803,-122.459442],[37.788065,-122.459448],[37.78813,-122.459458],[37.788168,-122.459457],[37.788204,-122.459453],[37.788295,-122.459438],[37.788374,-122.45943],[37.788453,-122.45942],[37.788526,-122.459413],[37.788552,-122.459417],[37.78858,-122.459423],[37.788617,-122.459413],[37.788666,-122.459404],[37.788706,-122.459403],[37.788741,-122.459403],[37.788772,-122.459398],[37.788793,-122.459397],[37.788838,-122.4594],[37.788877,-122.459404],[37.788904,-122.459402],[37.788918,-122.459403],[37.788959,-122.459398],[37.789003,-122.459405],[37.789043,-122.459408],[37.789063,-122.459407],[37.7891,-122.459405],[37.789138,-122.459401],[37.78917,-122.459403],[37.789189,-122.459395],[37.789222,-122.459399],[37.789261,-122.459413],[37.789315,-122.459421],[37.789377,-122.459424],[37.789448,-122.459439],[37.789495,-122.459454],[37.789512,-122.459465],[37.789535,-122.45947],[37.789576,-122.459479]],
				"distance":[0,4.300000000000182,8.300000000000182,15.399999999999636,19.599999999999454,23.599999999999454,33.69999999999982,42.399999999999636,51,59.099999999999454,61.899999999999636,65.09999999999945,69.30000000000018,74.5,79,82.69999999999982,86.09999999999945,88.39999999999964,93.39999999999964,97.69999999999982,100.59999999999945,102.19999999999982,106.80000000000018,111.69999999999982,116.19999999999982,118.39999999999964,122.39999999999964,126.69999999999982,130.09999999999945,132.39999999999964,136.09999999999945,140.59999999999945,146.59999999999945,153.39999999999964,161.5,166.80000000000018,168.89999999999964,171.5,176.09999999999945],
				"altitude":[59.2,59.2,59.6,60.2,60.4,60.6,61,61.4,61.6,61.8,62,62.6,63,63.4,63.8,64.4,64.8,65.2,65.8,66.4,67,67.4,68,68.6,69,69.4,70.2,70.8,71.2,71.6,72.4,72.8,73.4,73.8,74,74.6,74.8,75.2,75.6]
			});
		} else if (firstCall) {
			firstCall = false;
			callback({"segments":[
				{"id":652196,"name":"Arguello Bump","climb_category":0,"climb_category_desc":"NC","avg_grade":9.31078,"start_latlng":[37.787990821525455,-122.4594452418387],"end_latlng":[37.789576007053256,-122.4594793561846],"elev_difference":16.39999999999999,"distance":176.14},
				{"id":623067,"name":"Camino Alto Loop","climb_category":0,"climb_category_desc":"NC","avg_grade":0.000457691,"start_latlng":[37.7885601203889,-122.459334265441],"end_latlng":[37.7886601164937,-122.459445325658],"elev_difference":103.2,"distance":43697.6},
				{"id":711109,"name":"Arguello Sprint (without running stop signs)","climb_category":0,"climb_category_desc":"NC","avg_grade":-1.89542,"start_latlng":[37.79279340058565,-122.46117384172976],"end_latlng":[37.790863048285246,-122.45892388746142],"elev_difference":6.799999999999997,"distance":358.76}
			]});
		} else {
			callback({"segments":[
				{"id":652196,"name":"Arguello Bump","climb_category":0,"climb_category_desc":"NC","avg_grade":9.31078,"start_latlng":[37.787990821525455,-122.4594452418387],"end_latlng":[37.789576007053256,-122.4594793561846],"elev_difference":16.39999999999999,"distance":176.14},
				{"id":623067,"name":"Camino Alto Loop","climb_category":0,"climb_category_desc":"NC","avg_grade":0.000457691,"start_latlng":[37.7885601203889,-122.459334265441],"end_latlng":[37.7886601164937,-122.459445325658],"elev_difference":103.2,"distance":43697.6},
				{"id":711109,"name":"Arguello Sprint (without running stop signs)","climb_category":0,"climb_category_desc":"NC","avg_grade":-1.89542,"start_latlng":[37.79279340058565,-122.46117384172976],"end_latlng":[37.790863048285246,-122.45892388746142],"elev_difference":6.799999999999997,"distance":358.76},
				{"id":1926913,"name":"Sacramento Bump","climb_category":0,"climb_category_desc":"NC","avg_grade":3.94657,"start_latlng":[37.78670310974121,-122.4589024297893],"end_latlng":[37.78717911802232,-122.45521095581353],"elev_difference":13.000000000000007,"distance":329.4},
				{"id":1284313,"name":"Arguello bump one block only","climb_category":0,"climb_category_desc":"NC","avg_grade":10.1148,"start_latlng":[37.788404552266,-122.45940643362701],"end_latlng":[37.789234360679984,-122.45939444750547],"elev_difference":9.600000000000009,"distance":94.91},
				{"id":1486529,"name":"Cherry Pop","climb_category":0,"climb_category_desc":"NC","avg_grade":5.54549,"start_latlng":[37.786146719008684,-122.4567408207804],"end_latlng":[37.7894719876349,-122.45736309327185],"elev_difference":20.200000000000003,"distance":364.26},
				{"id":2618317,"name":"Arguello ramp","climb_category":0,"climb_category_desc":"NC","avg_grade":6.34872,"start_latlng":[37.78591328300536,-122.45908842422068],"end_latlng":[37.78972872532904,-122.45921021327376],"elev_difference":28,"distance":441.034},
				{"id":2553079,"name":"Clay Climb","climb_category":0,"climb_category_desc":"NC","avg_grade":5.57766,"start_latlng":[37.78751028701663,-122.45919546112418],"end_latlng":[37.78798034414649,-122.45562292635441],"elev_difference":17.799999999999997,"distance":319.13}
			]});
		}
	};
	
	// setup (structure)
	$('#structure').html(
		'<a id="link1" href="/segments/explore">one</a>' +
		'<a id="link2" href="/some/other/link">two</a>' +
		'<a id="link3" href="/segments/explore">three</a>' +
		'<div class="sidebar">' +
			'<div class="module">bla</div>' +
			'<div class="module">bla</div>' +
			'<div class="module">bla</div>' +
		'</div>'
	);
	
	// act
	loadNearbySegmentsSection(652196);
	
	// verify
	var html = $('#structure').html();
	ok(/Sacramento Bump/.test(html), "we should query twice for the data and use the second set, since it has more results");
});
