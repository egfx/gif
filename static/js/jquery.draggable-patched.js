/* jquery.draggable-patched.js */
(function($) {
  var __dx, __dy;
  var __recoupLeft, __recoupTop;

  var parseIntSafe = function(value) {
    return (function(n) {
      return isNaN(n) ? 0 : n;
    })(parseInt(value, 10));
  }

  $.fn.draggablePatched = function(options) {
    options = options || {};
    return this.draggable({
      cursor: options.cursor || 'move',
      zIndex: 100,
      drag: function(event, ui) {
        __dx = ui.position.left - ui.originalPosition.left;
        __dy = ui.position.top - ui.originalPosition.top;
        ui.position.left = ui.originalPosition.left + __dx + __recoupLeft;
        ui.position.top = ui.originalPosition.top + __dy + __recoupTop;
        if (options.drag) {
          options.drag(event, ui);
        }
      },
      start: function(event, ui) {
        var left = parseIntSafe($(this).css('left'));
        var top = parseIntSafe($(this).css('top'));
        __recoupLeft = left - ui.position.left;
        __recoupTop = top - ui.position.top;
        if (options.start) {
          options.start(event, ui);
        }
      },
      stop: function(event, ui) {
        if (options.animate) {
          $(this).animate({
            left: $(this).data('oriLeft'),
            top: $(this).data('oriTop')
          }, 1000);
        if (options.stop) {
          options.stop(event, ui);
        }
      },
      create: function(event, ui) {
        $(this).data({
          oriLeft: $(this).css('left'),
          oriTop: $(this).css('top')
        });
        if (options.create) {
          options.create(event, ui);
        }
      }
    });
  }
})(jQuery);
