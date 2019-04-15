import {
    VIEW_JOB_DETAIL
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case VIEW_JOB_DETAIL:
            return action.payload;            
        default:
            return state;
    }
}
