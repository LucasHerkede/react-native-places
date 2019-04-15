// import { combineReducers } from 'redux';
import auth from './auth_reducer';
import jobs from './jobs_reducer';
import likedJobs from './likes_reducer';
import placeDetail from './detail_recuder';

export default ({
    auth, jobs, likedJobs, placeDetail
});
