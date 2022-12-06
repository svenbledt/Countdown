$(function () {
  $('.countdown__logo').pixellate('out');
  $('#text-anim1').text('THE WAITING IS OVER').hide(0).delay(1500).show(0).delay(50).hide(0).delay(50).show(0).delay(50).hide(0).delay(50).show(0).delay(50).hide(0).delay(50).show(0).fadeOut(1500)
  setTimeout(function () { $('.countdown__logo').pixellate('in'); }, 3500);
  setTimeout(function () { $('#youtube-audio').fadeIn(1500); $('#discord').fadeIn(1500); $('#text-anim2').fadeIn(1500); $('#text-anim4').fadeIn(1500); $('#text-anim3').fadeIn(1500); }, 3500);
});

var pluginName = 'pixellate',
  defaults = {
    columns: 15,
    rows: 15,
    duration: 1500,
    direction: 'out',
    scale: false,
    explosionOrigin: [0, 0]
  };

function Plugin(el, options) {
  this.$el = $(el);
  this.options = $.extend({}, defaults, options);
  this._defaults = defaults;
  this._name = pluginName;

  this.init();
};

Plugin.prototype = {
  init: function () {
    if (!this.$el.find('.pixellate-pixel').length) {
      var $img = this.$el.find('img:first-child'),
        img = new Image();

      this.$el
        .data('pixellate-image', $img.attr('src'))
        .addClass('pixellate-lock');
      $img.css('visibility', 'hidden');

      $(img).one('load', $.proxy(this.createPixels, this));

      img.src = this.$el.data('pixellate-image');
      if (img.complete) $(img).trigger('load');
    } else {
      this.stylePixels();
    }
  },

  createPixels: function () {
    this.$el.append(new Array((this.options.rows * this.options.columns) + 1).join('<span class="pixellate-pixel"></span>'));

    this.stylePixels(true);
  },

  stylePixels: function (initializeStyles) {
    var self = this,
      w = this.$el.width(),
      h = this.$el.height(),
      columns = this.options.columns,
      rows = this.options.rows,
      $pixels = this.$el.find('.pixellate-pixel');

    var styles = initializeStyles ? {
      'position': 'absolute',
      'width': (w / columns),
      'height': (h / rows),
      'background-image': 'url(' + this.$el.data('pixellate-image') + ')',
      'background-size': w,
      'backface-visibility': 'hidden'
    } : {};

    for (var idx = 0; idx < $pixels.length; idx++) {
      var pixelStyles = {};

      if (initializeStyles) {
        var x = (idx % columns) * styles.width,
          y = (Math.floor(idx / rows)) * styles.height;

        $.extend(pixelStyles, styles, {
          'left': x,
          'top': y,
          'background-position': (-x) + 'px ' + (-y) + 'px'
        });
      }

      if (self.options.direction == 'out') {
        var randX = (Math.random() * 300) - 150 - (self.options.explosionOrigin[0] * 150),
          randY = (Math.random() * 300) - 150 - (self.options.explosionOrigin[1] * 150);

        var transformString = 'translate(' + randX + 'px, ' + randY + 'px)';
        if (self.options.scale) {
          transformString += ' scale(' + (Math.random() * 1.5 + 0.5) + ')';
        }

        $.extend(pixelStyles, {
          'transform': transformString,
          'opacity': 0,
          'transition': self.options.duration + 'ms ease-out'
        });
      } else if (self.options.direction == 'in') {
        $.extend(pixelStyles, {
          'transform': 'none',
          'opacity': 1,
          'transition': self.options.duration + 'ms ease-in-out'
        });
      }

      $pixels.eq(idx).css(pixelStyles);
    }

    // Use rAF to ensure styles are set before class is modified
    requestAnimationFrame(function () {
      if (self.options.direction == 'out') {
        self.$el.removeClass('pixellate-lock');
      } else if (self.options.direction == 'in') {
        self.$el.one('pixellate-imploded', function () {
          self.$el.addClass('pixellate-lock');
        });
      }
    });

    // Fire plugin events after animation completes
    // TODO: Use transition events when supported
    setTimeout(function () {
      if (self.options.direction == 'out')
        self.$el.trigger('pixellate-exploded');
      else if (self.options.direction == 'in')
        self.$el.trigger('pixellate-imploded');
    }, this.options.duration);
  }
};

$.fn[pluginName] = function (options) {
  return this.each(function () {
    if (!$.data(this, "plugin_" + pluginName)) {
      $.data(this, "plugin_" + pluginName, new Plugin(this, options));
    } else if (typeof options === 'string') {
      $.data(this, "plugin_" + pluginName).options.direction = options;
      $.data(this, "plugin_" + pluginName).init();
    }
  });
};


// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
  window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
  function getCurrentTimestamp() {
	return Date.now()
  }