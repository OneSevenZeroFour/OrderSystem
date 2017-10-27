/**
 * findDOMNode(this.refs.XX) 查找有ref属性的节点
 * Component react的组件
 * Prop 子组件只能通过 props 来传递数据
 * 默认props的getDefaultProps()方法
 */
import React, {
	findDOMNode,
	Component,
	PropTypes
} from "react";
import ReactDOM from "react-dom";
import store from "./store.js";
import {
	Provider
} from "react-redux";
import io from "socket.io-client";
// import {
// 	Router,
// 	Route,
// 	hashHistory
// } from 'react-router';
import {
	HashRouter,
	Route,
	Link
} from 'react-router-dom';
import $ from "jquery";
window.$ = $;

import "./css/base.css";
import User from "./app/component/user.jsx";
import Renter from "./app/component/enter.jsx";
import Myorder from "./app/component/myorder.jsx";
import Food_db from "./app/component/food_db.jsx";
import Kitchen from "./app/component/kitchen/kitchen.jsx";

import {
	Xtable
} from './app/component/xtable.jsx';
import {
	Xtext
} from './app/component/xtext.jsx';

var socket = io("http://10.3.132.65:10002");

var element = (
	<HashRouter>
	<Provider store={store}>
	<div className="ele" id='box'>
		<Route exact path="/" component={Renter} />
		<Route exact path="/user" component={User} />
		<Route exact path="/myorder" component={Myorder} />
		<Route exact path="/manage" component={Food_db} />
		<Route exact path="/kitchen" component={Kitchen}/>

		<Route exact path='/desk' component={Xtable}></Route>
	    <Route exact path='/desk/foods/:id' component={Xtext}></Route>
	</div>
	</Provider>
	</HashRouter>
);
ReactDOM.render(element, document.getElementById("demo"));