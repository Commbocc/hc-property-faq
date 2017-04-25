define([
	"esri/config",
	"esri/tasks/Locator",
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query"
], function(esriConfig, Locator, QueryTask, Query) {

	PropFAQ.Models.SearchModel = Backbone.Model.extend({

		defaults: {
			candidate: null,
			folio: null,
			last_searched: new Date
		},

		initialize: function() {
			this.on('change:search_str', this.locate);
			this.on('change:last_searched', this.setParcel);
		},

		locate: function(that) {
			var hcLocator = new Locator({
				url: "https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"
			});

			hcLocator.addressToLocations({
				address: { SingleLine: that.get('search_str') },
				maxLocations: 1
			}).then(function(response) {
				that.set('candidate', response[0]);
				that.set('last_searched', new Date);
			}).otherwise(function(err){
				PropFAQ.ThrowError('no-address');
			});
		},

		setParcel: function(that) {
			var parcel_field = 'FOLIO';

			var queryTask = new QueryTask({
				url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/HC_Parcels/MapServer/0'
			});

			var query = new Query();
			query.returnGeometry = true;
			query.outFields = [parcel_field];
			query.geometry = this.attributes.candidate.location;

			queryTask.execute(query).then(function(results){
				if (_.isUndefined(results.features[0])) {
					PropFAQ.ThrowError('no-parcel');
				} else {
					that.set('folio', results.features[0].attributes[parcel_field]);
				}
			});
		}

	});

	PropFAQ.Views.SearchView = Backbone.View.extend({

		el: '#prop-faq-form',

		events: {
			'submit': 'submit'
		},

		initialize: function() {
			this.model = new PropFAQ.Models.SearchModel;
			// this.listenTo(this.model, 'change:search_str', this.initLoading);
		},

		submit: function(e) {
			e.preventDefault();
			var form_data = this.$el.serializeArray();
			var addr_input = _.findWhere(form_data, {name: "address"}).value;
			this.model.set('search_str', addr_input);
		},

		initLoading: function(e) {
			// console.log(e)
			// if (e.changed.folio) {
			// 	$loader = $('<p class="text-center h1">').html('<i class="fa fa-spinner fa-spin fa-5x fa-fw">')
			// 	$("#prop-faq-results").html($loader);
			// }
		}

	});

	return PropFAQ.Views.SearchView;

});
