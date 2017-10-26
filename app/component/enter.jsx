import React from "react";
import "../../css/enter.css";
import {
	HashRouter,
	Route,
	Link
} from 'react-router-dom';

export default class Renter extends React.Component{
	constructor(props){
        super(props);
        this.state = {
        	desk_box:[],
        };
        this.popmenu = ()=>{
        	console.log(this)
        	this.refs.pops.style.display = "block";
        }
        this.cancelpop = ()=>{
        	this.refs.pops.style.display = "none";
        }
        this.write_desk_num = (event)=>{
        	//存入本地存储
        	console.log(event.target.dataset)
        	var num = event.target.dataset.desker;
        	window.localStorage.setItem("desk_num",num);
        }
	}
	componentWillMount(){
		var self = this;
		window.$.ajax({
			url:"http://10.3.132.65:10002/desk",
			type:"GET",
			success(datas){
				var res = datas;
				try{
					res = JSON.parse(datas)
				}catch(err){
					console.log(err)
				}
				console.log(res)
				var res2=res.results.map(function(item){
					return item.desk;
				})
				self.setState({
					desk_box:res2.slice()
				})
			}
		})
	}
	render(){
		return (
			<header className="enter_hd">
				<div className="enter_bg"></div>
				<div className="enter_box">
					<a href="javascript:;" onClick={this.popmenu}>客人入口</a>
					<a href="#/desk">服务入口</a>
					<a href="#/kitchen">后厨入口</a>
				</div>
				<div className="enter_desk" ref="pops">
					<ul>
						<button onClick={this.cancelpop}>&times;</button>
						{
							this.state.desk_box.map(function(item,idx){
								var n = idx+1;
		        				return <li key={item}>
		        						<Link to="/user" data-desker={n} onClick={this.write_desk_num}>{item}</Link>
		        						</li>;
		        			}.bind(this))
						}
					</ul>
				</div>
				<p className="enter_ex"><Link to="/manage">后台登录</Link></p>
			</header>
		)
	}
}