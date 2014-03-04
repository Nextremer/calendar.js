'use strict';

var _ = require('underscore');
var $ = require('jquery');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var DEFAULTS = {
  name: 'day',
  pivotDate: moment().toDate()
};

// debug
var DEBUG = false;

var debug = ('console' in window) && DEBUG ? _.bind(console.log, console) : function() {};

/**
 * Inherits `EventEmitter`.
 */

inherits(Calendar, EventEmitter);

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
  this.pivot = this.options.pivot = moment(this.options.pivotDate);
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
  return this.$el.find('[name=day]:checked').val();
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
 * Get specified date
 *
 * @return {Moment}
 * @api private
 */

Calendar.prototype.date = function(date) {
  return this.pivot.clone().startOf('day').set('date', date);
};

/**
 * Render next month
 *
 * @api public
 */

Calendar.prototype.next = function() {
  this.pivot.add(1, 'month');
  this.render();
  this.emit('next');
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
  this.emit('prev');
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
  // TODO refactoring
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
  var startOfMonthDay = moment({ month: this.month() }).startOf('month').day();

  // preview month
  _.times(startOfMonthDay, function(_) {
    firstWeek.push({
      className: 'date preview-month',
      value: '-',
      label: '-',
      disabled: true
    });
  });

  // first week
  _.times(7 - startOfMonthDay, function(date) {
    firstWeek.push({
      className: 'date',
      label: date + 1,
      value: this.date(date + 1).format()
    });
  }, this);

  return firstWeek;
};

/**
 * Return last week array.
 *
 * @return {Array}
 * @api private
 */

Calendar.prototype.lastWeek = function() {
  var daysInMonth = moment({ month: this.month() }).daysInMonth();
  var remain = (daysInMonth + this.remainDaysInPreviewMonth()) % 7;

  if (remain === 0) { return; }

  var range = _.range(1, daysInMonth + 1).slice(- remain);
  var lastWeek = _.map(range, function(date) {
    return {
      className: 'date',
      label: date,
      value: this.date(date).format()
    };
  }, this);

  // next month
  _.times(7 - lastWeek.length, function() {
    lastWeek.push({
      className: 'date next-month',
      value: '-',
      label: '-',
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
  var month = this.month();
  return _.map(this.dateRangeInWeek(week), function(date) {
    return {
      className: 'date',
      label: date,

      value: this.date(date).format()
    };
  }, this);
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
