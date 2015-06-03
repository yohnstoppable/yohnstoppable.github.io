"use strict";

var Common = {
	results: [],
	about: [],
	getData: function(data) {
		if (data.ok) {
			Common.results = data.results;
			console.log(Common.results);
		} else {
			alert(data.error);
		}
	},
	getShopData: function(data) {
		if (data.ok) {
			console.log(data.results);
			Common.about = data.results[0].About.story;
		} else {
			console.log(data.error);
		}
	}
}