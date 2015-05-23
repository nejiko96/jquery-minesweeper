(function ($) {
  module('jQuery#jqueryMinesweeper', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  // test('is chainable', function () {
  //   expect(1);
  //   strictEqual(
  //     this.elems.minesweeper(), 
  //     this.elems, 
  //     'should be chainable'
  //   );
  // });

  test('is jqueryMinesweeper', function () {
    expect(1);
    strictEqual(
      this.elems.minesweeper().text(), 
      '10mines     time : 0Retry10mines     time : 0Retry10mines     time : 0Retry', 
      'should be jqueryMinesweeper');
  });

}(jQuery));
