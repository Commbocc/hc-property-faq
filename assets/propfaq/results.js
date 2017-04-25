define([
], function() {

	PropFAQ.Models.ResultsView = Backbone.View.extend({

		el: '#prop-faq-results',

		initialize: function() {
			this.listenTo(this.model, 'change', this.render)
		},

		render: function() {
			var template = _.template( this.model.templateData() );
			var html = template( {model: this.model.attributes} );
			this.$el.html( html );
		},

	});

	return PropFAQ.Models.ResultsView;

});
