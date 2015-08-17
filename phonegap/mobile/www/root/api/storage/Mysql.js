
var database = require('mysql');

/**
 * 
 * @class Mysql class
 */
var Mysql = {
  
  /**
   * 
   * @type @exp;database@call;createConnection
   */
  _connection: null,
  /**
   * 
   * @type String
   */
  _transaction: '',
  /**
   * 
   * @returns {_connectionection}
   */
  _: function() {

    if (Mysql._connection === null) {

      Mysql._connection = database.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'note#128301',
        database: 'cbpq'
      });
    }
    return Mysql._connection;
  },
  /**
   * 
   * @returns {undefined}
   */
  __: function(command) {

    if (Mysql._transaction === '') {
      
      if (command) {

        Mysql._().query(command);
      }

      Mysql._connection.end();
      Mysql._connection = null;
    }
  },
  /**
   * 
   * @returns {undefined}
   */
  begin: function() {

    Mysql._().query('START TRANSACTION');
    Mysql._transaction = App.Util.guid();
  },
  /**
   * 
   * @returns {undefined}
   */
  commit: function() {
    
    Mysql._transaction = '';
    Mysql.__('COMMIT');
  },
  /**
   * 
   * @returns {undefined}
   */
  rollback: function() {
    
    Mysql._transaction = '';
    Mysql._('ROLLBACK');
  },
  /**
   * 
   * @param {type} sql
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  insert: function(sql, params, callback) {

    connection.query('INSERT INTO posts SET ?', params, function(err, result) {
      if (err) throw err;

      console.log(result.insertId);
    });
    
    Mysql.__();
  },
  /**
   * 
   * @param {type} sql
   * @param {type} params
   * @param {type} callback(status, rows, fields)
   * @returns {undefined}
   */
  select: function(sql, params, callback) {
    
    Mysql._().query(sql, params, function(err, rows, fields) {
      try {
        console.log(sql, err);
        var status = true;
        if (err) {
          status = false;
        }
        callback.call(this, status, rows, fields);
      } catch(e) {
        console.error(e);
      }
    });

    Mysql.__();
  },
  /**
   * 
   * @param {type} sql
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  update: function(sql, params, callback) {

    connection.query('UPDATE posts SET ...', params, function (err, result) {
      if (err) throw err;

      console.log('changed ' + result.changedRows + ' rows');
    });
    
    Mysql.__();
  },
  /**
   * 
   * @param {type} sql
   * @param {type} params
   * @param {type} callback
   * @returns {undefined}
   */
  delete: function(sql, params, callback) {

    connection.query('DELETE FROM posts WHERE title = "wrong"', params, function (err, result) {
      if (err) throw err;

      console.log('deleted ' + result.affectedRows + ' rows');
    });

    Mysql.__();
  }
};

try {
  module.exports = Mysql;
} catch (e) {
  //requirejs tratment
}