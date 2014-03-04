var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var $ = require('jquery');
var moment = require('moment');
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
      this.calendar = new Calendar('#test').render();
    });

    afterEach(function() {
      this.testBed.empty();
      this.testBed.remove();
      this.testBed.off();
    });

    it('should render calendar in `el`', function() {
      expect($('#test input[type=checkbox]')).to.have.length.above(0);
    });

    describe('without month option', function() {
      it('should render year and month', function() {
        var expected = new RegExp(moment().year() + '\\s+\\/\\s+' + (moment().month() + 1));

        expect($('.header .month').text()).to.match(expected);
      });

      it('should render dates in current month', function() {
        expect($('#test .date:not(.next-month):not(.preview-month)'))
          .to.have.length(moment().daysInMonth());
      });

      it('should render placeholder dates of preview month on first week line', function() {
        expect($('#test .date.preview-month')).to.have.length(moment().startOf('month').day());
      });

      it('should render placeholder dates of next month on last week line', function() {
        expect($('#test .date.next-month')).to.have.length(6 - moment().endOf('month').day());
      });

      describe('per date', function() {
        beforeEach(function() {
          this.firstDay = $('.date:not(.next-month):not(.preview-month)').first();          
        });

        it('should render the date in label', function() {
          expect(this.firstDay.find('label').html()).to.contain(moment().startOf('month').date());
        });

        it('should render the date in input\'s value', function() {
          expect(this.firstDay.find('[name=day]').val()).to.equal(moment().startOf('month').format());
        });
      });

      describe('press `preview`', function() {
        it('should emit `prev` event', function() {
          var spy = sinon.spy();
          this.calendar.on('prev', spy);

          $('.arrows .prev a').click();

          expect(spy).to.have.been.called;
        });

        it('should render year and month', function() {
          var preview = moment().subtract(1, 'month');
          var expected = new RegExp(preview.year() + '\\s+\\/\\s+' + (preview.month() + 1));

          $('.arrows .prev a').click();

          expect($('.header .month').text()).to.match(expected);
        });

        it('should render dates in preview month', function() {
          $('.arrows .prev a').click();

          expect($('#test .date:not(.next-month):not(.preview-month)'))
            .to.have.length(moment().subtract(1, 'months').daysInMonth());
        });
      });

      describe('press `next`', function() {
        it('should emit `next` event', function() {
          var spy = sinon.spy();
          this.calendar.on('next', spy);

          $('.arrows .next a').click();

          expect(spy).to.have.been.called;
        });

        it('should render year and month', function() {
          var next = moment().add(1, 'month');
          var expected = new RegExp(next.year() + '\\s+\\/\\s+' + (next.month() + 1));

          $('.arrows .next a').click();

          expect($('.header .month').text()).to.match(expected);
        });

        it('should render dates in next month', function() {
          $('.arrows .next a').click();

          expect($('#test .date:not(.next-month):not(.preview-month)'))
            .to.have.length(moment().add(1, 'months').daysInMonth());
        });
      });
    });

    describe('#val()', function() {
      describe('when a date is selected', function() {
        it('should return the selected date', function() {
          var firstDay = $('.date:not(.next-month):not(.preview-month)').first();

          firstDay.find('[name=day]').attr('checked', true);

          expect(this.calendar.val()).to.equal(moment().startOf('month').format());
        });
      });
    });
  });
});

