
/**
 * 
 * @class LocalStorage class
 */
var LocalStorage = {

  /**
   * 
   * @returns {_connectionection|localStorageDB}
   */
  _connection: null,
  /**
   * 
   * @returns {_connectionection}
   */
  _: function() {

    if (LocalStorage._connection === null) {

      LocalStorage._connection = new localStorageDB('database.db', localStorage);
      
      if(LocalStorage._connection.isNew() ) {

        // create the "books" table
        LocalStorage._connection.createTable("books", ["code", "title", "author", "year", "copies"]);

        // insert some data
        LocalStorage._connection.insert("books", {code: "B001", title: "Phantoms in the brain", author: "Ramachandran", year: 1999, copies: 10});
        LocalStorage._connection.insert("books", {code: "B002", title: "The tell-tale brain", author: "Ramachandran", year: 2011, copies: 10});
        LocalStorage._connection.insert("books", {code: "B003", title: "Freakonomics", author: "Levitt and Dubner", year: 2005, copies: 10});
        LocalStorage._connection.insert("books", {code: "B004", title: "Predictably irrational", author: "Ariely", year: 2008, copies: 10});
        LocalStorage._connection.insert("books", {code: "B005", title: "Tesla: Man out of time", author: "Cheney", year: 2001, copies: 10});
        LocalStorage._connection.insert("books", {code: "B006", title: "Salmon fishing in the Yemen", author: "Torday", year: 2007, copies: 10});
        LocalStorage._connection.insert("books", {code: "B007", title: "The user illusion", author: "Norretranders", year: 1999, copies: 10});
        LocalStorage._connection.insert("books", {code: "B008", title: "Hubble: Window of the universe", author: "Sparrow", year: 2010, copies: 10});

        // commit the database to localStorage
        // all create/drop/insert/update/delete operations should be committed
        LocalStorage._connection.commit();
      }
    }
    return LocalStorage._connection;
  },
  /**
   * 
   * @param {type} ddl
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  insert: function(ddl, params, callback) {

    try {

      var id = LocalStorage._().insert(ddl, params);
      if (id) {
        callback.call(this, true, id);
      }
    } catch(e) {
      console.error(e);
      callback.call(this, false, null);
    }
  },
  /**
   * 
   * @param {type} ddl
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  select: function(ddl, params, callback) {

    try {

      try {
        var status = true
          , rows = [{
            "usu_codigo":1
          , "usu_cod_USUARIO_TIPO":1
          , "usu_cod_INSTITUICAO":1
          , "usu_nome":"WILLIAM CORREA"
          , "usu_telefone":"3235314799"
          , "usu_celular":"3299564477"
          , "usu_login":"wilcorrea"
          , "usu_email":"wilcorrea@gmail.com"
          , "usu_administrador":1
          , "usu_ativo":1
          , "usu_level":"Nível Alto"
        }];
        callback.call(this, status, rows);
      } catch(e) {
        console.error(e);
      }
      return;

      var rows = LocalStorage._().queryAll(ddl, params);
      if (rows) {
        callback.call(this, true, rows);
      }
    } catch(e) {
      console.error(e);
      callback.call(this, false, null);
    }
  },
  /**
   * 
   * @param {type} ddl
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  update: function(ddl, params, callback) {

    //update()	table_name, query, update_function
    try {

      var affected = LocalStorage._().insertOrUpdate(ddl, params);
      
      callback.call(this, true, affected);
    } catch(e) {
      console.error(e);
      callback.call(this, false, null);
    }
  },
  /**
   * 
   * @param {type} ddl
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  delete: function(ddl, params, callback) {

    //deleteRows()	table_name, query	Deletes rows from a table matching query, and returns the number of rows deleted
    //- query is either an object literal or a function. If query is not supplied, all rows are deleted
    try {

      var affected = LocalStorage._().deleteRows(ddl, params);
      
      callback.call(this, true, affected);
    } catch(e) {
      console.error(e);
      callback.call(this, false, null);
    }
  }
};

try {
  module.exports = LocalStorage;
} catch (e) {
  //requirejs tratment
}
