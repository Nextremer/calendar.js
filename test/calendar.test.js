var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var $ = require('jquery');
var Calendar = require('../');

chai.use(sinonChai);

describe('Calendar', function() {
  describe('when Calendar is called without `el`', function() {
    it('should throw Error', function() {
      expect(function() {
        new Calendar();
      }).to.throw(TypeError);
    });
  });

  describe('when Calendar is called with `el`', function() {
    beforeEach(function() {
      this.testBed = $('<div id=\"test\"/>').appendTo('body');
    });

    afterEach(function() {
      this.testBed.remove();
    });

    it('should render calendar in `el`', function() {
      expect($('#test input[type=radio]')).to.have.length.above(0);
    });
  });
});

