import React from 'react';
import store from '../../store.js';
import '../../css/xtable.css';
import io from "socket.io-client";
var socket = io("http://10.3.132.65:10002");
class Xtable extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			table:[],
			sit:{
				color:'#58bc58'
			}
		},
		this.toFoods = function(event){		
			if(event.target.tagName.toLowerCase()=='a'){
				var status = $(event.target.children[4]).find('span').html();
				var id = event.target.dataset.id;
				var num = event.target.dataset.num;
			}else{
				var status = $(event.target).closest('a').find('p')[3].children[0].innerHTML;
				var id = $(event.target).closest('a')[0].dataset.id;
				var num = $(event.target).closest('a')[0].dataset.num;
			}
			var url = id + '&' + num;
			if(status=='可坐'){
				event.preventDefault();
			}else if(status=='客户下单'){
				socket.emit('setServer',{status:'处理中..',id})
				//根据桌号修改status->处理中..
				$.ajax({
					type:'get',
					url:'http://10.3.132.65:10002/setStatus',
					data:{
						status:'处理中..',
						desk:'桌号'+id
					},
					success:function(data){
						location.hash = '#/desk/foods/'+url;
					}
				})
			}else{
				location.hash = '#/desk/foods/'+url;
			}
		},
		this.loadMore = function(){
			var _this = this;
			//请求所有desk的数据
			$.ajax({
				type:'get',
				url:'http://10.3.132.65:10002/desk',
				success:function(data){
					_this.setState({
						table:JSON.parse(data).results
					})
					console.log(_this.state.table)
				}
			})
		}
	}
	render(){
		var _this = this;
		return <div className='table'>
			{
				this.state.table.map(function(item,idx){
					var url = item.id + '&' + item.manys;
					return <a key={item.id} onClick={_this.toFoods} data-id={item.id} data-num={item.manys?item.manys:'null'}>
						<h4>大厅{item.desk.slice(2)}号桌</h4>
						<p>人数:<span>{item.manys!=0?item.manys:''}</span></p>
						<p>下单时间:<span>{item.times?item.times:''}</span></p>
						<p>总价:<span>{item.price?'￥'+item.price:''}</span></p>
						<p>状态:<span style={
								(function(){
									if(item.status=='可坐'){
										return _this.state.sit
									}else if(item.status=='客户下单'){
										return {color:'#CD0000'}
									}else if(item.status=='待结账'){
										return {color:'#f00'}
									}else if(item.status=='处理中..'){
										return {color:'#1C86EE'}
									}else if(item.status=='呼叫服务'){
										return {color:'#CD0000'}
									}else if(item.status=='呼叫结账'){
										return {color:'#CD0000'}
									}
								})()
							}>{item.status}</span></p>
					</a>	
				})
			}
		</div>
	}
	componentDidMount(){
		var _this = this;
		this.loadMore();
		socket.on('toSetDesk',function(data){
			var res = _this.state.table;
			res.forEach(function(item){
				if('桌号'+data.desk == item.desk){
					item.status = '客户下单'
				}
			})
			_this.setState({
				table:res
			})
			//根据桌号修改status->客户下单
			$.ajax({
				type:'get',
				url:'http://10.3.132.65:10002/setStatus',
				data:{
					status:'客户下单',
					desk:'桌号'+data.desk
				},
				success:function(data){
					console.log(data);
				}
			})
		})
		socket.on('getServer',function(data){
			console.log(data)
			var res = _this.state.table;
			res.forEach(function(item){
				if(item.id*1==data.id*1){
					item.status = data.status;
					if(data.status=='待结账'){
						item.manys = data.num,
						item.price = data.price,
						item.times = data.times
					}else if(data.status=='可坐'){
						item.manys = '',
						item.price = '',
						item.times = ''
					}
				}
			});
			_this.setState({
				table:res
			})
		})
	}
}

export {Xtable}