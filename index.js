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
import "./css/base.css";
import User from "./app/component/user.jsx";

var element = (
	<Provider store={store}>
	    <User />
	</Provider>);
ReactDOM.render(element, document.getElementById("demo"));