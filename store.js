/* 
 * @Author: Marte
 * @Date:   2017-10-21 09:50:01
 * @Last Modified by: lzh
 * @Last Modified time: 2017-10-26 14:19:45
 */
import {
	createStore
} from "redux";

let store = createStore((state = {
	desk: window.localStorage.getItem("desk_num") ? window.localStorage.getItem("desk_num") : 2,
	bg_num: 0,
	hasorder: false,
	kitchen: []
}, action) => {
	switch (action.type) {
		case "KITCHEN":
			return {
				store: action.store
			}
			break;
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