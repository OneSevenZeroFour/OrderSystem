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

var socket = io("http://localhost:10002");

function test() {
	socket.emit("test", {
		testing: "socket success！！！"
	})
}
test();
var element = (
	<HashRouter>
	<Provider store={store}>
	<div>
		<Route path="*" component={Renter} />
		<Route path="/" component={Renter} />
	</div>
	</Provider>
	</HashRouter>
);
ReactDOM.render(element, document.getElementById("demo"));