import {
	createStore
} from "redux";
let store = createStore((state = {
	kitchen: []
}, action) => {
	switch (action.type) {
		case "KITCHEN":
			return {
				store: action.store
			}
			break;
		case "txt":
			return {}
			break;
		default:
			return state
	}
})

export default store;