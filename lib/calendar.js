'use strict';

/**
 * Module dependencies.
 */

var _ = require('underscore');
// `$` could be replaced with DOM APIs and
// removing `$` will produce more small build scripts
// if we do not have to suport ie8.
var $ = require('jquery');
var moment = require('moment');

/**
 * Default options:
 *   - name: name for radio input
 */

var DEFAULTS = {
  name: 'day'
};

/**
 * Calendar constructor.
 *
 * @param {string} el `el` to render calendar
 * @param {object} options
 *
 * @api public
 */

function Calendar(el, options) {
  if (_.isUndefined(el)) { throw new TypeError(); }

  this.$el = $(el);
  this.options = _.defaults(options || {}, DEFAULTS);
  this.render();
}

/**
 * render calendar.
 *
 * @return {Calendar} this
 * @api public
 */

Calendar.prototype.render = function() {
  this.$el.html(this.template(_.extend({
    moment: moment,
    dates: this.dates()
  }, this.templateHelpers, this.options)));
  return this;
};

// prefill + dates + postfill
Calendar.prototype.dates = function() {
  var prefill = [];
  var dates = [];
  var postfill = [];

  _.times(moment().startOf('month').day(), function(_) {
    prefill.push({
      className: 'date prefill',
      value: '-',
      disabled: true
    });
  });

  _.times(moment().daysInMonth(), function(date) {
    prefill.push({
      className: 'date',
      value: date,
      disabled: false
    });
  });

  _.times(6 - moment().endOf('month').day(), function(_) {
    prefill.push({
      className: 'date postfill',
      value: '-',
      disabled: true
    });
  });

  return prefill.concat(dates).concat(postfill);
};

/**
 * retrieve checked day value.
 *
 * @return {number} value
 * @api public
 */

Calendar.prototype.val = function() {
  return this.$el.find('[name=day]:checked').val();
};

/**
 * template
 *
 * @return {string} html string
 * @api public
 */

Calendar.prototype.template = require('./template.html');

Calendar.prototype.templateHelpers = {

  /**
   * generate id for checkbox.
   *
   * @return {number} id
   * @api private
   */

  generateId: function(num) {
    return 'calendar-' + num;
  }
};

/**
 * Expose Calendar.
 */

module.exports = exports = Calendar;
