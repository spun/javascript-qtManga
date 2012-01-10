var mangadb = {};
(function()
{
	var db = null;

	var open = function() {
		var dbSize = 8192;
		db = openDatabase('Todo', '1.0', 'todo manager', dbSize);
	}

	var createTable = function() {
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
				'manga_list (ID INTEGER PRIMARY KEY ASC, name TEXT, service TEXT, url TEXT, added_on DATETIME)', []);
		});
	}

	var init = (function() {
		open();
		createTable();
		console.log("# End setup BD");
	})();

	this.add = function(name, serv, url) {
		db.transaction(function(tx) {
			var addedOn = new Date();
			tx.executeSql('INSERT INTO manga_list (name, service, url, added_on) VALUES (?,?,?,?)',
				[name, serv, url, addedOn],
				function() {console.log("Deleting -> Ok")},
				function() {console.log("Deleting -> NEIN!")});
		});
	}

	this.deleteAllByService = function(service) {
		db.transaction(function(tx) {
			tx.executeSql('DELETE FROM manga_list WHERE service=?', [service],
				function() {console.log("Ok")},
				function() {console.log("NEIN!")});
	  });
	}

	this.getSuggests = function(pattern, callback) {
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM manga_list WHERE name LIKE "'+pattern+'%" LIMIT 10', [], function(tx, result) {
				var res = new Array();
				for (var i = 0, item = null; i < result.rows.length; i++) {
					item = result.rows.item(i);
					res.push(item);
				}
				callback(res);
			},
			function(tx, error) {console.log(error)});
		});
	}

}).apply(mangadb);



