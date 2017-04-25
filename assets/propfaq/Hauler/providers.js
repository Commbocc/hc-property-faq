$(function() {
	window.PropFAQ = window.PropFAQ || {};

	PropFAQ.Models.ProviderModel = Backbone.Model.extend({
		defaults: {
			ids: null,
			name: null,
			address: null,
			phone: null,
			fax: null,
			email: null
		}
	});

	PropFAQ.Collections.ProviderCollection = Backbone.Collection.extend({

		model: PropFAQ.Models.ProviderModel,

		where_id: function(provider_id) {
			return _.chain(this.models).filter(function(p) {
				return _.contains(p.get('ids'), provider_id);
			}).first().value();
		}

	});

	PropFAQ.dataProviders = new PropFAQ.Collections.ProviderCollection([
		{
			ids: ['WASTE MANAGEMENT', 'WASTE MANAGEMENT OF TAMPA'],
			name: 'Waste Management of Tampa',
			address: '3411 N 40th St,<br> Tampa, Fl 33605',
			phone: '(813) 621-3053',
			fax: '(813) 740-8210',
			email: 'CentralFloridaService@wm.com'
		},
		{
			ids: ['REPUBLIC WASTE'],
			name: 'Republic Services',
			address: '5210 W Linebaugh Ave,<br> Tampa, Fl 33624',
			phone: '(813) 265-0292',
			fax: '(813) 961-3534',
			email: 'republicservicesCSR@repsrv.com'
		},
		{
			ids: ['WASTE CONNECTIONS', 'PROGRESSIVE WASTE SOLUTIONS'],
			name: 'Waste Connections, Inc.',
			address: '5135 Madison Ave,<br> Tampa, Fl 33619',
			phone: '(813) 248-3802',
			fax: '(813) 248-3606',
			email: 'cs-tampa@progressivewaste.com'
		}
	]);

});
