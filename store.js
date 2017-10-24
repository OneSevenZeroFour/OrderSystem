/* 
 * @Author: Marte
 * @Date:   2017-10-21 09:50:01
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-10-24 20:11:38
 */
import {
	createStore
} from "redux";

let store = createStore((state = {
	desk: window.localStorage.getItem("desk_num") ? window.localStorage.getItem("desk_num") : 2,
	bg_num: 0,
	hasorder: false,
}, action) => {
	switch (action.type) {
		case "changebg":
			console.log("change_bg", state);
			return Object.assign({}, state, {
				bg_num: action.bg_num
			});
		case "setOrderId":
			console.log("setorderid", state);
			return Object.assign({}, state, {
				orderid: action.oid,
				hasorder: action.hasorder
			})
		default:
			return state;
	}
});

export default store;