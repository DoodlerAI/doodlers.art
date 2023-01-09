const initialState = "";

const tokenReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "SAVE_TOKEN":
            // alert('2')
            return action.payload;
        default:
            return state;
    }
}

export default tokenReducer;