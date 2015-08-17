
var UsuarioCtrl = {
  
  /**
   *
   * @param _operation
   * @param _operation
   * @param _operation
   *
   * @return __callback response
   */
  process: function(_operation, _object, _get, __callback) {

    UsuarioCtrl.ctrl = App.Controller.ctrl();

    console.log('UsuarioCtrl.process 1:', _operation, _object, _get);

    var process = _operation + 'UsuarioCtrl';

    if (UsuarioCtrl[process]) {

      UsuarioCtrl[process].call(this, _object, _get, __callback);
    }
  },
  /**
   * 
   * @param {type} _object
   * @param {type} _get
   * @param {type} __callback
   * @returns {undefined}
   */
  getUsuarioCtrl: function(_object, _get, __callback) {

    //{ usu_codigo: '1', params: {group: 'usu_1', order: 'usu_1', begin: '0', walk: '25'}}
    
    var response = {"rows":[], "total": 0};

    var items = '*'
      , table = 'TBL_USUARIO'
      , statements = {
          "where":{}
        , "group":{}
        , "order":{}
      };

    //fields, table, where, group, order, limit
    UsuarioCtrl.ctrl.select(UsuarioCtrl.ctrl.dao.makeSql('SELECT', items, table, statements, _object), {}, function(status, rows, fields) {
      
      response["rows"] = rows;
      __callback.call(this, response);
    });

//    if ( parseInt(_object.usu_codigo) === 1) {
//
//      response.rows[0] = {
//          "usu_codigo":{"value":1}
//        , "usu_cod_USUARIO_TIPO":{"value":1}
//        , "usu_cod_INSTITUICAO":{"value":1}
//        , "usu_nome":{"value":"WILLIAM CORREA"}
//        , "usu_telefone":{"value":"3235314799"}
//        , "usu_celular":{"value":"3299564477"}
//        , "usu_login":{"value":"wilcorrea"}
//        , "usu_email":{"value":"wilcorrea@gmail.com"}
//        , "usu_administrador":{"value":1}
//        , "usu_ativo":{"value":1}
//        , "usu_level":{"value":"Nível Alto"}
//        };
//    } else {
//
//      response.rows[0] = {
//          "usu_codigo":{"value":2}
//        , "usu_cod_USUARIO_TIPO":{"value":1}
//        , "usu_cod_INSTITUICAO":{"value":1}
//        , "usu_nome":{"value":"WILLIAM CORREA"}
//        , "usu_telefone":{"value":"3235314799"}
//        , "usu_celular":{"value":"3299564477"}
//        , "usu_login":{"value":"wilcorrea"}
//        , "usu_email":{"value":"wilcorrea@gmail.com"}
//        , "usu_administrador":{"value":1}
//        , "usu_ativo":{"value":1}
//        , "usu_level":{"value":"Nível Baixo"}
//        };
//    }

    
  }
  
};

try {
  module.exports = UsuarioCtrl;
} catch (e) {
  //requirejs tratment
}