var thisSegment = {
	id: $('.starred:first').data('segment-id'),
	location: $('.location:first').text()
};

loadNearbySegmentsSection(thisSegment.id, thisSegment.location);
