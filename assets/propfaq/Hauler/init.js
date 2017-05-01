define([
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query",
	"text!"+PropFAQ.dataDir+"/Hauler/template.html",
	PropFAQ.dataDir+"/Hauler/providers.js",
	PropFAQ.dataDir+"/Hauler/errors.js",
], function(QueryTask, Query, Template) {

	PropFAQ.Models.HaulerInfoModel = Backbone.Model.extend({

		defaults: {
			search_str: null
		},

		initialize: function(folio) {
			var that = this;
			this.on('change:feature', this.setAttrs);

			var queryTask = new QueryTask({
				url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_HAULER_DATA2/MapServer/1'
			});

			var query = new Query();
			query.outFields = ['*'];
			query.where = 'Folio=' + folio;

			queryTask.execute(query).then(function(results){
				if (_.isUndefined(results.features[0])) {
					PropFAQ.ThrowError('no-sw-info');
				} else {
					that.set('feature', results.features[0]);
				}
			});

		},

		templateData: function() {
			return Template;
		},

		setAttrs: function() {
			feature_attrs = this.attributes.feature.attributes;
			this.set( 'g_days', get_dows(feature_attrs.Garbage) );
			this.set( 'r_days', get_dows(feature_attrs.Recycling) );
			this.set( 'yw_days', get_dows(feature_attrs.YardWaste) );
			this.set( 'next_g_days', get_next_days(feature_attrs.Garbage, false) );
			this.set( 'next_r_days', get_next_days(feature_attrs.Recycling, true) );
			this.set( 'next_yw_days', get_next_days(feature_attrs.YardWaste, false) );
			this.set( 'provider', PropFAQ.dataProviders.where_id(feature_attrs.Provider) );
		}

	});

	var get_dows = function(search_str) {
		var milidays = _.map(str_to_dow_ints_arr(search_str), function(dow) {
			return next_xday(dow);
		});

		dows = _.map(milidays, function(d) {
			date = new Date(d);
			var options = { weekday: 'long' };
			date_str = date.toLocaleDateString('en-US', options);
			return date_str.split(',')[0]+'s';
		});

		return dows.join(' & ');
	}

	var get_next_days = function() {
		var search_str = arguments[0];
		var is_recycling = arguments[1];

		var milidays = _.map(str_to_dow_ints_arr(search_str), function(dow) {
			return next_xday(dow);
		}).sort();

		return _.map(milidays, function(d) {
			date = new Date(d);
			var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			date_str = date.toLocaleDateString('en-US', options);
			if (is_holiday(date, is_recycling)) { date_str = "HOLIDAY - NO PICKUP: " + date_str; }
			return date_str;
		});
	}

	// holiday logic

	var is_holiday = function() {
		var test_date = arguments[0];
		var is_recycling = arguments[1] || false;
		var temp_date, date_d, date_m, date_w, date_wnum, date_str1, date_str2, date_str3;

		// new years, independence, christmas
		date_d = test_date.getUTCDate();
		date_m = test_date.getUTCMonth() + 1;
		date_str1 = [date_m, date_d].join('/');
		if (date_str1 === '1/1' && is_recycling) {
			return false;
		}
		if (date_str1 === '1/1' || date_str1 === '7/4' || date_str1 === '12/25') {
			return true;
		}

		// labor, thanksgiving
		date_w = test_date.getUTCDay();
		date_wnum = Math.floor((date_d - 1) / 7) + 1;
		date_str2 = [date_m, date_wnum, date_w].join('/');
		if (date_str2 === '9/1/1' || date_str2 === '11/4/4') {
			return true;
		}

		// memorial
		temp_date = new Date(test_date);
		temp_date.setDate(1);
		temp_date.setMonth(temp_date.getMonth() + 1);
		temp_date.setDate(temp_date.getDate() - 1);
		date_wnum = Math.floor((temp_date.getDate() - date_d - 1) / 7) + 1;
		date_str3 = [date_m, date_wnum, date_w].join('/');
		if (date_str3 === '5/1/1') {
			return true;
		}

		return false;
	};

	var str_to_dow_ints_arr = function(search_str) {
		var dows = [
			{str: 'sun', dow: 0},
			{str: 'mon', dow: 1},
			{str: 'tue', dow: 2},
			{str: 'wed', dow: 3},
			{str: 'thu', dow: 4},
			{str: 'fri', dow: 5},
			{str: 'sat', dow: 6}
		];

		return _.chain(dows).map(function(dow_obj){
			return (search_str.toLowerCase().indexOf(dow_obj.str) >= 0) ? dow_obj.dow : false;
		}).compact().value();
	}

	var next_xday = function(dow) {
		var d = new Date();
		// var d = new Date('5/24/2017');
		//var d = new Date('6/28/2017');
		return d.setDate(d.getDate() + (dow + 7 - d.getDay()) % 7);
	}

	return PropFAQ.Models.HaulerInfoModel;

});
