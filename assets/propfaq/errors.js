$(function() {
	window.PropFAQ = window.PropFAQ || {};

	PropFAQ.Models.ErrorModel = Backbone.Model.extend({
		defaults: {
			id: null,
			description: null,
			alert_class: 'alert-warning',
			show_customer_support: true
		}
	});

	PropFAQ.Collections.ErrorCollection = Backbone.Collection.extend({model: PropFAQ.Models.ErrorModel});

	PropFAQ.dataErrors = new PropFAQ.Collections.ErrorCollection([
		{
			id: 'no-address',
			description: 'The address appears to be invalid.'
		},
		{
			id: 'no-parcel',
			description: 'No parcel information could be found. Try using another address near you.'
		}
	]);

	PropFAQ.Views.ErrorView = Backbone.View.extend({

		el: '#prop-faq-results',

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
		},

		template: function() {
			$alert = $('<div class="alert alert-dismissible">').addClass(this.model.get('alert_class')).html(
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			);
			$alert.append($('<p>').html(
				this.model.get('description')
			));
			if (this.model.get('show_customer_support')) {
				$alert.append(
					'<p class="small">If you feel this is an error, please contact the <a href="/government/departments/customer"><u>Customer Service Center</u></a>.</p>'
				);
			}
			return $alert;
		}

	});

	PropFAQ.ThrowError = function(error_id) {
		var error_model = PropFAQ.dataErrors.findWhere({id: error_id})
		new PropFAQ.Views.ErrorView({model: error_model});
	}

});
