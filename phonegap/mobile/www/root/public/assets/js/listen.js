/**
 * 
 * @param {type} jQuery
 */
jQuery(function() {


  /* ===== Click ========= */

  jQuery(document).on('click', function(event) {

    var $element = jQuery(event.target)
      , action = $element.attr('data-action')
      , value = $element.attr('data-value')
      , target = $element.attr('data-target');
    
    if (action) {
      App.Listenner.apply('click', action, $element, value, event, target);
    }
  });


  /* ===== Change ======== */

  jQuery(document).on('change', function(event) {

    var $element = jQuery(event.target)
      , action = $element.attr('data-action')
      , value = $element.attr('data-value')
      , target = $element.attr('data-target');
    
    if (action) {
      App.Listenner.apply('change', action, $element, value, event, target);
    }

  });


  /* ===== Key Up ======== */

  jQuery(document).on('keyup', function(event) {

    var $element = jQuery(event.target)
      , action = $element.attr('data-action')
      , value = $element.attr('data-value')
      , target = $element.attr('data-target');

    if (action) {
      App.Listenner.apply('keyup', action, $element, value, event, target);
    }

  });


  /* ===== Key Press ===== */

  jQuery(document).on('keypress', function(event) {

    var $element = jQuery(event.target)
      , action = $element.attr('data-action')
      , value = $element.attr('data-value')
      , target = $element.attr('data-target');

    if (action) {

      App.Listenner.apply('keypress', action, $element, value, event, target);

    } else if (event.which === 13) {
      
      if ($element.hasClass('form-control')) {
        var operation = $element.parents('form').find('input#operation').val();
        switch(operation) {
          case 'search': 
            var custom = [{'a':'data-action','v':'view'},{'a':'data-value','v':'list'},{'a':'data-layout','v':'list'},{'a':'data-custom','v':'r=true'}]
              , c;
            for (c in custom) {
              $element.attr(custom[c].a, custom[c].v);
            }

            App.manager.view($element, 'list');
            break;
        }
      }

    }

  });

  /* ===== Window/App resize ===== */

  App.Listenner.add('resize', 'app.resize', function(evt) {
    App.View.resize();
  });

  jQuery(window).resize(function() {
    App.Listenner.resize();
  });

});
