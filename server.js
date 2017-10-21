//服务器文件
const http = require("http");
const mysql = require("mysql");
const express = require("express");
const bodyps = require("body-parser");

//连接远程数据库 lfp
var connection = mysql.createConnection({
	host: "10.3.132.65",
	user: "eleme",
	password: "123123",
	database: "ordering"
});
connection.connect();

var app = express();
app.use(bodyps.json());
app.use(bodyps.urlencoded({
	extended: true
}));

app.get("/submenu", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send("its ok")
});


console.log("Server Is Start!!!");
app.listen(10002);