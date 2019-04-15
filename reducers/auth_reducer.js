import { FACEBOOK_LOGIN_SUCCESS, FACEBOOK_LOGIN_FAIL } from '../actions/types';

const INITIAL_STATE = { 
    token: null, 
    expires: null,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FACEBOOK_LOGIN_SUCCESS:
            const { token, expires } = action.payload;
            return { ...state, token, expires };
        case FACEBOOK_LOGIN_FAIL:
            return { ...state, ...INITIAL_STATE };
        default:
            return state;
    }
}
