import React from "react";
import "../../css/footer.css";

export default class Renter extends React.Component{
	constructor(props){
        super(props);
        this.state = {
        	list:[
        		{
        			title:"菜单",
        			herfs:"javascript:;",
        			clas:"icon-shop_fill"
        		},{
        			title:"服务铃",
        			herfs:"javascript:;",
        			clas:"icon-remind_fill"
        		},{
        			title:"我的订单",
        			herfs:"javascript:;",
        			clas:"icon-activity_fill"
        		},{
        			title:"呼叫结账",
        			herfs:"javascript:;",
        			clas:"icon-financial_fill"
        		}
        	],
        	bg_num:0,
        };
        this.change_bg = (e)=>{
        	var idx = e.target.dataset.idx;
        	this.setState(Object.assign({},this.state,{
        		bg_num:idx
        	}))
        }
	}
	render(){
		return (
			<footer>
				<ul className="foot_menu">
					{
						this.state.list.map(function(item,idx){
							return <li key={idx}>
									<a href={item.herfs} data-idx={idx} onClick={this.change_bg} className={this.state.bg_num == idx?"active_bg":""}><i className={'iconfont '+item.clas}></i>{item.title}</a>
								</li>
						}.bind(this))
					}
				</ul>
			</footer>	
		)
	}
}