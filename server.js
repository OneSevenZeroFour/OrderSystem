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
	socket.on("test", function(data) {
		console.log(data);
	})
})

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
	connection.query(`select * from userorder where desk='` + req.query.desk + "'", function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send(JSON.stringify({
			results
		}));
	})
});
/*用http去监听端口 不用express框架监听*/
server.listen(10002, function() {
	console.log("Server Is Start!!!");
});