/*
 *
 */
var App = {

    name: 'Gennesis',
    debug: true,

    log: function(exception) {
      if (App.debug) {
        console.log(exception.message);
      } else {
        alert(exception.message);
      }
    },

    dao: {
      conection: null,
      seed: function() {

        try {

          App.dao.conection.transaction(
            function (tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO');
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
              tx.executeSql('INSERT INTO DEMO (id, data) VALUES (?, ?)', [1, 'First']);
              tx.executeSql('INSERT INTO DEMO (id, data) VALUES (?, ?)', [2, 'Second']);
            },
            function(error) {
              //alert("Error processing SQL: " + err.code);
            },
            function() {
              //alert("success!");
            }
          );

          App.dao.conection.transaction(
            function(tx) {
              tx.executeSql("SELECT COUNT(id) AS cnt FROM DEMO", [], function(tx, res) {
                alert("res.rows.length: " + res.rows.length + " -- should be 1");
                alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 2");
              })
          });
        } catch (e) {

        }
      }
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    exit: function() {

      navigator.notification.vibrate(100);
      navigator.notification.confirm("Are you sure you want to exit?", function(button) {
        if (button === 2) {
            return;
        } else {
          navigator.app.exitApp();
        }
      }, "Confirmation", ["Yes","No"]);
    },
    status: {
      show: function() {
        StatusBar.show();
      },
      hide: function() {
        StatusBar.hide();
      }
    },
    notification: {

      vibrate: function(type) {

        var time = 10;
        switch (type) {
          case 'short':
            time = 100;
            break;
          case 'medium':
            time = 100;
            break;
          case 'long':
            time = 100;
            break;
        }
        navigator.notification.vibrate(time);
      },

      add: function(title, message, ticker) {
        try {
          /**
           * title: is the title of the notification, in a standard notification;
           * text: is the text of the notification, in a standard notification;
           * ticker: is the text displayed in the status bar when the notification first arrives;
           * enableExtraEffects: is a boolean value indicating whether vibrate and make sounds as well as lights when notification arrives;
           * success: is a callback method, which will be called when showing notification successfully;
           * error: is a callback method, which will be called when showing notification fails.
          */
          window.StatusBarNotification.sendNotify(
              title, message
            , ticker ? ticker : '', false
            , function() {

            }, function() {

            }
          );

        } catch (e) {
          App.log(e);
        }
      }
    },
    window: {

      toast: function (text) {

        setTimeout(function () {
          if (device.platform != 'windows') {
            try {

              window.plugins.toast.showShortBottom(text);
            } catch (e) {
              App.log(e);
            }
          } else {
            if (dialog) {
              App.dialog.content = text;
              return;
            }
            App.dialog = new Windows.UI.Popups.MessageDialog(text);
            App.dialog.showAsync().done(function () {
              App.dialog = null;
            });
          }
        }, 100);
      },
      confirm: function(message, callback, title, buttons) {

        navigator.notification.confirm(message, function(button) {
          if (button === 2) {
              return;
          } else {
            try {
              callback.call();
            } catch (e) {
              App.log(e);
            }
          }
        }, title ? title : App.name, buttons ? buttons : ['Yes','No']);
      },
      alert: function(message, title, button) {
        navigator.notification.alert(message, function() {
          return;
        }, title ? title : App.name, 'Close');
      }
    },
    backbutton: {

      active: false
    },

    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);

        if (App.backbutton.active) {
          document.addEventListener('backbutton', function(event) {
            try {
              event.preventDefault();
              App.exit();
            } catch (e) {
              App.log(e);
            }
          });
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

      App.receivedEvent('deviceready');
      App.notification.add('Dashboad', 'Teste');

      try {

        App.dao.conection = window.openDatabase("bootstrap.db", "1.0", "Bootstrap Database", 1000000);
      } catch (e) {
        App.log(e);
      }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    },
    screen: {

      scroll: function(selector) {

        var st = jQuery(document).scrollTop()
        , H = jQuery(document).height()
        , h = jQuery(window).height()
        , opacity = 0;

        this.$top = (this.$top) ? this.$top : jQuery('nav.navbar.navbar-inverse');

        opacity = (1 * ((st) / (H - h)));

        this.$top.css('opacity', 1 - opacity);
      }
    }
};

