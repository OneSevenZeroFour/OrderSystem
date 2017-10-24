//服务器文件
const http = require("http");
const mysql = require("mysql");
const express = require("express");
const bodyps = require("body-parser");
// let $ = require("jquery");

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
app.use(express.static('./'));
app.use(bodyps.urlencoded({
	extended: true
}));

app.get("/submenu", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send("its ok")
});
//查询座子的状态
// app.get("/desk", function(req, res) {
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	connection.query(`select * from desk`, function(err, results, file) {
// 		if (err) throw err;
// 		console.log(results);
// 		res.send(JSON.stringify({
// 			results	
// 		}));
// 	})
// });
// [{"name":"凉拌菠菜","num":"1","price":"18"},{"name": "脆藕尖","num": "2","price": "24"}]

app.get("/kitchen",function(req,res) {
	res.setHeader("Access-Control-Allow-Origin","*");
	connection.query("SELECT * FROM userorder",function(err, results, file) {
		if(err) throw err;
		var uncompletedData = [];
		results.forEach(function(item) {
			var completed = true;
			var cont = JSON.parse(decodeURI(item.content));
			for(let i =0 ;i < cont.length; i++){
				if(cont[i].state != 2){
					completed = false;
					break;
				}
			}
			if(!completed){
				uncompletedData.push(item);
			}
		}, this);
		// var resdata = decodeURI()
		// console.log(JSON.parse(decodeURI(results[2].content)));
		// var 
		res.send(JSON.stringify(uncompletedData));
	});
});
console.log("Server Is Start!!!");
app.listen(10002);


