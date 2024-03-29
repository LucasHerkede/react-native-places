import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';
import {
    LIKE_JOB,
    CLEAR_LIKED_JOBS
} from '../actions/types';

export default function (state = [], action) {
    switch (action.type) {
        case PERSIST_REHYDRATE: 
            return action.payload.likedJobs || [];
        case LIKE_JOB:
            return _.uniqBy([action.payload, ...state], 'id');
        case CLEAR_LIKED_JOBS:
            return []; 
        default:
            return state;
    }
}
