const initialstate = {
    user: {},
    isLoggedIn: false,
}

const authReducer = (state = initialstate, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state, isLoggedIn: true
            }

        case "SAVE_PROFILE":
            return {
                ...state, user: { ...state.user, ...action.payload }
            }
        case "LOGOUT":
            return {
                user: {}, isLoggedIn: false
            }


        default:
            return state;
    }
}

export default authReducer;