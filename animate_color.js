// jQuery Animate Color
// @cointilt
// version 1.0.1
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    var Color = {
        props: [
            'backgroundColor',
            'borderTopColor',
            'borderRightColor',
            'borderLeftColor',
            'borderBottomColor',
            'outlineColor',
            'color'
        ]
    };

    // Check RGBA capability
    Color.hasRGBA = function () {
        // Lets use Modernizr if installed
        if (typeof Modernizr !== 'undefined' && Modernizr.version) {
            if (Modernizr.rgba) {
                return true;
            }

            return false;
        }

        // Fallback to old way
        var test = $('script:first'),
            color = test.css('color');

        if (/^rgba/.test(color)) {
            return true;
        } else if (color != test.css('color', 'rgba(0, 0, 0, .2').color) {
            return true;
        }

        return false;
    };

    // translate color
    Color.convertRGBA = function (css) {
        var test = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(css),
            test2 = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(css),
            test3 = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(css),
            test4 = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(css);

        if (test) {
            return [parseInt(test[1], 16), parseInt(test[2], 16), parseInt(test[3], 16), 1];
        } else if (test2) {
            return [parseInt(test2[1], 16) * 17, parseInt(test2[2], 16) * 17, parseInt(test2[3], 16) * 17, 1];
        } else if (test3) {
            return [parseInt(test3[1], 10), parseInt(test3[2], 10), parseInt(test3[3], 10), 1];
        } else if (test4) {
            return [parseInt(test4[1], 10), parseInt(test4[2], 10), parseInt(test4[3], 10),parseFloat(test4[4])];
        }

        return;
    };

    // create color
    Color.createColor = function (start, end, so_far) {
        var color = 'rgb',
            r = parseInt((start[0] + so_far * (end[0] - start[0])), 10),
            g = parseInt((start[1] + so_far * (end[1] - start[1])), 10),
            b = parseInt((start[2] + so_far * (end[2] - start[2])), 10);

        color += $.support.rgba ? 'a' : '';
        color += '(' + r + ', ' + g + ', ' + b;

        if ($.support.rgba) {
            color += ', ' + (start && end ? parseFloat(start[3] + so_far * (end[3] - start[3])) : 1);
        }

        color += ')';

        return color;
    };

    // Extend jQuery support with RGBA (create function and self)
    $.extend(true, $, {
        support: {
            rgba: Color.hasRGBA()
        }
    });

    $.each(Color.props, function (i, property) {
        $.Tween.propHooks[property] = {
            get: function (tween) {
                return $(tween.elem).css(property);
            },

            set: function (tween) {
                var style = tween.elem.style,
                    start = Color.convertRGBA($(tween.elem).css(property)),
                    end = Color.convertRGBA(tween.end);

                tween.run = function (so_far) {
                    style[property] = Color.createColor(start, end, so_far);
                };
            }
        };
    });
}));
