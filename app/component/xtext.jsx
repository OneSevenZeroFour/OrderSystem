import React from 'react';
import store from '../../store.js'
import '../../css/xtext.css'
import io from "socket.io-client";
var socket = io("http://10.3.132.65:10002");

class Xtext extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			foods:[],
			//桌号
			num:0,
			//人数
			pri:0,
			//不算茶位的总价
			_sum:0,
			//算上茶位的总价
			sum:0,
			time:'',
			state:'',
			flag:false,
			ok:false,
			tip:false,
			add:false,
			select:[],
			show:false,
			cai:{},
			change:false
		}
		this.setNum = (event)=>{
			this.state.change = true;
			var num = event.target.value!=''?event.target.value:'';
			this.setState({
				sum:this.state._sum*1 + event.target.value*2,
				pri:num,
				tip:true
			})
		},
		this.toOk = ()=>{
			this.setState({
				flag:true,
				ok:true
			})
		},
		this.toOver = ()=>{
			this.setState({
				flag:true,
				ok:false
			})
		},
		this.ok = ()=>{
			var _this = this;
			if(this.state.ok){
				if($('.people')[0].value==''||$('.people')[0].value=='0'){
					return;
				}
				console.log('下单----------------------------------------------------------')
				console.log(this.state.foods,this.state.pri)
				var _this = this;
				//根据桌号和state!=2修改content和state->1
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/order',
					data:{
						desk:_this.state.num,
						content:encodeURI(JSON.stringify(_this.state.foods))
					},
					success:function(data){
						console.log(data);
					}
				})
				//服务员下单时根据桌号修改desk表信息（人数、下单时间、总价）
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/setPeople',
					data:{
						num:_this.state.pri,
						desk:_this.state.num,
						times:_this.state.time,
						price:_this.state.sum
					},
					success:function(data){
						console.log('fuck '+data);
						socket.emit('setServer',{
							status:'待结账',
							id:_this.state.num,
							num:_this.state.pri,
							times:_this.state.time,
							price:_this.state.sum
						});
						//发送socket到厨房
						socket.emit('toKitchen','order');
						//根据桌号修改status->待结账
						$.ajax({
							type:'get',
							url:'http://10.3.132.65:10002/setStatus',
							data:{
								status:'待结账',
								desk:'桌号'+_this.state.num
							},
							success:function(data){
								console.log(data);
								location.hash = '#/desk';
							}
						})
					}
				})
			}else{
				console.log('结账-----------------------------------------------------------')
				var _this = this;
				//根据桌号和state=1改userorder里的state-->2 完成
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/setState',
					data:{
						desk:_this.state.num
					},
					success:function(data){
						console.log(data);
						socket.emit('setServer',{
							status:'可坐',
							id:_this.state.num,
						})
						//根据桌号重置status->可坐
						$.ajax({
							type:'get',
							url:'http://10.3.132.65:10002/setStatus',
							data:{
								status:'可坐',
								desk:'桌号'+_this.state.num
							},
							success:function(data){
								console.log(data);
								location.hash = '#/desk';
							}
						})
					}
				})
			}
		},
		this.no = ()=>{
			this.setState({
				flag:false
			})
		},
		this.addCai = (e)=>{
			// return;
			var _this = this;
			this.setState({
				add:true
			},function(){
				$('.mmp')[0].focus();
			})
			if(e.target.tagName.toLowerCase()=='li'||(e.target.tagName.toLowerCase()=='span'&&e.target.parentNode.tagName.toLowerCase()=='li')){
				console.log(e.target)
				if(e.target.tagName.toLowerCase()=='li'){
					var text = e.target.children[0].innerText;
					var id = e.target.dataset.id;
				}else{
					var text = e.target.parentNode.children[0].innerText;
					var id = e.target.parentNode.dataset.id;
				}
				var str = {};
				this.state.select.forEach(function(item,idx){
					if(item.id*1 == id*1){
						str = _this.state.select[idx];
					}
				});
				str.num = 1;
				//-------------------------------菜单state--------------------------------
				str.state = 0;
				str.name = str.dish_name;
				str.img = str.imgurl;
				console.log(text,id,str)
				$('.mmp')[0].value = text;
				this.setState({
					select:[],
					show:true,
					cai:str
				})
			}else if(e.target.tagName.toLowerCase()=='button'){
				console.log('添加')
				console.log(this.state.foods)
				var res = this.state.foods;
				res.unshift(this.state.cai)
				var pri = this.state.cai.price;
				var sum = 0;
				res.forEach(function(item){
					sum += item.price*1;
				})
				$('.mmp')[0].value = '';
				console.log(res)
				//点击添加修改数据库中所下的菜单
				//zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/addFoods',
					data:{
						desk:_this.state.num,
						content:encodeURI(JSON.stringify(res))
					},
					success:function(data){
						console.log(data);
					}
				})
				this.setState({
					foods:res,
					_sum:sum,
					sum:this.state.sum + pri,
					show:false
				})
			}
		},
		//onChange输入数据变动
		this.shit = (e)=>{
			this.setState({
				show:false
			})
			var _this = this;
			var text = e.target.value;
			//zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
			if(text!=''){
				setTimeout(function(){
					$.ajax({
						type:'get',
						url:'http://10.3.132.65:10002/getFoods',
						data:{
							msg:text
						},
						success:function(data){
							var res = JSON.parse(data);
							_this.setState({
								select:res.results
							})
							console.log(res.results)
						}
					})
				},500)
			}
			console.log(e.target.value)
		},
		this.changeNum = (e)=>{
			// if(this.state.state){
			// 	return;
			// }
			if(e.target.className=='down'){
				this.state.change = true;
				var tar = e.target.parentNode.children[1];
				if(tar.innerText=='1'){
					return;
				}else{
					var txt = $(e.target).closest('li')[0].children[0].innerText;
					var res = this.state.foods;
					var _sum = 0;
					var sum = 0;
					res.forEach(function(item){
						if(item.name == txt){
							item.num = tar.innerText - 1;
							sum = item.price;
						}
						_sum += item.num*item.price;
					})
					this.setState({
						foods:res,
						sum:this.state.sum*1 - sum*1,
						_sum:_sum
					})
				}
			}else if(e.target.className=='up'){
				this.state.change = true;
				var tar = e.target.parentNode.children[1];
				var txt = $(e.target).closest('li')[0].children[0].innerText;
				var res = this.state.foods;
				var _sum = 0;
				var sum = 0;
				res.forEach(function(item){
					if(item.name == txt){
						item.num = tar.innerText*1 + 1;
						sum = item.price;
					}
					_sum += item.num*item.price;
				})
				this.setState({
					foods:res,
					sum:sum*1 + this.state.sum*1,
					_sum:_sum
				})
			}
		},
		this.del = (e)=>{
			// if(this.state.state){
			// 	return;
			// }
			this.state.change = true;
			var res = this.state.foods;
			var name = $(e.target).closest('li')[0].children[0].innerText;
			var sum = 0;
			res.forEach(function(item,idx){
				if(item.name == name){
					sum = item.price*item.num;
					res.splice(idx,1);
				}
			})
			this.setState({
				foods:res,
				_sum:this.state._sum - sum,
				sum:this.state.sum - sum
			})
		},
		this.count = ()=>{
			var _this = this;
			// if(this.state.add||this.state.change){
				//zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
				if(this.state.tip){
				//发送socket到厨房
					socket.emit('toKitchen','order');
				}
				var people = $('.people')[0].value==''?0:$('.people')[0].value;
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/setCount',
					data:{
						price:$('.count')[0].innerText.slice(1),
						desk:'桌号'+_this.state.num,
						num:people
					},
					success:function(data){
						
					}
				})
				console.log(_this.state.foods)
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/addFoods',
					data:{
						content:encodeURI(JSON.stringify(_this.state.foods)),
						desk:_this.state.num
					},
					success:function(data){
						location.hash = '#/desk';
					}
				})
				
				// $.ajax({
				// 	type:'get',
				// 	url:'http://localhost:10002/setKazi',
				// 	data:{
				// 		content:encodeURI(JSON.stringify(_this.state.foods)),
				// 		desk:_this.state.num
				// 	},
				// 	success:function(data){
				// 		location.hash = '#/desk';
				// 	}
				// })
			// }else{
			// 	location.hash = '#/desk';
			// }
		}
		this.focusInput = (e)=>{
			e.stopPropagation();
			this.refs.foot_list.style.display = "block";
		}
		this.lostInput = (e)=>{
			this.refs.foot_list.style.display = "none";
		}
	}
	render(){
		var _this = this;
		return <div className='foot clearfix' onClick={this.lostInput}>
			<header><h4><a herf="javascript:;"onClick={this.count}>〈</a>遇见湘味馆</h4></header>
			<div className="desk_id"><p>桌号<span>{this.state.num}</span></p></div>
			<ul onClick={this.changeNum}>
				<li><span>菜&nbsp;&nbsp;名</span><span>数&nbsp;&nbsp;量</span><span>价&nbsp;&nbsp;格</span></li>
				{
					this.state.foods.map(function(item,idx){
						return <li key={idx}>
								<span>{item.name}</span>
								<span><i className='down'>-</i><i>{item.num}</i><i className='up'>+</i></span>
								<span>￥{item.num*item.price}</span>
								<button onClick={_this.del}>删除</button>
							</li>
					})
				}
				<li><span>茶&nbsp;&nbsp;位</span><span><input onChange={this.setNum} value={this.state.pri?this.state.pri:''} className='people'/></span><span>￥{this.state.pri*2}</span></li>
			</ul>
			<div onClick={this.addCai}><span className="add_foot">加&nbsp;&nbsp;菜:</span>{this.state.add?<input type='text' placeholder="请输入菜名" className='mmp' onChange={this.shit} onClick={this.focusInput}/>:''}<ul ref="foot_list">{
				(function(){
					if(_this.state.select.length>0){
						return _this.state.select.map(function(item){
							return <li key={item.id} onClick={_this.sine} data-id={item.id}><span>{item.dish_name}</span><span>￥{item.price}</span></li>
						})
					}
				})()
			}</ul>{this.state.show?<button>添加</button>:''}</div>
			<h5>总&nbsp;&nbsp;价:<span className='count'>￥{_this.state.sum}</span></h5>
			<p>下单时间: <span>{this.state.time}</span></p>
			{
				!this.state.state?<button onClick={this.toOk} className='start'>确认下单</button>:<button onClick={this.toOver} className='over'>结账</button>
			}
			{
				this.state.flag?<div className='conf'>
					<h4>{this.state.ok?'确认下单':'  确认结账'}</h4>
					<div>
						<span onClick={this.ok}>确定</span>
						<span onClick={this.no}>取消</span>
					</div>
				</div>:''
			}
		</div>
	}
	componentWillMount(){
		var url = this.props.match.params.id.split('&');
		var id = url[0];
		var _this = this;
		if(url[1]!=='null'){
			this.state.tip = true;
			this.state.pri = url[1];
		}else{
			this.state.pri = '';
			// socket.emit('setServer',{status:'处理中..',id})
			// $.ajax({
			// 	type:'get',
			// 	url:'http://10.3.132.65:10002/setStatus',
			// 	data:{
			// 		status:'处理中..',
			// 		desk:'桌号'+id
			// 	},
			// 	success:function(data){
			// 		console.log(data);
			// 	}
			// })
		}
		//根据桌号和state=0请求数据
		$.ajax({
			type:'get',
			url:'http://10.3.132.65:10002/foods',
			data:{
				desk:id
			},
			success:function(data){
				var res = JSON.parse(decodeURI(JSON.parse(data).results[0].content))
				console.log(JSON.parse(data).results)
				var sum = 0;
				res.forEach(function(item){
					sum += item.num*item.price;
				})
				if(_this.state.tip){
					sum += url[1]*2;
				}
				_this.setState({
					foods:res,
					_sum:sum,
					sum:sum,
					time:JSON.parse(data).results[0].orderTime.replace(/(T|\.000Z)/g,' '),
					state:JSON.parse(data).results[0].state,
					num:JSON.parse(data).results[0].desk
				})
				console.log(_this.state.foods,_this.state._sum,_this.state.state);
			}
		})
	}
	componentDidMount(){
		// console.log($('.mmp'))
		// this.lostInput();
	}
}

export {Xtext}