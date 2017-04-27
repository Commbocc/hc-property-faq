$(function() {

	window.PropFAQ = {
		Models: {},
		Collections: {},
		Routers: {},
		Views: {}
	};

	PropFAQ.dataDir = window.propfaq_dir_path || '/hc-property-faq/assets/propfaq';

	define([
		PropFAQ.dataDir+"/search.js",
		PropFAQ.dataDir+"/results.js",
		PropFAQ.dataDir+"/errors.js"
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
				console.log('all 1');

				var propfaq_search_view = new PropFAQ.Views.SearchView;

				propfaq_search_view.model.on('change:folio', function(that) {
					console.log(that);
				});

			},

			individual: function(id) {
				// individual Property FAQ service
				console.log('individual: ' + id);

				require([
					PropFAQ.dataDir+"/"+id+"/init.js"
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

		return PropFAQ.Routers.MainRouter;

	});
});
