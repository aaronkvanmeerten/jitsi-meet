/* global $, APP, config, AJS, interfaceConfig */

import KeyboardShortcut from '../../keyboardshortcut/keyboardshortcut';

/**
 * Associates tooltip element position (in the terms of
 * {@link UIUtil#setTooltip} which do not look like CSS <tt>position</tt>) with
 * AUI tooltip <tt>gravity</tt>.
 */
const TOOLTIP_POSITIONS = {
    'bottom': 'n',
    'bottom-left': 'ne',
    'bottom-right': 'nw',
    'left': 'e',
    'right': 'w',
    'top': 's',
    'top-left': 'se',
    'top-right': 'sw'
};

/**
 * Created by hristo on 12/22/14.
 */
 var UIUtil = {

    /**
     * Returns the available video width.
     */
    getAvailableVideoWidth: function () {
        let rightPanelWidth = 0;

        return window.innerWidth - rightPanelWidth;
    },

    /**
     * Changes the style class of the element given by id.
     */
    buttonClick: function(id, classname) {
        // add the class to the clicked element
        $("#" + id).toggleClass(classname);
    },
    /**
     * Returns the text width for the given element.
     *
     * @param el the element
     */
    getTextWidth: function (el) {
        return (el.clientWidth + 1);
    },

    /**
     * Returns the text height for the given element.
     *
     * @param el the element
     */
    getTextHeight: function (el) {
        return (el.clientHeight + 1);
    },

    /**
     * Plays the sound given by id.
     *
     * @param id the identifier of the audio element.
     */
    playSoundNotification: function (id) {
        document.getElementById(id).play();
    },

    /**
     * Escapes the given text.
     */
    escapeHtml: function (unsafeText) {
        return $('<div/>').text(unsafeText).html();
    },

    /**
     * Unescapes the given text.
     *
     * @param {string} safe string which contains escaped html
     * @returns {string} unescaped html string.
     */
    unescapeHtml: function (safe) {
        return $('<div />').html(safe).text();
    },

    imageToGrayScale: function (canvas) {
        var context = canvas.getContext('2d');
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels  = imgData.data;

        for (var i = 0, n = pixels.length; i < n; i += 4) {
            var grayscale
                = pixels[i] * 0.3 + pixels[i+1] * 0.59 + pixels[i+2] * 0.11;
            pixels[i  ] = grayscale;        // red
            pixels[i+1] = grayscale;        // green
            pixels[i+2] = grayscale;        // blue
            // pixels[i+3]              is alpha
        }
        // redraw the image in black & white
        context.putImageData(imgData, 0, 0);
    },

    /**
     * Sets a global handler for all tooltips. Once invoked, create a new
     * tooltip by merely updating a DOM node with the appropriate class (e.g.
     * <tt>tooltip-n</tt>) and the attribute <tt>content</tt>.
     */
    activateTooltips() {
        AJS.$('[data-tooltip]').tooltip({
            gravity() {
                return this.getAttribute('data-tooltip');
            },

            title() {
                return this.getAttribute('content');
            },

            html: true, // Handle multiline tooltips.

            // The following two prevent tooltips from being stuck:
            hoverable: false, // Make custom tooltips behave like native ones.
            live: true // Attach listener to document element.
        });
    },

    /**
     * Sets the tooltip to the given element.
     *
     * @param element the element to set the tooltip to
     * @param key the tooltip data-i18n key
     * @param position the position of the tooltip in relation to the element
     */
    setTooltip: function (element, key, position) {
        element.setAttribute('data-tooltip', TOOLTIP_POSITIONS[position]);
        element.setAttribute('data-i18n', '[content]' + key);

        APP.translation.translateElement($(element));
    },

    /**
     * Removes the tooltip to the given element.
     *
     * @param element the element to remove the tooltip from
     */
    removeTooltip: function (element) {
        element.removeAttribute('data-tooltip', '');
        element.removeAttribute('data-i18n','');
        element.removeAttribute('content','');
    },

    /**
     * Internal util function for generating tooltip title.
     *
     * @param element
     * @returns {string|*}
     * @private
     */
    _getTooltipText: function (element) {
        let title = element.getAttribute('content');
        let shortcut = element.getAttribute('shortcut');
        if(shortcut) {
            let shortcutString = KeyboardShortcut.getShortcutTooltip(shortcut);
            title += ` ${shortcutString}`;
        }
        return title;
    },

    /**
     * Inserts given child element as the first one into the container.
     * @param container the container to which new child element will be added
     * @param newChild the new element that will be inserted into the container
     */
    prependChild: function (container, newChild) {
        var firstChild = container.childNodes[0];
        if (firstChild) {
            container.insertBefore(newChild, firstChild);
        } else {
            container.appendChild(newChild);
        }
    },

    /**
     * Indicates if a toolbar button is enabled.
     * @param name the name of the setting section as defined in
     * interface_config.js and Toolbar.js
     * @returns {boolean} {true} to indicate that the given toolbar button
     * is enabled, {false} - otherwise
     */
    isButtonEnabled: function (name) {
        return interfaceConfig.TOOLBAR_BUTTONS.indexOf(name) !== -1
                || interfaceConfig.MAIN_TOOLBAR_BUTTONS.indexOf(name) !== -1;
    },
    /**
     * Indicates if the setting section is enabled.
     *
     * @param name the name of the setting section as defined in
     * interface_config.js and SettingsMenu.js
     * @returns {boolean} {true} to indicate that the given setting section
     * is enabled, {false} - otherwise
     */
    isSettingEnabled: function (name) {
        return interfaceConfig.SETTINGS_SECTIONS.indexOf(name) !== -1;
    },

    /**
     * Shows the element given by id.
     *
     * @param {String} the identifier of the element to show
     */
    showElement(id) {
        if ($("#"+id).hasClass("hide"))
            $("#"+id).removeClass("hide");

        $("#"+id).addClass("show");
    },

    /**
     * Hides the element given by id.
     *
     * @param {String} the identifier of the element to hide
     */
    hideElement(id) {
        if ($("#"+id).hasClass("show"))
            $("#"+id).removeClass("show");

        $("#"+id).addClass("hide");
    },

    hideDisabledButtons: function (mappings) {
        var selector = Object.keys(mappings)
          .map(function (buttonName) {
                return UIUtil.isButtonEnabled(buttonName)
                    ? null : "#" + mappings[buttonName].id; })
          .filter(function (item) { return item; })
          .join(',');
        $(selector).hide();
    },

    redirect (url) {
         window.location.href = url;
    },

     isFullScreen () {
         return document.fullScreen
             || document.mozFullScreen
             || document.webkitIsFullScreen;
     },

     /**
      * Create html attributes string out of object properties.
      * @param {Object} attrs object with properties
      * @returns {String} string of html element attributes
      */
     attrsToString: function (attrs) {
         return Object.keys(attrs).map(
             key => ` ${key}="${attrs[key]}"`
         ).join(' ');
     },

    /**
     * Checks if the given DOM element is currently visible. The offsetParent
     * will be null if the "display" property of the element or any of its
     * parent containers is set to "none". This method will NOT check the
     * visibility property though.
     * @param {el} The DOM element we'd like to check for visibility
     */
    isVisible(el) {
        return (el.offsetParent !== null);
    },

    /**
     * Shows / hides the element given by {selector} and sets a timeout if the
     * {hideDelay} is set to a value > 0.
     * @param selector the jquery selector of the element to show/hide.
     * @param show a {boolean} that indicates if the element should be shown or
     * hidden
     * @param hideDelay the value in milliseconds to wait before hiding the
     * element
     */
    animateShowElement(selector, show, hideDelay) {
        if(show) {
            if (!selector.is(":visible"))
                selector.css("display", "inline-block");

            selector.fadeIn(300,
                () => {selector.css({opacity: 1});}
            );

            if (hideDelay && hideDelay > 0)
                setTimeout(
                    function () {
                        selector.fadeOut(300,
                        () => {selector.css({opacity: 0});}
                    );
                }, hideDelay);
        }
        else {
            selector.fadeOut(300,
                () => {selector.css({opacity: 0});}
            );
        }
    },

    /**
     * Parses the given cssValue as an Integer. If the value is not a number
     * we return 0 instead of NaN.
     * @param cssValue the string value we obtain when querying css properties
     */
    parseCssInt(cssValue) {
        return parseInt(cssValue) || 0;
    },

    /**
     * Adds href value to 'a' link jquery object. If link value is null,
     * undefined or empty string, disables the link.
     * @param {object} aLinkElement the jquery object
     * @param {string} link the link value
     */
    setLinkHref(aLinkElement, link) {
        if (link) {
            aLinkElement.attr('href', link);
        } else {
            aLinkElement.css({
                "pointer-events": "none",
                "cursor": "default"
            });
        }
    }
};

export default UIUtil;
