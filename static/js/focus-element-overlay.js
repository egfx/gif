/*!
 * Focus element overlay (Focusable) v0.1
 * https://github.com/zzarcon/focusable
 *
 * Copyright (c) 2014 @zzarcon <hezarco@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Date: 2014-11-18
 */

(function(exports) {
  var hasOwn = Object.prototype.hasOwnProperty;
  var $columnWrapper = null;
  var $element = null;
  var isVisible = false;
  var columnClass = 'focusable-column';
  var columnSelector = '.' + columnClass;
  var defaults = {
    fadeDuration: 700,
    hideOnClick: false,
    hideOnESC: false,
    findOnResize: false,
    context: 'body'
  };
  var options = {};
  var previousCssPosition = null;

  $(document).ready(setup);

  function setup() {
    // $columnWrapper = $('body');
    createPlugin();
    addStylesheet();
    addEvents();
  }

  function getDefaults() {
    return defaults;
  }


  /**
   * Defines Focusable as jQuey plugin
   * @return {jQuery object} this
   */
  function createPlugin() {
    if (!window.jQuery || !window.$ || !window.$.fn) {
      return;
    }

    $.fn.focusable = function(options) {
      Focusable.setFocus(this, options);
      return this;
    };
  }

  function addEvents() {
    // $columnWrapper.on('click', columnSelector, clickOnOverlay);
    $(window).on("resize", resizeHandler);
    $(window).on("keyup", keyupHandler);
  }

  function resizeHandler() {
    if (!$element) {
      return;
    }
    //Refind the element
    $element = options.findOnResize ? $($element.selector) : $element;

    refresh();
  }

  function keyupHandler(e) {
    options.hideOnESC && e.keyCode === 27 && isVisible && hide();
  }

  function clickOnOverlay() {
    if (!options.hideOnClick) {
      return;
    }

    hide();
  }

  function setFocus($el, userOptions) {
    
    options = merge(merge({}, defaults), userOptions);
    $columnWrapper = $(options.context);
    previousCssPosition = $columnWrapper.css('position');
    if ($columnWrapper.css('position') === 'static' && !$columnWrapper.is('body')) {
      $columnWrapper.css('position', 'relative');
    }
    $element = $columnWrapper.find($el);

    $columnWrapper.css('overflow', 'hidden');

    $columnWrapper.on('click', columnSelector, clickOnOverlay);
    createColumns(false);
    $columnWrapper.find(columnSelector).fadeIn(options.fadeDuration);
  };

  function clearColumns() {
    $columnWrapper.find(columnSelector).remove();
  }

  function hide() {
    isVisible = false;
    $element = null;
    $columnWrapper.find(columnSelector).fadeOut(options.fadeDuration, function() {
      clearColumns();
      $columnWrapper.css('overflow', '');
      $columnWrapper.css('position', previousCssPosition);
      previousCssPosition = null;
    });

  }

  function createColumns(forceVisibility) {
    if (!$element) {
      return;
    }

    var createdColumns = 0;
    isVisible = true;
    clearColumns();

    while (createdColumns < 4) {
      createColumn(createdColumns);
      createdColumns++;
    }

    if (forceVisibility === true) {
      $(columnSelector).show();
    }
  }

  function createColumn(index) {
    var offset = 0;
    var top = 0,
        left = 0,
        width = px($element.outerWidth()),
        height = "999999999px",
        parentTop = 0,
        parentLeft = 0;


    var offset = $element.offset();
    var contextOffset = $columnWrapper.offset();

    if (options.context) {
      // offset = $element.position();
      parentTop = contextOffset.top;
      parentLeft = contextOffset.left;
    } else {
      offset = $element.offset();
    }

    var styles = '';

    switch (index) {
      case 0:
        width = px(offset.left - parentLeft);
        break;
      case 1:
        left = px(offset.left - parentLeft);
        height = px(offset.top - parentTop);
        break;
      case 2:
        left = px(offset.left - parentLeft);
        top = px($element.outerHeight() + offset.top - parentTop);
        break;
      case 3:
        width = "100%";
        left = px(($element.outerWidth() + offset.left - parentLeft));
        break;
    }

    styles = 'top:' + top + ';left:' + left + ';width:' + width + ';height:' + height;
    $columnWrapper.prepend('<div class="' + columnClass + '" style="' + styles + '"></div>');
  }

  /**
   * Prepend px to the received value
   * @return {String}
   */
  function px(value) {
    return value + 'px';
  }

  /**
   * Create dynamic CSS rules required by the library;
   * Using this approach we avoid to include an external css file.
   * @return {Void}
   */
  function addStylesheet() {
    var sheet = (function() {
      var style = document.createElement("style");

      style.appendChild(document.createTextNode(""));
      document.head.appendChild(style);

      return style.sheet;
    })();

    sheet.insertRule(columnSelector + "{ display:none; position: absolute; z-index: 9999; background: rgba(0,0,0,0.8); }", 0);
  }

  function getActiveElement() {
    return $element;
  }

  function getOptions() {
    return options;
  }

  function getVisibility() {
    return isVisible;
  }

  function refresh() {
    createColumns(true);
  }

  function merge(target, source) {
    for (var key in source) if (hasOwn.call(source, key)) {
      target[key] = source[key];
    }
    return target;
  }

  exports.Focusable = {
    setFocus: setFocus,
    hide: hide,
    refresh: refresh,
    getActiveElement: getActiveElement,
    getOptions: getOptions,
    isVisible: getVisibility
  };
})(window);
