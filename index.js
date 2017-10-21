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
import Renter from "./app/component/enter.jsx";

var element = (
	<div>
	<Renter />
	</div>
);
ReactDOM.render(element, document.getElementById("demo"));