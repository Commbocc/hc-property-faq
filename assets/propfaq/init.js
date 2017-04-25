$(function() {

	window.PropFAQ = {
		Models: {},
		Collections: {},
		Routers: {},
		Views: {}
	};

	PropFAQ.dataDir = PropFAQ.dataDir || '/hc-property-faq-test/assets/propfaq';

	PropFAQ.Router = Backbone.Router.extend({
		routes: {
			":id": "individual",
			"*actions": "all"
		},

		all: function() {
			// all Property FAQ services
			console.log('all');
		},

		individual: function(id) {
			// individual Property FAQ service
			console.log('individual: ' + id);

			require([
				PropFAQ.dataDir+"/"+id+"/init.js",
				PropFAQ.dataDir+"/search.js",
				PropFAQ.dataDir+"/results.js",
				PropFAQ.dataDir+"/errors.js",
				"dojo/domReady!"
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
