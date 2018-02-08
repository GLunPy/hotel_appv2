const express = require('express');
const bodyParser= require('body-parser');
const nodeSession = require('node-session');
const mysql = require('mysql');
const md5 = require('md5');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	database: 'hoteldb',
	user: 'root',
	password: 'root'
});

const path = require('path');

const app = new express();
const session = new nodeSession({
	secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',
	lifetime: 3600000
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.redirect("/clients");
		} else {
			res.redirect("/login");
		}
	});
});

app.get('/login', (req, res) => {
	session.startSession(req, res, function() {
		res.sendFile(__dirname + '/views/login.html');
	});
});

app.post('/login', (req, res) => {
	var username = req.body.username;
	var password = md5(req.body.password);
	session.startSession(req, res, function() {
		connection.query("SELECT * FROM user WHERE username='" + username + "' AND password='" + password + "'",
	 function(error, results, fields) {
	 	if (results.length > 0){
			req.session.put('user_name', results[0].username);
			if (results[0].isAdmin == 1)
				req.session.put('is_admin', true);

	 		res.send({succeed: true});
	 	}	
	 	else
	 		res.send({succeed: false});
	 });
	});
});

app.get('/logout', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			req.session.pull('user_name');
			req.session.pull('is_admin');
			res.send({succeed: true});
		} else {
			res.send({succeed: false});
		}
	});
});

app.get('/is-admin', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.send({succeed: true, is_admin: req.session.get('is_admin')});
		} else {
			res.send({succeed: false});
		}
	});
});

app.get('/clients', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.sendFile(__dirname + '/views/clients.html');
		} else {
			res.redirect("/login");
		}
	});
});

app.post('/add-client', (req, res) => {
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var country = req.body.country;
	var birthday = req.body.birthday;

	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		connection.query("INSERT INTO CLIENT (first_name, last_name, country, birthday) VALUES('" + first_name + "', '" + last_name + "', '" + country + "', '" + birthday + "')",
	 function(error, results, fields) {
	 	if(error)
	 		res.send({succeed: false});
	 	else
	 		res.send({succeed: true});
	 });
	});
});

app.get('/get-clients', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false)) {
			res.send({succeed: false});
			return;
		}

		connection.query("select * from client", function(error, showres, f) {
			if (error)
					res.send({succeed: false});
			else {
				showres.forEach(function(val, id) {
					var arr = val.birthday.toLocaleDateString().split("/");
					var year = arr.pop();
					
					for (i = 0 ; i < arr.length ; i ++) {
						if (arr[i].length == 1)
							arr[i] = "0" + arr[i];
					}

					arr.unshift(year);
					val.birthday = arr.join("-");
				});

					res.send({succeed: true, showres: showres});
			}
			});
	});
});

app.post('/update-client', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "UPDATE client SET first_name='" + req.body.first_name + "', last_name='" + req.body.last_name + "', country='" + req.body.country + "', birthday='" + req.body.birthday + "' WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.post('/delete-client', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "DELETE FROM client WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/users', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.sendFile(__dirname + '/views/users.html');

		} else {
			res.redirect("/login");
		}
	});
});

app.post('/add-user', (req, res) => {
	var username = req.body.username;
	var password = md5(req.body.password);
	var email = req.body.email;
	var isAdmin = req.body.isAdmin;

	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		connection.query("INSERT INTO user (username, password, email, isAdmin) VALUES('" + username + "', '" + password + "', '" + email + "', " + isAdmin + ")", function(error, results, fields) {
			if(error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/get-users', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false)) {
			res.send({succeed: false});
			return;
		}

		connection.query("select * from user", function(error, showres, f) {
			if (error)
					res.send({succeed: false});
			else
					res.send({succeed: true, showres: showres});
			});
	});
});

app.post('/update-user', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "UPDATE user SET username='" + req.body.username + "', password='" + md5(req.body.password) + "', email='" + req.body.email + "', isAdmin=" + req.body.isAdmin + " WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.post('/delete-user', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "DELETE FROM user WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/rooms', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.sendFile(__dirname + '/views/rooms.html');
		} else {
			res.redirect('/login');
		}
	});
});

app.post('/add-room', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}
		var desc_str = req.body.description;
		desc_str = desc_str.replace(/'/g, "\\'");
		var query = "INSERT INTO room (room_name, category, num_beds, description, price) VALUES ('" + req.body.room_name + "','" + req.body.category + "'," + req.body.num_beds + ",'" + desc_str + "'," + req.body.price + ")";
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/get-rooms', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "SELECT * FROM room";
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true, content: results});
		});
	});
});

app.post('/update-room', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}
		var desc_str = req.body.description;
		desc_str = desc_str.replace(/'/g, "\\'");
		var query = "UPDATE room SET room_name='" + req.body.room_name + "', category='" + req.body.category + "', num_beds=" + req.body.num_beds + ", description='" + desc_str + "', price=" + req.body.price + " WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.post('/delete-room', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "DELETE FROM room WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/check-in', (req, res) => {
	session.startSession(req, res, function() {
		if (req.session.get('user_name')) {
			res.sendFile(__dirname + '/views/checkin.html');
		} else {
			res.redirect('/login');
		}
	});
});

app.post('/add-checkin', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var checkin_time = new Date();
		var arr = checkin_time.toLocaleDateString().split("/");
		var year = arr.pop();
		
		for (i = 0 ; i < arr.length ; i ++) {
			if (arr[i].length == 1)
				arr[i] = "0" + arr[i];
		}

		arr.unshift(year);
		checkin_time = arr.join("-");

		var query = "INSERT INTO checkin (client_id, room_id, checkin_time, duration) VALUES (" + req.body.client_id + ", " + req.body.room_id + ", '" + checkin_time + "', " + req.body.duration + ")";
		connection.query(query, function(error, results, fields) {
			console.log(error);
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.get('/get-checkins', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "SELECT * FROM checkin";
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else {
				results.forEach(function(val, id) {
					var arr = val.checkin_time.toLocaleDateString().split("/");
					var year = arr.pop();
					
					for (i = 0 ; i < arr.length ; i ++) {
						if (arr[i].length == 1)
							arr[i] = "0" + arr[i];
					}

					arr.unshift(year);
					val.checkin_time = arr.join("-");
				});

		 		res.send({succeed: true, content: results});
		 	}
		});
	});
});

app.post('/update-checkin', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "UPDATE checkin SET client_id=" + req.body.client_id + ", room_id=" + req.body.room_id + ", checkin_time='" + req.body.checkin_time + "', duration=" + req.body.duration + " WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.post('/delete-checkin', (req, res) => {
	session.startSession(req, res, function() {
		if (!req.session.get('user_name', false) || !req.session.get('is_admin', false)) {
			res.send({succeed: false});
			return;
		}

		var query = "DELETE FROM checkin WHERE id=" + req.body.id;
		connection.query(query, function(error, results, fields) {
		 	if (error)
		 		res.send({succeed: false});
		 	else
		 		res.send({succeed: true});
		});
	});
});

app.listen('3000', function() {
	console.log('Server started listening on port 3000!');
});
