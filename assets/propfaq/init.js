$(function() {

	window.PropFAQ = {
		Models: {},
		Collections: {},
		Routers: {},
		Views: {}
	};

	PropFAQ.Routers.MainRouter = Backbone.Router.extend({
		routes: {
			":id": "individual",
			"*actions": "all"
		},

		initialize: function(options) {
			PropFAQ.dataDir = PropFAQ.dataDir || options.dir_path;
		},

		all: function() {
			// all Property FAQ services
			console.log('all');

			require([
				"esri/tasks/Locator",
			], function(Locator) {

				var hcLocator = new Locator({
					url: "https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"
				});

				hcLocator.addressToLocations({
					address: { SingleLine: '805 sandcastle' },
					maxLocations: 1
				}).then(function(response) {
					console.log(response)
				});

			});

		},

		individual: function(id) {
			// individual Property FAQ service
			console.log('individual: ' + id);

			require([
				PropFAQ.dataDir+"/"+id+"/init.js",
				PropFAQ.dataDir+"/search.js",
				PropFAQ.dataDir+"/results.js",
				PropFAQ.dataDir+"/errors.js"
			], function(IndividualPropFaqModel) {
				var propfaq_search_view = new PropFAQ.Views.SearchView;

				propfaq_search_view.model.on('change:folio', function(that) {
					var model = new IndividualPropFaqModel(that.get('folio'));
					model.set('search_str', that.get('candidate').address);
					var propfaq_results_view = new PropFAQ.Models.ResultsView({model: model});
				});
			});

		}

	});

});
