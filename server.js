//服务器文件
const http = require("http");
const mysql = require("mysql");
const express = require("express");
const url = require("url");
const querystring = require("querystring");
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
app.get("/changeState",function(req,res){
	res.setHeader("Access-Control-Allow-Origin","*");
	// 获取url中参数
	var query = url.parse(req.url).query;
	var params = querystring.parse(query);
	var selStr = "SELECT * FROM userorder WHERE id=" + params.orderid;
		var promise = new Promise((resolve, reject) => {
			connection.query(selStr,function(err, results, file){
				if(err){
					console.log(err);
					reject();
					return ;
				}
				var orderitem = results[0];
				var foodlist = JSON.parse(decodeURI(orderitem.content));
				foodlist[params["foodid"]].state = params["state"];
				/* 修改后的数据 */
				var foodcont = encodeURI(JSON.stringify(foodlist));
				resolve({
					foodcont: foodcont,
					state: params["state"]
				});			
			})	
		})
		
		promise.then(function(resv){
			return new Promise((resolve,reject) => {
				/* 前一回调传出的{foodcont: foodcont,state:state} */
				var foodcont = resv.foodcont;
				/* 更新订单语句 */
				var updStr = "UPDATE userorder SET content = '" 
							+ foodcont + "' WHERE id='"
							+ params["orderid"] + "'";
				connection.query(updStr,function(error,suc){
					if(error) {
						console.log("updata failed!");
						reject();
						return ;
					}
					console.log('-----updata------');
					console.log('affectrow ',suc.affectedRows);

					resolve({
						foodcont: foodcont,
					});
					if(params["state"] == 2){
						res.send(JSON.stringify({
							status: "success",
							code: 1
						}))
					}
				});
			})
		})
		.then(function(resv){
			return new Promise((resolve, reject) => {
				/* 更新菜品库存语句 */
				/* 状态为制作中，将库存中该菜品数量减1 */
				if (params["state"] == 1){
					var repoStr = "SELECT * FROM diancan WHERE dish_name='" + params["name"] +"'";
					connection.query(repoStr,function(err,results){
						if(err){
							console.log(err);
							reject();
							return ; 
						}
						var repo = results[0];
						resolve({
							inventory: repo.inventory,
							id: repo.id
						});
						console.log(repo)
					});
					console.log("91:"+params["name"]);
				}else if(params["state"] == 2){
					resolve()
				}
			})
		})
		.then(function(resv){
			/* 上一个promise返回{inventory: repo.inventory,id: repo.id} */
			return new Promise((resolve, reject) => {
				if(params["state"] == 1){
					var repoUpdStr = "UPDATE diancan SET inventory = " + (resv.inventory - params["num"]) +" WHERE id=" + resv.id;
					connection.query(repoUpdStr,function(err,results) {
						if(err){
							console.log(err);
							reject();
							return ;
						}
						res.send(JSON.stringify({
							status: "success",
							code: 1
						}))
						resolve()
					})
				}else if(params["state"] == 2){
					resolve();
				}
			});
		})
		.catch(function(reason){
			res.send(JSON.stringify({
						status: "fail",
						code: 0
					}))
			console.log("failed: "+reason);
		})
	// connection.query(selStr,function(err, results, file){
	// 	if(err) {
	// 		console.log("select failed!");
	// 		/* 若数据库查询失败，返回状态 */
	// 		/* code属性，1表示成功，0表示失败 */
	// 		res.send(JSON.stringify({
	// 			status: "fail",
	// 			code: 0 								
	// 		}))
	// 		return ;
	// 	};
	// 	var orderitem = results[0];
	// 	var foodlist = JSON.parse(decodeURI(orderitem.content));
	// 	foodlist[params["foodid"]].state = params["state"];
	// 	/* 修改后的数据 */
	// 	var foodcont = encodeURI(JSON.stringify(foodlist));
	// 	/* 更新菜品库存语句 */
	// 	var repoStr = "SELECT * FROM diancan WHERE name=" + 
	// 	console.log(params["name"]);
	// 	/* 更新订单语句 */
	// 	var updStr = "UPDATE userorder SET content = '" 
	// 				+ foodcont + "' WHERE id='"
	// 				+ params["orderid"] + "'";

	// 	connection.query(updStr,function(error,suc){
	// 		if(error) {
	// 			console.log("updata failed!");
	// 			res.send(JSON.stringify({
	// 				status: "fail",
	// 				code: 0
	// 			}))
	// 			return ;
	// 		}
	// 		console.log('-----updata------');
	// 		console.log('affectrow ',suc.affectedRows);
	// 		res.send(JSON.stringify({
	// 			status: "success",
	// 			code: 1
	// 		}))
	// 	});
	// })
	
})
console.log("Server Is Start!!!");
app.listen(10002);