if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (isNaN(n)) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) { return -1; }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var O = Object(this);
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    if ({}.toString.call(callback) !== "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    if (thisArg) {
      T = thisArg;
    }

    k = 0;

    while (k < len) {
      var kValue;
      if (Object.prototype.hasOwnProperty.call(O, k)) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

(function (window, document, JSON, Object) {
// DO NOT MOVE ALL CODE 2 SPACES RIGHT - IT WILL BREAK ALL HISTORY
var talkable = window.curebit = window.talkable = function() {
  var customerData = {};

  var config = {
    testing: false,
    debug: false,
    site_id: '',
    server: 'https://www.talkable.com',
    version: '4.0.0',
    queue_check_interval: 200,
    async: false,
    url_length_limit: 2000, // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url
    current_location: window.location.href,
    timeout: 15,
    overrides: {
      init: {},
      register_affiliate: {},
      register_purchase: {},
      register_event: {}
    }
  };

  var postmessage = {
    send: function(json, target, targetElement) {
      var self = this;

      // some validation
      if (typeof target === "undefined") {
        throw new Error('You must supply a target as a string');
      }

      if (typeof targetElement === 'undefined') {
        targetElement = window.parent;
      }

      targetElement.postMessage(self._serialize(json), target);
    },

    listen: function(callback) {
      var self = this;

      var receiveMessage = function(e) {
        callback(self._unserialize(e.data));
      };

      // add the listener
      if (window.addEventListener) {
        window.addEventListener('message', receiveMessage, false);
      } else {
        // IE 8
        window.attachEvent('onmessage', receiveMessage);
      }
    },

    _unserialize: function(string) {
      try {
        var o = JSON.parse(string);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object",
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
          return o;
        }
      } catch(ex) {
          return;
      }
    },

    _serialize: function(obj) {
      return JSON.stringify(obj);
    }
  };

  var Base64 = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }

      return output;
    },

    decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = Base64._utf8_decode(output);

      return output;
    },

    _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },

    _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }

      return string;
    }
  };

  var utils = {
    lastLoadedIframeName: [],
    gleamRewardCallback: undefined,

    log: function(message, source) {
      if (typeof window.console !== "undefined" && config.debug) {
        source = source || 'all-' + config.version;
        console.log(source + ' >> ' + message);
      }
    },

    serialize: function(object, prefix) {
      var i, key;
      if (!object) {
        return "";
      }
      if (!prefix && !this.isObject(object)) {
        throw new Error("Url parameters should be a javascript hash");
      }
      var s = [];
      if (this.isArray(object)) {
        for (i = 0, object.length; i < object.length; ++i) {
          s.push(this.serialize(object[i], prefix + "[]"));
        }
      } else if (this.isObject(object)) {
        for (key in object) {
          if (!this.hasProperty(object, key)) continue;
          var prop = object[key];
          if (!(prop != null)) { // jshint ignore:line
            continue;
          }
          if (prop === 0) {
            prop = prop.toString();
          }
          if (prefix != null) { // jshint ignore:line
            key = "" + prefix + "[" + key + "]";
          }
          var fragment = this.serialize(prop, key);
          if (fragment) {
            s.push(this.serialize(prop, key));
          }
        }
      } else {
        if (object) {
          s.push("" + (encodeURIComponent(prefix.toString())) + "=" + (encodeURIComponent(object.toString())));
        }
      }
      return s.length ? s.join("&") : "";
    },

    merge: function(target, src) {
      var array = Array.isArray(src);
      var dst = array && [] || {};

      if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function(e, i) {
          if (typeof dst[i] === 'undefined') {
            dst[i] = e;
          } else if (typeof e === 'object') {
            dst[i] = utils.merge(target[i], e);
          } else {
            if (target.indexOf(e) === -1) {
              dst.push(e);
            }
          }
        });
      } else {
        if (target && typeof target === 'object') {
          Object.keys(target).forEach(function (key) {
            dst[key] = target[key];
          });
        }
        Object.keys(src).forEach(function (key) {
          if (typeof src[key] !== 'object' || !src[key]) {
            dst[key] = src[key];
          }
          else {
            if (!target[key]) {
              dst[key] = src[key];
            } else {
              dst[key] = utils.merge(target[key], src[key]);
            }
          }
        });
      }

      return dst;
    },

    clone: function(object) {
      // WARNING: this is not a deep clone!
      return utils.merge(object, {});
    },

    subscribe: function(name, iframe_name, callback) {
      postmessage.listen(function(message) {
        if (message && message.type == name && callback) {
          var container = document.getElementById(iframe_name);
          if (container) iframe_name = container.getElementsByTagName('iframe').length && container.getElementsByTagName('iframe')[0].name;
          if (!message.iframe_name || iframe_name != message.iframe_name) return;
          var iframe = document.querySelector("iframe[name='" + message.iframe_name + "']");
          if (!iframe) return;
          callback(message.data, iframe);
        }
      });
    },

    publish: function (name, iframe_name, data, is_global) {
      var server = config.server,
          msg_data = {
            type: name,
            iframe_name: iframe_name,
            data: data || {}
          };

      if (typeof is_global != "undefined" && is_global)
        server = "*";

      if (utils.lastLoadedIframeName.indexOf(iframe_name) !== -1 && window.frames[iframe_name])
        postmessage.send(msg_data, server, window.frames[iframe_name]);
      else
        this.subscribe('offer_loaded', iframe_name, function(data, iframe_data) {
          if (iframe_data.name == iframe_name)
            postmessage.send(msg_data, server, window.frames[iframe_name]);
        });
    },

    notifyIntegrationError: function(message, dev) {
      utils.addImage(
        // In case occurred conflict
        // Taking namespace from previous version of library
        // Because it has site_id in configuration
        utils.namespace(window.talkable.config.server, window.talkable.config.site_id) + '/notify_integration_error.gif?' +
        utils.serialize({
          message: message,
          dev: dev
        })
      );
    },

    isBrowserSupported: function() {
      return !((window.navigator.userAgent.indexOf("MSIE 6.0") > -1) || (window.navigator.userAgent.indexOf("MSIE 7.0") > -1));
    },

    getIframeCreationExtension: function() {
      return this.isBrowserSupported() ? 'html' : 'gif';
    },

    documentAppend: function(node) {
      document.body.appendChild(node);
    },

    isObject: function(object) {
      return this.getObjectType(object) == "[object Object]";
    },

    isArray: function(object) {
      return this.getObjectType(object) == "[object Array]";
    },

    isGenerated: function(el) {
      return el.getAttribute("data-talkable-generated") == "true";
    },

    getObjectType: function(object) {
      return Object.prototype.toString.call(object);
    },

    hasProperty: function(options, key) {
      return options.hasOwnProperty(key);
    },

    setAttributes: function(element, attrs) {
      for (var key in attrs) {
        element.setAttribute(key, attrs[key]);
      }
    },

    location_parameters: function() {
      var vars = {};
      var current_location = config.current_location.split('#')[0];
      var hashes = current_location.slice(current_location.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        var hash = hashes[i].split('=');
        if (typeof hash[1] !== 'undefined') vars[hash[0]] = decodeURIComponent(hash[1]);
      }
      return vars;
    },

    location_parameter: function(name) {
      return this.location_parameters()[name];
    },

    matches: function(matcher) {
      if (matcher.blank) {
        return true;
      } else if (matcher.regexp) {
        return window.location.href.match(RegExp(matcher.regexp));
      } else {
        if (matcher.host_pattern) {
          if (window.location.hostname !== matcher.host_pattern) {
            return false;
          }
        }
        if (Object.keys(matcher.query_pattern).length) {
          var matched = true;
          for (var name in matcher.query_pattern) {
            var pair = name + '=' + matcher.query_pattern[name];
            matched = matched && (window.location.search.indexOf(pair) != -1);
          }
          if (!matched) {
            return false;
          }
        }
        if (matcher.path_pattern) {
          if (window.location.pathname !== matcher.path_pattern) {
            return false;
          }
        }
        return true;
      }
    },

    match_placements: function() {
      var matched = [];
      var placements = talkablePlacementsConfig.placements;
      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var inclusion_matched = this.matches(placement.inclusion_matcher);
        var exclusion_matched = false;

        for (var k = 0; k < placement.exclusion_matchers.length; k++) {
          var matcher = placement.exclusion_matchers[k];
          exclusion_matched = exclusion_matched || this.matches(matcher);
        }
        if (inclusion_matched && !exclusion_matched) {
          matched.push(placement.id);
        }
      }
      if (matched.length == 0) {
        matched = ["0"];
      }
      return matched;
    },

    ensureInitialized: function() {
      if (!window.talkable.initialized) {
        throw new Error("You need to call 'init' first");
      }
    },

    namespace: function(server, site_id) {
      return (server || config.server) + '/public/' + encodeURIComponent(site_id || config.site_id);
    },

    addImage: function(url) {
      utils.log('addImage: ' + url);

      if (document.images) {
        (new Image()).src=url;
      }
    },

    defaultIframeOptions: function(name) {
      name = name || 'talkable-offer';
      return {
        container: name,
        name: name + '-iframe'
      }
    },

    insertIframeIntoContainer: function(iframe, containerId) {
      var containerEl = document.getElementById(containerId.replace("#", ""));
      if (containerEl) {
        containerEl.innerHTML = "";
        containerEl.appendChild(iframe);
      } else {
        this.domReady(function() {
          containerEl = document.getElementById(containerId.replace("#", ""));
          if (containerEl) {
            containerEl.innerHTML = "";
          } else {
            containerEl = document.createElement("div");
            containerEl.setAttribute("data-talkable-generated", true);
            containerEl.setAttribute("id", containerId);

            document.body.appendChild(containerEl);
          }
          containerEl.appendChild(iframe);
        });
      }
    },

    addIframeElement: function(url, options) {
      utils.log('addIframeElement: ' + url);

      options = utils.clone(options || {});
      options.frameBorder = "0";
      options.allowTransparency = true;
      options.src = url;
      var container = options.container || utils.generateRandomIframeName();
      delete options.container;
      utils.addRandomIframeName(options);

      var iframe = null;
      var styleTag = null;
      iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.opacity = "0";
      this.setAttributes(iframe, options);
      this.insertIframeIntoContainer(iframe, container);

      utils.subscribe('responsive_iframe_height', iframe.name, function(data, iframe) {
        iframe.style.height = data.height + "px";
      });

      utils.subscribe('change_offer_state', iframe.name, function(data, iframe) {
        if (data.campaign_appearance === "inline" && iframe.parentNode && utils.isGenerated(iframe.parentNode)) return;
        if (!data) return;
        if (!data.offer_state) return;
        if (!data.offer_state_attribute) return;
        if (data.width) iframe.style.width = data.width;
        if (data.height) iframe.style.height = data.height;
        currentAttribute = document.body.getAttribute(data.offer_state_attribute) || "";
        if (data.action == "add" && currentAttribute.indexOf(data.offer_state) == -1) {
          document.body.setAttribute(data.offer_state_attribute, (data.offer_state + " " + currentAttribute).trim());
        } else if (data.action == "remove") {
          document.body.setAttribute(data.offer_state_attribute, currentAttribute.replace(data.offer_state, "").trim());
        } else if (data.action == "set") {
          document.body.setAttribute(data.offer_state_attribute, data.offer_state);
        }

        setTimeout(function() {
          if (document.all && !window.atob) {
            // need to update DOM to apply styles in IE <= 9
            document.body.className = document.body.className;
          }
        }, 0);
      });

      utils.subscribe('set_location', iframe.name, function(data, iframe) {
        if (!data) return;
        if (data.href && data.href.indexOf("javascript:") == -1) {
          window.location.href = data.href;
        }
      });

      utils.subscribe('scroll_to', iframe.name, function(data, iframe) {
        if (data.selector) {
          var matches = document.querySelectorAll(data.selector);
          if (matches.length > 0) data.y = matches[0].offsetTop;
        }
        window.scrollTo(data.x, data.y || iframe.offsetTop);
      });

      utils.subscribe('offer_close', iframe.name, function(data, iframe) {
        //reset iframe load state
        var index = utils.lastLoadedIframeName.indexOf(iframe.name);
        if (index != -1) {
          utils.lastLoadedIframeName.splice(index, 1);
        }

        iframe.parentNode.removeChild(iframe);
        styleTag && styleTag.parentNode.removeChild(styleTag);
        iframe = null;
        styleTag = null;
      });

      utils.subscribe('offer_loaded', iframe.name, function(data) {
        utils.lastLoadedIframeName.push(iframe.name);
        data.current_visitor_uuid ? utils.setUUID(data.current_visitor_uuid) : utils.deleteUUID();

        if (data.perform_snapshot) utils.scrapeDOM();

        if (utils.gleamRewardCallback && data.gleam_reward) {
          try {
            utils.gleamRewardCallback(data.gleam_reward)
          } catch (ex) {
            utils.log(ex)
          }
        }

        if (data.campaign_appearance === "inline" && iframe.parentNode && utils.isGenerated(iframe.parentNode)) return;
        if (!data.integration_css) return;
        if (!data.integration_css.css) return;
        styleTag = document.createElement('style');
        styleTag.id = data.integration_css.attribute_value;
        styleTag.type = 'text/css';

        if (styleTag.styleSheet) {
          styleTag.styleSheet.cssText = data.integration_css.css;
        } else {
          styleTag.appendChild(document.createTextNode(data.integration_css.css));
        }

        if (!document.getElementById(data.integration_css.attribute_value)) {
          document.body && document.body.appendChild(styleTag);
        }

        if (data.integration_css.attribute_name && data.integration_css.attribute_value) {
          iframe.setAttribute(data.integration_css.attribute_name, data.integration_css.attribute_value);
        }
      });

      return iframe;
    },

    buildJs: function(url) {
      var result = document.createElement('script');
      result.type = 'text/javascript';
      result.async = config.async;
      result.src = url;
      return result;
    },

    addJs: function(url) {
      utils.log('addJs: ' + url);
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(utils.buildJs(url), s);
    },

    createUrl: function(path, parameters) {
      var create_url = utils.namespace() + path;
      var items = null;
      parameters = utils.merge({v: config.version}, parameters);
      if (parameters.o && parameters.o.i) {
        items = parameters.o.i;
        delete parameters.o.i;
      }
      create_url = create_url + "?" + utils.serialize(parameters);

      if (items) {
        for(var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemsParams = "&" + utils.serialize(
            { product_id: item.product_id, price: item.price, quantity: item.quantity },
            "o[i]["+i+"]"
          );
          if ((create_url + itemsParams).length < config.url_length_limit) {
            create_url += itemsParams;
          }
        }
      }

      return create_url;
    },

    formIframe: function(options, url_path, url_parameters) {
      if (options.iframe.container && options.iframe.container == options.trigger_widget.container)
        throw new Error("`trigger_widget` container should be different from `iframe` container.");

      this.fetchInternalIPIfNeeded(!options.iframe.container, function(internal_ip) {
        url_path = url_path + '.' + utils.getIframeCreationExtension();

        if (internal_ip && url_parameters.o) url_parameters.o.internal_ip_address = internal_ip;
        if (url_parameters.o && url_parameters.o.email) url_parameters.o.email = Base64.encode(url_parameters.o.email);
        if (utils.getUUID()) url_parameters.cvuuid = utils.getUUID();

        var create_url = utils.createUrl(url_path, url_parameters);

        utils.showOffer(utils.merge(options, {url: create_url}));
      });
    },

    showOffer: function(options) {
      if (utils.isBrowserSupported()) {
        var iframe_options = utils.merge(utils.defaultIframeOptions(), options.iframe),
            overlayName = iframe_options.name + "-overlay";

        var triggered_iframe_options = {
          container: overlayName,
          name: overlayName
        };

        if (options.trigger_widget && options.trigger_widget.container) {
          iframe_options = utils.merge(utils.defaultIframeOptions(), options.trigger_widget);
          triggered_iframe_options = utils.merge(triggered_iframe_options, options.iframe);
        }

        var iframe = utils.addIframeElement(options.url, iframe_options);

        utils.subscribe('offer_triggered', iframe.name, function(data) {
          utils.addIframeElement(config.server + data.offer_share_path, triggered_iframe_options);
        });

      } else {
        utils.addImage(options.url);
      }
    },

    cleanupRegisterData: function(data) {
      delete data.campaign_tags;
      delete data.device; // deprecated parameter
      delete data.iframe;
      delete data.campaign_template; // deprecated parameter
      delete data.trigger_widget;
      delete data.tkbl_expand;
      delete data.custom_properties;
    },

    extractOriginData: function(data, key) {
      var result;
      if (this.hasProperty(data, key)) {
        // Support for subhashes
        result = utils.merge(data.customer || {}, data[key]);
        delete data.customer;
      } else {
        result = data;
      }

      return result;
    },

    doubleIntegrationCheck: function() {
      var another_integration = window.curebit || window.talkable;
      if (another_integration) {
        utils.notifyIntegrationError(
          'Another integration.js with version ' +
          another_integration.config.version + ' conflicts with current ' + config.version + ' on ' + window.location.href
        );
      }
    },

    internalIP: null,

    fetchInternalIPIfNeeded: function(skip_async, callback) {
      // Do not try to collect internal IP address
      // Implementation is left to use it when more browsers will support this feature
      if (callback) callback(null);
      return;

      if (skip_async || utils.internalIP) {
        if (callback) callback(utils.internalIP);
        return;
      }

      //compatibility for firefox and chrome
      var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var useWebKit = !!window.webkitRTCPeerConnection;

      if (!RTCPeerConnection) {
        if (callback) callback(utils.internalIP);
        return;
      }

      //minimal requirements for data connection
      var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
      };

      var servers;
      if (useWebKit) servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

      var pc = null;
      try { pc = new RTCPeerConnection(servers, mediaConstraints); } catch(e) {}

      if (!pc) {
        if (callback) callback(utils.internalIP);
        return;
      }

      var callback_executed = false;

      function handleCandidate(candidate) {
        var ipv4_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        var ipv4_matches = ipv4_regex.exec(candidate);
        var ip_addr = ipv4_matches && ipv4_matches[1];

        if (!ip_addr) {
          var ipv6_regex = /([\da-fA-F]{1,4}(:[\da-fA-F]{1,4}){7})/;
          var ipv6_matches = ipv6_regex.exec(candidate);
          ip_addr = ipv6_matches && ipv6_matches[1];
        }

        if (!ip_addr) return;

        // RegEx according to https://en.wikipedia.org/wiki/Private_network
        if (!utils.internalIP && ip_addr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01])\.|[fF][cCdD])/)) {
          utils.internalIP = ip_addr;
        }

        if (utils.internalIP && callback && !callback_executed) {
          callback_executed = true;
          callback(utils.internalIP);
        }
      }

      // async detection
      pc.onicecandidate = function(ice) {
        if (ice.candidate) handleCandidate(ice.candidate.candidate);
      };

      pc.createDataChannel("");
      pc.createOffer(function(result){
        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});
      }, function(){});

      //make sure callback will be executed in case no ip detected
      setTimeout(function() {
        if (!callback_executed && callback) {
          callback_executed = true;
          callback(utils.internalIP);
        }
      }, 500);
    },

    generateRandomIframeName: function(callback) {
      // only if iframe.name specified as null
      return 'talkable_integration_' + Math.random().toString(36).substring(2);
    },

    addRandomIframeName: function(params) {
      var name = this.generateRandomIframeName();
      if (params && !params.name) {
        params.name = name;
      }
      return name;
    },

    scrapeDOM: function () {
      var iframeName = utils.lastLoadedIframeName[utils.lastLoadedIframeName.length - 1];

      if (document.documentElement) {
        var doctypeNode = document.doctype;
        var doctypeString = "<!DOCTYPE " +
            doctypeNode.name +
            (doctypeNode.publicId ? ' PUBLIC "' + doctypeNode.publicId + '"' : '') +
            (!doctypeNode.publicId && doctypeNode.systemId ? ' SYSTEM' : '') +
            (doctypeNode.systemId ? ' "' + doctypeNode.systemId + '"' : '') +
            '>';
        var domString = doctypeString;
        domString += "<html>";
        domString += document.documentElement.innerHTML;
        domString += "</html>";

        this.publish('dom_capture', iframeName, {dom: domString, url: document.location.href});
      }
    },

    domReady: function(callback) {
      var ready = false;

      var detach = function() {
        if (document.addEventListener) {
          document.removeEventListener("DOMContentLoaded", completed);
          window.removeEventListener("load", completed);
        } else {
          document.detachEvent("onreadystatechange", completed);
          window.detachEvent("onload", completed);
        }
      };

      var completed = function() {
        if (!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
          ready = true;
          detach();
          callback();
        }
      };

      if (document.readyState === "complete") {
        callback();
      } else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", completed);
        window.addEventListener("load", completed);
      } else {
        document.attachEvent("onreadystatechange", completed);
        window.attachEvent("onload", completed);

        var top = false;

        try {
          top = window.frameElement == null && document.documentElement; // jshint ignore:line
        } catch(e) {}

        if (top && top.doScroll) {
          (function scrollCheck() {
            if (ready) return;

            try {
              top.doScroll("left");
            } catch(e) {
              return setTimeout(scrollCheck, 50);
            }

            ready = true;
            detach();
            callback();
          })();
        }
      }
    },

    getCookie: function(name) {
      var query = '(^|; )'+ name +'=([^;]*)';
      return (document.cookie.match(query) || []).pop();
    },

    setCookie: function(name, value) {
      if (!name || !value) return;
      var date = new Date();
      date.setTime(date.getTime() + (7300 * 24 * 60 * 60 * 1000)); // 7300 days ~ 20 years
      document.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/';
    },

    deleteCookie: function(name) {
      document.cookie = name +'=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },

    getUUID: function() {
      return this.getCookie('uuid');
    },

    setUUID: function(current_visitor_uuid) {
      this.setCookie('uuid', current_visitor_uuid);
    },

    deleteUUID: function() {
      this.deleteCookie('uuid');
    }
  };

  utils.doubleIntegrationCheck();

  var methods = {
    init: function(options) {
      for (var key in options) {
        if (!utils.hasProperty(options, key)) continue;
        config[key] = options[key];
      }
      if (!config.site_id) {
        throw new Error('site_id must be specified!');
      }
      this.initialized = true;
    },

    authenticate_customer: function(data) {
      var registerData = utils.clone(data || {});
      var customer = registerData.customer ? utils.clone(registerData.customer) : registerData;
      if (utils.isObject(customer)) customerData = customer;
    },

    register_affiliate: function(data) {
      utils.ensureInitialized();
      var registerData = utils.clone(data || {});

      var affiliate_member = registerData.customer || registerData.affiliate_member || {};
      var options = {
        iframe: registerData.iframe || {},
        trigger_widget: registerData.trigger_widget || {}
      };
      var url_parameters = ['email', 'first_name', 'last_name', 'traffic_source'];
      for (var i = 0; i < url_parameters.length; i++) {
        var parameter = url_parameters[i];
        if (utils.location_parameter(parameter)) {
          affiliate_member[parameter] = utils.location_parameter(parameter);
        }
      }

      var parameters = {
        o: utils.merge(customerData, affiliate_member),
        campaign_tags: utils.location_parameter('campaign_tags') || registerData.campaign_tags,
        affiliate_campaign_id: utils.location_parameter('tkbl_campaign_id'),
        custom_properties: registerData.custom_properties,
        tkbl_expand: utils.location_parameter('tkbl_expand') || registerData.expand_trigger_widget,
        matched_placement_ids: utils.match_placements(),
        ts: talkablePlacementsConfig.timestamp,
        ii: talkablePlacementsConfig.integration_id
      };

      utils.formIframe(options, '/affiliate_members/create', parameters);
    },

    register_purchase: function(data) {
      utils.ensureInitialized();
      var registerData = utils.clone(data || {});
      var purchase = utils.extractOriginData(registerData, "purchase");

      if (purchase.customer_email) {
        purchase.email = purchase.customer_email;
        delete purchase.customer_email;
      }

      var items = purchase.items;
      delete purchase.items;

      var options = {
        iframe: registerData.iframe || {},
        trigger_widget: registerData.trigger_widget || {}
      };
      var campaign_tags       = utils.location_parameter('campaign_tags') || registerData.campaign_tags;
      var custom_properties   = registerData.custom_properties;
      var verification_digest = registerData.verification_digest;

      utils.cleanupRegisterData(registerData);

      var parameters = {
        o: utils.merge(customerData, purchase),
        campaign_tags: campaign_tags,
        affiliate_campaign_id: utils.location_parameter('tkbl_campaign_id'),
        custom_properties: custom_properties,
        matched_placement_ids: utils.match_placements(),
        ts: talkablePlacementsConfig.timestamp,
        ii: talkablePlacementsConfig.integration_id
      };

      if (items) {
        parameters.o.i = [];
        for(var i = 0; i < items.length; i++) {
          var item = items[i];
          parameters.o.i.push({
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity
          });
          // Also register the products if the vars are specified
          if (item.url || item.image_url || item.title) {
            methods._register_products([{
              product_id: item.product_id,
              url: item.url,
              image_url: item.image_url,
              title: item.title,
              price: item.price
            }]);
          }
        }
      }

      utils.formIframe(options, '/purchases/create', parameters);
    },

    register_event: function(data) {
      utils.ensureInitialized();
      var registerData = utils.clone(data || {});

      var options = {
        iframe: registerData.iframe || {},
        trigger_widget: registerData.trigger_widget || {}
      };
      var campaign_tags       = utils.location_parameter('campaign_tags') || registerData.campaign_tags;
      var custom_properties   = registerData.custom_properties;

      utils.cleanupRegisterData(registerData);

      var event = utils.extractOriginData(registerData, "event");

      var parameters = {
        o: utils.merge(customerData, event),
        campaign_tags: campaign_tags,
        affiliate_campaign_id: utils.location_parameter('tkbl_campaign_id'),
        custom_properties: custom_properties,
        matched_placement_ids: utils.match_placements(),
        ts: talkablePlacementsConfig.timestamp,
        ii: talkablePlacementsConfig.integration_id
      };

      utils.formIframe(options, '/events/create', parameters);
    },

    show_offer: function(options) {
      utils.showOffer(options);
    },

    gleam_reward: function (data) {
      utils.gleamRewardCallback = data.callback;
    },

    _register_products: function(products) {
      utils.ensureInitialized();
      for(var i = 0; i < products.length; i++) {
        utils.addImage(utils.createUrl('/products/create.gif', {p: products[i]}));
      }
    }
  };

  var before_methods = {
    callbacks: {},

    register: function(method_name, callback) {
      before_methods.callbacks[method_name] = callback;
    }
  };

  return {
    initialized: false,
    config: config,
    before: before_methods.register,
    methods: methods,
    domReady: utils.domReady,
    subscribe: utils.subscribe,
    publish: utils.publish,
    scrapeDOM: utils.scrapeDOM,

    check: function() {
      var _config, _delayedCallArgs;

      if (typeof _curebitq !== 'undefined') _config = _curebitq;
      if (typeof _talkableq !== 'undefined') _config = _talkableq;
      if (!_config) return;

      while((_delayedCallArgs = _config.shift())) {
        var method = _delayedCallArgs.shift();
        _delayedCallArgs[0] = utils.merge(
          _delayedCallArgs[0], talkable.config.overrides[method] || {}
        );

        if(callback = before_methods.callbacks[method]) {
          _delayedCallArgs[0] = callback.apply(talkable, _delayedCallArgs);
        }
        if(_delayedCallArgs[0]) {
          methods[method].apply(talkable, _delayedCallArgs)
        }
      }
    },

    run: function() {
      talkable.check();
      talkable._timer = setInterval(talkable.check, config.queue_check_interval);
    },

    _timer: null
  };
}();

// %OVERRIDES%

talkable.run();

// DO NOT MOVE ALL CODE 2 SPACES RIGHT - IT WILL BREAK ALL HISTORY
}(window, document, JSON, Object));
