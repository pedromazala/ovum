
var DAO = {
  
  makeSql: function(type, items, table, statements, _object) {
    
    var sql = ''
      , params = _object.params ? _object.params : {}
      , _where = [];

    delete _object.params;  

    for (var i in _object) {
      _where.push(i + '=' + "'" + _object[i] + "'");
    }

    var where = _where.join(' AND ')
      , _group = params.group
      , _order = params.order
      , _begin = params.begin
      , _walk = params.walk;
      
    switch(type) {
      case 'SELECT':
        sql = "SELECT * FROM " + table + " WHERE " + where;
        break;
    }
      
    return sql;
  }
};

try {
  module.exports = DAO;
} catch (e) {
  //requirejs tratment
}