//服务器文件
const mysql = require("mysql");
const express = require("express");
const url = require("url");
const querystring = require("querystring");
const bodyps = require("body-parser");
// let $ = require("jquery");

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
app.use(express.static('./'));
app.use(bodyps.urlencoded({
	extended: true
}));


var guest_id = [],
	kitchen_id = "";
//创建socket服务
io.sockets.on("connection", function(socket) {
	console.log("socket已监听")
	socket.on("send_desk_id_toback", function(data) {
		guest_id.push(data);
		console.log('guest', guest_id);
	}).on("send_order_id_toback", function(data) {
		//接收订单号与桌子号
		console.log('aaaa', data)
		io.emit('toSetDesk', data);
	}).on("callServer", function(data) {
		//呼叫服务员
		console.log("from desk ", data);
		io.emit('getServer', {
			status: '呼叫服务',
			id: data.id
		})
	}).on("callToPay", function(data) {
		//呼叫服务员
		console.log("pay from desk ", data);
		io.emit('getServer', {
			status: '呼叫结账',
			id: data.id
		})
	}).on("setServer", function(data) {
		//改变桌子状态
		console.log("desk-status", data);
		io.emit('getServer', data);
	}).on("toKitchen", function(data) {
		//改变桌子状态
		console.log("toKitchen", data);
		io.emit('confirmOrder', data);
	}).on("change-food-state", function(data) {
		/* 改变菜品状态（准备中-制作中-上菜） */
		console.log("change-food-state", data);
		io.emit('get_order_state', data);
	}).on("callOver", function(data) {
		io.emit("get_callOver", data)
	})
})

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
	connection.query(`SELECT * from userOrder where desk=${arg} and state!=2`, function(err, ress, field) {
		if (err) throw err;
		// console.log(ress[0]);
		res.send(ress);
	});

});

//-------------------------------------LYH----------------------------------------
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
//获取桌子中的菜单
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
//确认下单
app.get("/order", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update userorder set content = '" + req.query.content + "',state = '1' where desk='" + req.query.desk + "' and state = '0'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});
//加菜
app.get("/addFoods", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update userorder set content = '" + req.query.content + "' where desk='" + req.query.desk + "' and state != '2'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});
//查询菜式
app.get("/getFoods", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "select * from diancan where dish_name like '%" + req.query.msg + "%'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send(JSON.stringify({
			results
		}));
	})
});
//确认下单后修改desk表
app.get("/setPeople", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update desk set manys = '" + req.query.num + "',times = '" + req.query.times + "',price = '" + req.query.price + "' where desk='桌号" + req.query.desk + "'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});
//修改每桌状态
app.get("/setStatus", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (req.query.status == '可坐') {
		var sqler = "update desk set status = '" + req.query.status + "',manys = 0,price = 0,times = '' where desk='" + req.query.desk + "'";
	} else {
		var sqler = "update desk set status = '" + req.query.status + "' where desk='" + req.query.desk + "'";
	}
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('status-ok');
	})
});
//结账
app.get("/setState", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update userorder set state = '2' where desk='" + req.query.desk + "' and state='1'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('state-ok');
	})
});
//后台数据管理
app.get("/FoodDB", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "select * from diancan";
	connection.query(sqler, function(err, ret, file) {
		if (err) throw err;
		res.send(JSON.stringify(ret))
	})
});

//修改desk显示的总价和人数
app.get("/setCount", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sqler = "update desk set price = '" + req.query.price + "',manys = '" + req.query.num + "' where desk='" + req.query.desk + "'";
	connection.query(sqler, function(err, results, file) {
		if (err) throw err;
		// console.log(results);
		res.send('ok');
	})
});
//修改desk显示的人数
// app.get("/setKazi", function(req, res) {
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	var sqler = "update desk set manys = '" + req.query.num + "' where desk='桌号" + req.query.desk + "'";
// 	connection.query(sqler, function(err, results, file) {
// 		if (err) throw err;
// 		// console.log(results);
// 		res.send('ok');
// 	})
// });
// ============================== LZH start =============================
/* 返回未完成的订单 */
app.get("/kitchen", function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	connection.query("SELECT * FROM userorder WHERE state=1", function(err, results, file) {
		if (err) throw err;
		var uncompletedData = [];
		results.forEach(function(item) {
			var completed = true;
			var cont = JSON.parse(decodeURI(item.content));
			for (let i = 0; i < cont.length; i++) {
				if (cont[i].state != 2) {
					completed = false;
					break;
				}
			}
			if (!completed) {
				uncompletedData.push(item);
			}
		}, this);
		// var resdata = decodeURI()
		// console.log(JSON.parse(decodeURI(results[2].content)));
		// var 
		res.send(JSON.stringify(uncompletedData));
	});
});
/* 改变菜品状态 */
app.get("/changeState", function(req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		// 获取url中参数
		var query = url.parse(req.url).query;
		var params = querystring.parse(query);
		var selStr = "SELECT * FROM userorder WHERE id=" + params.orderid;
		var promise = new Promise((resolve, reject) => {
			connection.query(selStr, function(err, results, file) {
				if (err) {
					console.log(err);
					reject();
					return;
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
		promise.then(function(resv) {
				return new Promise((resolve, reject) => {
					/* 前一回调传出的{foodcont: foodcont,state:state} */
					var foodcont = resv.foodcont;
					/* 更新订单语句 */
					var updStr = "UPDATE userorder SET content = '" + foodcont + "' WHERE id='" + params["orderid"] + "'";
					connection.query(updStr, function(error, suc) {
						if (error) {
							console.log("updata failed!");
							reject();
							return;
						}
						console.log('-----updata------');
						console.log('affectrow ', suc.affectedRows);

						resolve({
							foodcont: foodcont,
						});
						if (params["state"] == 2) {
							res.send(JSON.stringify({
								status: "success",
								code: 1
							}))
						}
					});
				})
			})
			.then(function(resv) {
				return new Promise((resolve, reject) => {
					/* 更新菜品库存语句 */
					/* 状态为制作中，将库存中该菜品数量减1 */
					if (params["state"] == 1) {
						var repoStr = "SELECT * FROM diancan WHERE dish_name='" + params["name"] + "'";
						connection.query(repoStr, function(err, results) {
							if (err) {
								console.log(err);
								reject();
								return;
							}
							var repo = results[0];
							resolve({
								inventory: repo.inventory,
								id: repo.id
							});
							console.log(repo)
						});
						console.log("91:" + params["name"]);
					} else if (params["state"] == 2) {
						resolve()
					}
				})
			})
			.then(function(resv) {
				/* 上一个promise返回{inventory: repo.inventory,id: repo.id} */
				return new Promise((resolve, reject) => {
					if (params["state"] == 1) {
						var repoUpdStr = "UPDATE diancan SET inventory = " + (resv.inventory - params["num"]) + " WHERE id=" + resv.id;
						connection.query(repoUpdStr, function(err, results) {
							if (err) {
								console.log(err);
								reject();
								return;
							}
							res.send(JSON.stringify({
								status: "success",
								code: 1
							}))
							resolve()
						})
					} else if (params["state"] == 2) {
						resolve();
					}
				});
			})
			.catch(function(reason) {
				res.send(JSON.stringify({
					status: "fail",
					code: 0
				}))
				console.log("failed: " + reason);
			})
	})
	// ============================== LZH end =============================
	/*用http去监听端口 不用express框架监听*/
server.listen(10002, function() {
	console.log("Server Is Start!!!");
});