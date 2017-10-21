import {
	createStore
} from "redux";
let store = createStore((state, action) => {
	switch (action.type) {
		case "test":
			return {}
			break;
		case "txt":
			return {}
			break;
		default:
			return state
	}
})

export default store;