'use strict';

var _ = require('underscore');
var $ = require('jquery');
var moment = require('moment');

var DEFAULTS = {
  name: 'day',
  pivot: moment()
};

// debug
var DEBUG = false;

var debug = ('console' in window) && DEBUG ? _.bind(console.log, console) : function() {};

/**
 * Initialize a new `Calendar` view.
 *
 * @param {string} el css selector string for el
 * @param {Object} options
 * @api public
 */

function Calendar(el, options) {
  if (_.isUndefined(el)) { throw new TypeError(); }

  this.$el = $(el);
  this.options = _.defaults(options || {}, DEFAULTS);
  this.pivot = this.options.pivot;
  // this.month(this.options.pivot.month());
  this.bind();
  this.render();
}

/**
 * Render calendar.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.render = function() {
  debug('render %d calendar', this.month());
  debug(this.options.pivot.toDate());
  debug(this.weeks());
  this.$el.html(this.template(_.extend({
    moment: moment,
    weeks: this.weeks()
  }, this.templateHelpers, this.options)));
  return this;
};

/**
 * Return selectted date value.
 *
 * @return {string}
 * @api public
 */

Calendar.prototype.val = function() {
  var date = this.$el.find('[name=day]:checked').val();
  return this.pivot.clone().set('date', date).startOf('day').format();
};

/**
 * Get this month
 *
 * @return {number}
 * @api public
 */

Calendar.prototype.month = function() {
  return this.pivot.month();
};

/**
 * Render next month
 *
 * @api public
 */

Calendar.prototype.next = function() {
  this.pivot.add(1, 'month');
  this.render();
  return false;
};

/**
 * Render preview month
 *
 * @api public
 */

Calendar.prototype.prev = function() {
  this.pivot.subtract(1, 'month');
  this.render();
  return false;
};

/**
 * Bind `el` events.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.bind = function() {
  _.bindAll(this, 'prev', 'next');
  this.$el.on('click', '.prev', this.prev);
  this.$el.on('click', '.next', this.next);
  return this;
};

/**
 * Return weeks array of days array.
 *
 * @return {Array}
 * @api private
 */

Calendar.prototype.weeks = function() {
  var weeks = [];

  weeks.push(this.firstWeek());

  // after second week
  _.times(this.weekCount() - 1, function(week) {
    weeks.push(this.week(week));
  }, this);

  weeks.push(this.lastWeek());

  return weeks;
};

/**
 * Return first week array.
 *
 * @return {Array}
 * @api private
 */

Calendar.prototype.firstWeek = function() {
  var firstWeek = [];

  // preview month
  _.times(moment({ month: this.month() }).startOf('month').day(), function(_) {
    firstWeek.push({
      className: 'date preview-month',
      value: '-',
      disabled: true
    });
  });

  _.times(7 - moment({ month: this.month() }).startOf('month').day(), function(date) {
    firstWeek.push({
      className: 'date',
      value: date + 1
    });
  });

  return firstWeek;
};

/**
 * Return last week array.
 *
 * @return {Array}
 * @api private
 */

Calendar.prototype.lastWeek = function() {
  var remain = (moment({ month: this.month() }).daysInMonth() + this.remainDaysInPreviewMonth()) % 7;

  if (remain === 0) { return; }

  var range = _.range(1, moment({ month: this.month() }).daysInMonth() + 1).slice(- remain);
  var lastWeek = _.map(range, function(date) {
    return {
      className: 'date',
      value: date
    };
  });

  // 翌月分
  _.times(7 - lastWeek.length, function() {
    lastWeek.push({
      className: 'date next-month',
      value: '-',
      disabled: true
    });    
  });

  return lastWeek;
};

/**
 * Return a week array.
 *
 * @param {number} week
 * @return {Array}
 * @api private
 */

Calendar.prototype.week = function(week) {
  return _.map(this.dateRangeInWeek(week), function(date) {
    return {
      className: 'date',
      value: date
    };
  });
};

/**
 * Return a date range array for `week`.
 *
 * @param {number} week
 * @return {Array}
 * @api private
 */

Calendar.prototype.dateRangeInWeek = function(week) {
  var from = 8 - moment({ month: this.month() }).startOf('month').day();
  var to = moment({ month: this.month() }).daysInMonth() + this.remainDaysInPreviewMonth();
  debug('from: %d, to: %d', from, to);
  return _.range(from, to).slice(7 * week, 7 * (week + 1));
};

/**
 * Return week count of this month.
 *
 * @return {number}
 * @api private
 */

Calendar.prototype.weekCount = function() {
  return Math.floor((moment({ month: this.month() }).daysInMonth() + this.remainDaysInPreviewMonth()) / 7);
};

/**
 * Return previous month's remain days count.
 *
 * @return {number}
 * @api private
 */

Calendar.prototype.remainDaysInPreviewMonth = function() {
  return moment({ month: this.month() }).startOf('month').day();
};

/**
 * template
 */

Calendar.prototype.template = require('./template.html');

Calendar.prototype.templateHelpers = {

  /**
   * generate id value for `num`.
   */

  generateId: function(num) {
    return 'calendar-' + num;
  }
};

/**
 * Expose Calendar.
 */

module.exports = exports = Calendar;
