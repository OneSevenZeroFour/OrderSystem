//服务器文件
const mysql = require("mysql");
const express = require("express");
const bodyps = require("body-parser");

var app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
//连接远程数据库 lfp
var connection = mysql.createConnection({
	host: "10.3.132.65",
	user: "eleme",
	password: "123123",
	database: "ordering"
});
connection.connect();



app.use(bodyps.json());
app.use(bodyps.urlencoded({
	extended: true
}));
//创建socket服务
io.sockets.on("connection", function(socket) {
	console.log("socket已监听")
	socket.on("send_desk_id_toback", function(data) {
		guest_id.push(data);
		console.log('guest', guest_id);
	}).on("send_order_id_toback", function(data) {
		//接收订单号与桌子号
	}).on("callServer", function(data) {
		//呼叫服务员
		console.log("from desk ", data);
	}).on("callToPay", function(data) {
		//呼叫服务员
		console.log("pay from desk ", data);
	});
	io.emit("get_order_state", "send get");

})

var guest_id = [],
	kitchen_id = "";
// ============================== DYT start =============================
app.post('/getMenu', function(req, res) {
	res.append("Access-Control-Allow-Origin", "*");
	var arg = req.body.type;
	console.log("type:", arg);
	connection.query('SELECT * from diancan where type="' + arg + '" order by id', function(err, ress, field) {
		if (err) throw err;
		res.send(JSON.stringify(ress));
	});

}).post('/getType', function(req, res) {
	res.append("Access-Control-Allow-Origin", "*");
	connection.query('SELECT * from types order by sorts', function(err, ress, field) {
		if (err) throw err;
		res.send(JSON.stringify(ress));
	});

}).post('/saveOrder', function(req, res) {
	res.append("Access-Control-Allow-Origin", "*");
	var arg = req.body;
	console.log(arg);
	connection.query(`insert into userOrder (desk,content,sum,orderTime) values ("${arg.desk}","${encodeURI(arg.txt)}",${arg.pay},"${arg.time}")`, function(err, ress, field) {
		if (err) throw err;
		res.send(JSON.stringify(ress.insertId));
	});
}).post('/getOrderlist', function(req, res) {
	res.append("Access-Control-Allow-Origin", "*");
	var arg = req.body.id;
	console.log("get order by id", arg);
	connection.query(`SELECT * from userOrder where id=${arg}`, function(err, ress, field) {
		if (err) throw err;
		res.send(ress[0]);
	});

});
//查询桌子的状态
app.get("/desk", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	connection.query(`select * from desk`, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send(JSON.stringify({
			results
		}));
	})
});
app.get("/foods", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	connection.query(`select * from userorder where desk='` + req.query.desk + "' and state != '2'", function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send(JSON.stringify({
			results
		}));
	})
});

app.get("/order", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update userorder set content = '" + req.query.content + "',state = '1' where desk='" + req.query.desk + "' and state = '0'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});

app.get("/setPeople", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update desk set manys = '" + req.query.num + "',times = '" + req.query.times + "' where desk='桌号" + req.query.desk + "'";
	console.log(sqler)
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});
/*用http去监听端口 不用express框架监听*/
server.listen(10002, function() {
	console.log("Server Is Start!!!");
});