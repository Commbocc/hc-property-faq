$(function() {

	window.PropFAQ = {
		Models: {},
		Collections: {},
		Routers: {},
		Views: {}
	};

	PropFAQ.dataDir = window.propfaq_dir_path || '/hc-property-faq/assets/propfaq';

	define([
		// PropFAQ.dataDir+"/search.js",
		// PropFAQ.dataDir+"/results.js",
		// PropFAQ.dataDir+"/errors.js"
	], function() {


		PropFAQ.Routers.MainRouter = Backbone.Router.extend({
			routes: {
				":id": "individual",
				"*actions": "all"
			},

			initialize: function(options) {
				// PropFAQ.dataDir = PropFAQ.dataDir || options.dir_path;
			},

			all: function() {
				// all Property FAQ services
				console.log('all');

				// var propfaq_search_view = new PropFAQ.Views.SearchView;
				//
				// propfaq_search_view.model.on('change:folio', function(that) {
				// 	console.log(that);
				// });

				require([
					"esri/tasks/Locator",
					"esri/tasks/QueryTask",
					"esri/tasks/support/Query"
				], function(Locator, QueryTask, Query) {

					var hcLocator = new Locator({
						url: "https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"
					});

					var queryTask = new QueryTask({
						url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/HC_Parcels/MapServer/0'
					});

					var query = new Query();
					
					// query.returnGeometry = true;
					// query.outFields = ['FOLIO'];

					hcLocator.addressToLocations({
						address: { SingleLine: '805 sandcastle' },
						maxLocations: 1
					}).then(function(response) {
						console.log(response);

						// query.geometry = response[0].location;
						//
						// queryTask.execute(query).then(function(results){
						// 	console.log(results);
						// });
					});

				});

			},

			individual: function(id) {
				// individual Property FAQ service
				console.log('individual: ' + id);

				// require([
				// 	PropFAQ.dataDir+"/"+id+"/init.js"
				// ], function(IndividualPropFaqModel) {
				// 	var propfaq_search_view = new PropFAQ.Views.SearchView;
				//
				// 	propfaq_search_view.model.on('change:folio', function(that) {
				// 		var model = new IndividualPropFaqModel(that.get('folio'));
				// 		model.set('search_str', that.get('candidate').address);
				// 		var propfaq_results_view = new PropFAQ.Models.ResultsView({model: model});
				// 	});
				// });

			}

		});

		return PropFAQ.Routers.MainRouter;

	});
});
