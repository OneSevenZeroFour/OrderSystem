import React from "react";
import "../../css/enter.css";
export default class Renter extends React.Component{
	constructor(props){
        super(props);
	}
	render(){
		return (
			<header className="enter_hd">
				<div className="enter_bg"></div>
				<div className="enter_box">
					<a href="javascript:;">客人入口</a>
					<a href="javascript:;">服务入口</a>
					<a href="javascript:;">后厨入口</a>
				</div>
			</header>
		)
	}
}