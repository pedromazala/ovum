
var App = {

  /**
   *
   * @type String|type
   */
  path: '',
  /**
   *
   * @type String|type
   */
  platform: '',
  /**
   *
   * @type Boolean
   */
  online: true,
  /**
   *
   * @type String|type
   */
  storage: 'Mysql.js',
  /**
   *
   * @type String|type
   */
  token: '',
  /**
   *
   * @type type
   */
  selector: {
    side: {
        toggle: '.menu-toggle'
      , wrapper: '#wrapper'
      , toggled: 'toggled'
    },
    settings: {
        toggle: '.navbar-toggle.dropdown-toggle'
      , wrapper: '#settings-menu'
      , toggled: 'toggled'
    },
    modal: {
        body: 'modal .modal .modal-body'
      , window: 'modal .modal'
    },
    popover: '[data-toggle="popover"]',
    target: 'page .tab-pane.active .target'
  },
  /**
   *
   * @type type
   */
  config: {
    key: '',
    location: '',
    host: '',
    path: '/'
  },
  /**
   *
   * @param {type} index
   * @param {type} path
   * @param {type} platform
   * @param {type} storage
   * @returns {undefined}
   */
  init: function(index, platform, path, storage) {

    App.platform = platform;
    App.path = path;
    App.storage = storage ? storage : App.storage;

    if (index) {

      App.View.index();
      
      App.View.listen();

  		$.fn.read = function(json) {

        var read = ''
          , serialize	= []
          , jsoned = {}
          , els = $(this).find(':input').get();

        $.each(els, function() {
          if (this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))) {
            var name = this.name
              , val = $(this).val();
            if (!json) {
              serialize.push(encodeURIComponent(name) + "=" + encodeURIComponent(val));
            } else {
              jsoned[name] = val;
            }
          }
        });

        if (!json) {
          read = serialize.join("&").replace(/%20/g, "+");
        } else {
          read = jsoned;
        }

        return read;
      };
    }

    console.log('App.init 1:', platform);
    if (!path && typeof __dirname !== 'undefined') {
      App.path = require('path').dirname(__dirname);
    }
  },
  /**
   *
   * @param {type} elements
   * @returns {String}
   */
  serialize: function serialize(elements) {

    if (typeof CKEDITOR === 'object') {
      for (var i in CKEDITOR.instances) {
        CKEDITOR.instances[i].updateElement();
      }
    }

    var i, j, q = [], element;
    for (i = elements.length - 1; i >= 0; i = i - 1) {
      element = elements[i];

      if (element.name === "") {
        continue;
      }
      switch (element.nodeName) {
        case 'INPUT':
          switch (element.type) {
            case 'text':
            case 'hidden':
            case 'password':
            case 'date':
              //case 'button':
              //case 'reset':
              //case 'submit':
              q.push(element.name + "=" + encodeURIComponent(element.value));
              break;
            case 'checkbox':
              if (element.checked) {
                q.push(element.name + "=" + encodeURIComponent(1));
              } else {
                q.push(element.name + "=" + encodeURIComponent(0));
              }
              break;
            case 'radio':
              if (element.checked) {
                q.push(element.name + "=" + encodeURIComponent(element.value));
              }
              break;
            case 'file':
              break;
            default:
              q.push(element.name + "=" + encodeURIComponent(element.value));
              break;
          }
          break;
        case 'TEXTAREA':
          q.push(element.name + "=" + encodeURIComponent(element.value));
          break;
        case 'SELECT':
          switch (element.type) {
            case 'select-one':
              q.push(element.name + "=" + encodeURIComponent(element.value));
              break;
            case 'select-multiple':
              for (j = element.options.length - 1; j >= 0; j = j - 1) {
                if (element.options[j].selected) {
                  q.push(element.name + "=" + encodeURIComponent(element.options[j].value));
                }
              }
              break;
          }
          break;
        case 'BUTTON':
          switch (element.type) {
            case 'reset':
            case 'submit':
            case 'button':
              //q.push(element.name + "=" + encodeURIComponent(element.value));
              break;
          }
          break;
      }
    }
    return q.join("&");
  },
  /**
   * View class
   */
  View: {
    /**
     *
     * @returns {undefined}
     */
    index: function() {
      
      if (!App.platform) {
        App.config = {
          key: '',
          location: window.location.host,
          host: window.location.host,
          path: '/'
        };
      }

      jQuery(App.selector.side.toggle).click(function(e) {
        e.preventDefault();
        jQuery(App.selector.side.wrapper).toggleClass(App.selector.side.toggled);
      });
      jQuery(document).mouseup(function(e) {

        var $container = jQuery(App.selector.side.wrapper)
                , $toggler = jQuery(App.selector.side.toggle);

        if (
                (!$container.is(e.target) && $container.has(e.target).length === 0)
                && (!$toggler.is(e.target) && $toggler.has(e.target).length === 0)) {
          $container.addClass(App.selector.side.toggled);
        }
      });

      jQuery(App.selector.settings.toggle).click(function(e) {
        e.preventDefault();
        jQuery(this).toggleClass(App.selector.settings.toggled);
        jQuery(App.selector.settings.wrapper).toggleClass(App.selector.settings.toggled);
      });
      jQuery(document).mouseup(function(e) {

        var $container = jQuery(App.selector.settings.wrapper)
                , $toggler = jQuery(App.selector.settings.toggle);

        if (
                (!$container.is(e.target) && $container.has(e.target).length === 0)
                && (!$toggler.is(e.target) && $toggler.has(e.target).length === 0)) {
          $toggler.removeClass(App.selector.settings.toggled);
          $container.removeClass(App.selector.settings.toggled);
        }
      });

    },
    /**
     *
     * @returns {undefined}
     */
    listen: function() {
      
      /**
       *
       * @click listenner to open pages
       */
      App.Listenner.add('click', 'app-open', function(event, $element, value, after) {

        var uri = value.split('.')
          , element = $element.attr('data-element') ? $element.attr('data-element') : 'page'
          , load = $element.attr('data-load') ? ($element.attr('data-load') === 'true') : false
          , object = $element.attr('data-object')
          , view = $element.attr('data-view')
          , callback = function() {

            try {
              if (after)
                after.call();
            } catch (e) {

              console.log('View.index 1:', 'App.view.request callback error');
            }
          };

        if (uri.length === 3) {

          if (view === 'popup') {

            element = App.selector.modal.body;
            jQuery(element).html('');
            callback = function(response) {
              jQuery(App.selector.modal.window).modal();
            };
          }

          App.View.request(uri[0], uri[1], uri[2], object, load, element, callback);
        }
      });
    },
    /**
     *
     * @returns {undefined}
     */
    resize: function() {
      
    },
    /**
     *
     * @param {type} selector
     * @param {type} json
     * @returns {undefined}
     */
    bind: function(selector, json) {

      jQuery(selector).find('[data-bind]').each(function(i) {

        var $this = jQuery(this)
          , row = json.rows[0]
          , id = $this.attr('data-bind')
          , value = '';

        if (row[id]) {
          
          value = row[id];

          switch (this.nodeName) {

            // INPUT {
            case 'INPUT':
              switch (this.type) {

                case 'checkbox':
                  if (value) {
                    $this.attr('checked', true);
                  }
                  break;
                case 'radio':
                  if (value == $this.val()) {
                    $this.attr('checked', true);
                  }
                  break;
                default:
                  $this.val(value);
                  break;
              }
              break;
            //}
            // SELECT {
            case 'SELECT':
              switch (this.type) {
                case 'select-one':
                  $this.val(value);
                  break;
                case 'select-multiple':
                  $.each(value, function(i,e){
                    $this.find('option[value="' + e + '"]').prop("selected", true);
                  });
                  break;
              }
              break;
            //}
            // DEFAULT {
            default:
              $this.val(value);
              break;
            //}
          }
        }
      });
    },
    /**
     *
     * @param {type} selector
     * @param {type} response
     * @returns {undefined}
     */
    prepare: function(selector, response) {
      jQuery(selector).html(response).find(App.selector.popover).popover();
    },
    /**
     *
     * @param {type} _module
     * @param {type} _entity
     * @param {type} _operation
     * @param {type} _object
     * @param {type} load
     * @param {type} selector
     * @param {type} callback
     * @returns {undefined}
     */
    request: function(_module, _entity, _operation, _object, load, selector, callback) {

      var _token = App.token
        , url = (['screen', _module, _entity, _operation, _token]).join('/')
        , error = function (xhr, text, thrown) {
          console.error(xhr, text, thrown);
        }
        , type = 'GET'
        , dataType = 'html';

      if (load)
        _object = jQuery(_object).read(true);

      if (App.platform === 'webapp') {

        App.Ajax._open(
          //@string url
          url
          //@class object
          , {}
          //@function success
          , function (response) {

            try {
              App.View.prepare(selector, response);
              if (load && _object) {

                App.Ajax._open(
                  (['api', _module, _entity, 'get', _token]).join('/'),
                  _object,
                  function(json) {
                    App.View.bind(selector, json);
                  }, error, 'POST', 'json', false
                );
              } else {
                if (load)
                  console.error('App.View.request 1:', 'Object not Found');
              }
              callback.call(this, response);
            } catch (e) {

              console.log('App.View.request 2:', e);
            }
          }
          //@function error
          , error
          //@config request
          , type, dataType, true);
      } else {

        App.View.render(
          //@string url
          '/' + url
          //@class object
          , {}
          //@object params
          , {}
          //@function success
          , function(response) {

            try {
              App.View.prepare(selector, response);
              if (load && _object) {

                App.Controller.process(
                    '/' + (['api', _module, _entity, 'get', _token]).join('/')
                  , _object, {}, function(json) {
                    App.View.bind(selector, json);
                  });
              } else {
                if (load)
                  console.error('App.View.request:', 'Object not Found');
              }
              callback.call(this, response);
            } catch (e) {
              console.log('App.View.request 3:', e);
            }
          });

      }
    },
    /**
     *
     * @param {type} uri
     * @param {type} body
     * @param {type} get
     * @param {type} callback
     * @returns {String}
     */
    render: function(uri, body, get, callback) {

      //['', '[admin:['#','screen'] or [site:'']', 'module', 'entity', 'operation']
      try {

        var rendered = ''

          , engine = typeof ejs !== 'undefined' ? ejs : require('ejs')
          , fs = (App.platform === 'express' || App.platform === 'electron') ? require('fs') :  null

          , split = uri.split('/')
            , _type = split[1]
            , _module = split[2]
            , _entity = split[3]
            , _operation = split[4]

          , _ = App.path + '/' + 'app' + '/' + 'src' + '/' + _module + '/' + 'view' + '/' + _entity

            , _toolbar = _operation + '.toolbar.ejs'
            , _template = _operation + '.view.ejs'
            , _lang = 'lang.view.json';

        switch (_type) {
          case 'screen':
          case '#':

            var render = function(__toolbar, __template, __lang, callback) {

              var rendered = ('');
              try {

                var top = engine.render(__toolbar, {lang: __lang, orientation: 'dropdown'})
                  , bottom = engine.render(__toolbar, {lang: __lang, orientation: 'dropup'});
                

                rendered = engine.render(__template, {
                  lang: __lang, toolbar: {top: top, bottom:  bottom}, body: body, get: get}
                );

                if (callback) {
                  callback.call(this, rendered);
                }
        
              } catch (e) {

                console.log('App.View.render 1:', e.message);
              }
              
              return rendered;
            };

            if (fs) {
              
              var __toolbar = fs.readFileSync((_ + '/' + _toolbar))
                , __template = fs.readFileSync((_ + '/' +  _template))
                , __lang = JSON.parse(fs.readFileSync((_ + '/' +  _lang)));
                
              rendered = render.call(this, __toolbar.toString(), __template.toString(), __lang, callback);

            } else {

              $.get((_ + '/' + _toolbar), function(__toolbar) {
                $.get((_ + '/' + _template), function(__template) {
                  $.get((_ + '/' + _lang), function(__lang) {
                    render.call(this, __toolbar, __template, __lang, callback);
                  });
                });
              });
            }
            break;
        }

      } catch (e) {

        console.log('App.View.render 2:', e.message);
        rendered = 'error';
      }

      return rendered;
    }
  },
  /**
   *
   * Controller class
   */
  Controller: {
    /**
     *
     * @type type
     */
    _ctrl: null,
    /**
     *
     * @returns {undefined}
     */
    ctrl: function() {

      if (!App.Controller._ctrl) {
        App.Controller._ctrl = require(App.path + '/' + 'api' + '/' + 'storage' + '/' + App.storage);
        App.Controller._ctrl.dao = require(App.path + '/' + 'api' + '/' + 'storage' + '/' + 'DAO.js');
      }
      
      return App.Controller._ctrl;
    },
    /**
     *
     * @param {type} path
     * @param {type} _object
     * @param {type} get
     * @param {type} callback
     * @returns {App.Controller.data.Anonym$5}
     */
    process: function(path, _object, get, callback) {
      
      var split = path.split('/')
        , _type = split[1]
        , _module = split[2]
        , _entity = split[3]
        , _operation = split[4];

      switch(_type) {
        case 'api':

          //App.Controller._dao.select("SELECT CURDATE() AS a, CONCAT(?) AS b", ['William'], function(status, rows, fields) {
          //  console.log(status, rows, fields);
          //});
          var controller = require(App.path + '/' + 'app' + '/' + 'src' + '/' + _module + '/' + 'controller' + '/' + _entity + '.ctrl.js');

          controller.process(_operation, _object, get, callback);
          break;
     }
    }
  },
  /**
   *
   * @class Ajax class
   */
  Ajax: {
    /**
     *
     * @type Array
     */
    requests: [],
    /**
     *
     * @type type
     */
    Cache: {
      /**
       * timeout for cache in millis
       * @type {number}
       */
      timeout: 1000 * 60 * 60,/* (1000 * 60 = 1 minutos) * (10 = 1 hora)  */
      /**
       * @type {{_: number, data: {}}}
       **/
      data: {},
      /**
       *
       * @param {type} url
       * @returns {undefined}
       */
      remove: function(url) {
        delete App.Ajax.Cache.data[url];
      },
      /**
       *
       * @returns {undefined}
       */
      clear: function() {
        for (var i in App.Ajax.Cache.data) {
          delete App.Ajax.Cache.data[i];
        }
      },
      /**
       *
       * @param {type} url
       * @returns {App.Ajax.localCache.data}
       */
      exists: function(url) {
        return !!App.Ajax.Cache.data[url] && ((new Date().getTime() - App.Ajax.Cache.data[url]._) < App.Ajax.Cache.timeout);
      },
      /**
       *
       * @param {type} url
       * @returns {App.Ajax.localCache.data.data}
       */
      get: function(url) {
        return App.Ajax.Cache.data[url].data;
      },
      /**
       *
       * @param {type} url
       * @param {type} response
       * @returns {undefined}
       */
      set: function(url, response) {
        App.Ajax.Cache.remove(url);
        App.Ajax.Cache.data[url] = {
          _: new Date().getTime(),
          data: response
        };
      }
    },
    /**
     *
     * @param {type} url
     * @param {type} data
     * @param {type} sucess
     * @param {type} error
     * @param {type} label
     */
    _open: function(url, data, sucess, error, type, dataType, cache) {

      var open = true;
      if (cache) {
        if (App.Ajax.Cache.exists(url)) {
          open = false;
          window.setTimeout(sucess, 1, App.Ajax.Cache.get(url));
        }
      }

      if (open) {
        
        var id = App.Util.guid();

        App.Ajax.requests[id] = jQuery.ajax({
          url: url,
          type: type,
          dataType: dataType,
          data: data,
          success: function(response, text) {
            if (text === 'success') {
              if (typeof sucess === 'function') {
                window.setTimeout(sucess, 1, response);
              }
            }
            delete App.Ajax.requests[id];
            App.Ajax.Cache.set(url, response);
          },
          error: function(xhr, text, thrown) {
            if (typeof error === 'function') {
              window.setTimeout(error, 1, xhr, text, thrown);
            }
            delete App.Ajax.requests[id];
            App.Ajax.Cache.remove(url);
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader('auth', App.auth);
          }
        });
      }
    }
  },
  /**
   *
   * @class Cookie class
   */
  Cookie: {
    /**
     *
     * @type String
     */
    EPOCH: 'Thu, 01-Jan-1970 00:00:01 GMT',
    /**
     *
     * @type Number
     */
    RATIO: 1000 * 60 * 60, //hora
    /**
     *
     * @type Array
     */
    KEYS: ['expires', 'path', 'domain'],
    /**
     *
     * @type type
     */
    esc: escape,
    un: unescape,
    doc: typeof document !== 'undefined' ? document : null,
    credits: 'Easy Cookie - Copyright (C) 2007 Paul Duncan <pabs@pablotron.org>',
    version: '0.2.1',
    /**
     * @param name
     * @param value
     * @param time (horas)
     */
    set: function(name, value, time) {
      var expires = "";
      if (time) {
        expires = time;
      }
      return this._set(name, value, {
        expires: expires,
        path: App.config.path,
        domain: App.config.host
      });
    },
    alive: function() {
      var k = '__EC__',
              v = new Date();
      // generate test value
      v = v.toGMTString();
      // set test value
      this.set(k, v);
      // return cookie test
      this.enabled = (this.remove(k) == v);
      return this.enabled;
    },
    /*
     * .set(
     *   @param key ,// name
     *   @param value {// value
     *   @param expires: 13,// expires in 13 days
     *   @param domain: 'foo.example.com',// restrict to given domain
     *   @param path: '/some/path',// restrict to given path
     *   @param secure: true // secure cookie only
     * });
     *
     */
    _set: function(key, val /*, opt */) {
      var opt = (arguments.length > 2) ? arguments[2] : {}, now = this._now(), expire_at, cfg = {};
      var expiry = " - ";
      if (opt.expires) {
        opt.expires *= this.RATIO;
        cfg.expires = new Date(now.getTime() + opt.expires);
        cfg.expires = cfg.expires.toGMTString();
        expiry = now.getTime() + opt.expires;
      }
      var keys = ['path', 'domain', 'secure'];
      for (var i = 0; i < keys.length; i++)
        if (opt[keys[i]])
          cfg[keys[i]] = opt[keys[i]];
      var r = this._cookify(key, val, cfg);
      this.doc.cookie = r;

      return expiry;
    },
    has: function(key) {
      key = this.esc(key);
      var c = this.doc.cookie,
              ofs = c.indexOf(key + '='),
              len = ofs + key.length + 1,
              sub = c.substring(0, key.length);
      return ((!ofs && key != sub) || ofs < 0) ? false : true;
    },
    get: function(key) {
      key = this.esc(key);
      var c = this.doc.cookie,
              ofs = c.indexOf(key + '='),
              len = ofs + key.length + 1,
              sub = c.substring(0, key.length),
              end;
      if ((!ofs && key != sub) || ofs < 0)
        return null;
      end = c.indexOf(';', len);
      if (end < 0)
        end = c.length;

      return this.un(c.substring(len, end));
    },
    remove: function(k) {
      var r = this.get(k),
              opt = {
                expires: this.EPOCH
              };
      this.doc.cookie = this._cookify(k, '', opt);
      return r;
    },
    keys: function() {
      var c = this.doc.cookie,
              ps = c.split('; '),
              i, p, r = [];
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push(this.un(p[0]));
      }
      return r;
    },
    all: function() {
      var c = this.doc.cookie,
              ps = c.split('; '),
              i, p, r = [];
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push([this.un(p[0]), this.un(p[1])]);
      }
      return r;
    },
    _now: function() {
      var r = new Date();
      r.setTime(r.getTime());
      return r;
    },
    _cookify: function(c_key, c_val /*, opt */) {
      var i, key, val, r = [],
              opt = (arguments.length > 2) ? arguments[2] : {};
      r.push(this.esc(c_key) + '=' + this.esc(c_val));
      for (i = 0; i < this.KEYS.length; i++) {
        key = this.KEYS[i];
        if (val = opt[key])
          r.push(key + '=' + val);
      }
      if (opt.secure)
        r.push('secure');

      return r.join('; ');
    }

  },
  /**
   *
   * @class Util class
   */
  Util: {
    /**
     *
     * @returns {String}
     */
    guid: function() {

      var _s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      return _s4() + '' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
    },
    /**
     *
     * @return jquery
     */
    target: function() {
      return jQuery(App.selector.target);
    }

  },
  /**
   *
   * @class Listenner class
   */
  Listenner: {
    /**
     *
     * @type Boolean
     */
    loaded: false,
    /**
     *
     * @type Array
     */
    _load: [],
    /**
     *
     * @type Array
     */
    _resize: [],
    /**
     *
     * @type Array
     */
    _click: [],
    /**
     *
     * @type Array
     */
    _dblclick: [],
    /**
     *
     * @type Array
     */
    _keyup: [],
    /**
     *
     * @type Array
     */
    _keypress:[],
    /**
     *
     * @type Array
     */
    _change:[],
    /**
     *
     */
    load: function() {

      var load = App.Listenner._load
        , i = null;

      for (i in load) {
        var fnc = load[i];
        if (fnc) {
          try {
            fnc.call(this);
          } catch(e) {

          }
        }
      }

      App.Listenner.loaded = true;

      App.Listenner.resize();
    },
    /**
     *
     */
    resize: function() {

      var resize = App.Listenner._resize
        , i = null
        , height = jQuery(window).height()
        , width = jQuery(window).width();

      for (i in resize) {
        var fnc = resize[i];
        if (fnc) {
          try {
            fnc.call(this, height, width);
          } catch(e) {

          }
        }
      }

    },
    /**
     *
     * @param listen
     * @param action
     * @param fnc
     */
    add: function(listen, action, fnc) {

      switch(listen) {
        case 'load':
          if (App.Listenner.loaded) {
            try {
              fnc.call(this);
            } catch (e) {

            }
          } else {
            if (!App.Listenner._load[action]) {
              App.Listenner._load[action] = fnc;
            }
          }
          break;
        case 'resize':
          if (!App.Listenner._resize[action]) {
            App.Listenner._resize[action] = fnc;
          }
          break;
        case 'click':
          if (!App.Listenner._click[action]) {
            App.Listenner._click[action] = fnc;
          }
          break;
        case 'dblclick':
          if (!App.Listenner._dblclick[action]) {
            App.Listenner._dblclick[action] = fnc;
          }
          break;
        case 'keyup':
          if (!App.Listenner._keyup[action]) {
            App.Listenner._keyup[action] = fnc;
          }
          break;
        case 'keypress':
          if (!App.Listenner._keypress[action]) {
            App.Listenner._keypress[action] = fnc;
          }
          break;
        case 'change':
          if (!App.Listenner._change[action]) {
            App.Listenner._change[action] = fnc;
          }
          break;
      }

    },
    /**
     *
     * @param listen
     * @param action
     * @param $element
     * @param value
     * @param target
     */
    apply: function(listen, action, $element, value, evt, target) {

      var fnc = null;

      switch(listen) {
        case 'click':
          if (App.Listenner._click[action]) {
            fnc = App.Listenner._click[action];
          }
          break;
        case 'dblclick':
          if (App.Listenner._dblclick[action]) {
            fnc = App.Listenner._dblclick[action];
          }
          break;
        case 'keyup':
          if (App.Listenner._keyup[action]) {
            fnc = App.Listenner._keyup[action];
          }
          break;
        case 'keypress':
          if (App.Listenner._keypress[action]) {
            fnc = App.Listenner._keypress[action];
          }
          break;
        case 'change':
          if (App.Listenner._change[action]) {
            fnc = App.Listenner._change[action];
          }
          break;
      }

      if (fnc) {
        fnc.call(this, evt, $element, value, target);
      }

    }

  }
};

try {
  module.exports = App;
} catch (e) {
  //requirejs tratment
}