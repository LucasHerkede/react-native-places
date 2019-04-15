import axios from 'axios';
import { Location, Permissions } from 'expo';
import qs from 'qs';

import {
    FETCH_JOBS,
    LIKE_JOB,
    CLEAR_LIKED_JOBS,
    VIEW_JOB_DETAIL
} from './types';
import Secrets from '../Secrets';

const PLACES_ROOT_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const PLACES_QUERY_PARAMS = {
    key: Secrets.mapsPlacesID,
    radius: 3000,
    language: 'pt-BR',
    type: 'cafe'
};

const PLACE_DETAIL = 'https://maps.googleapis.com/maps/api/place/details/json?';
const PLACE_DETAIL_PARAMS = {
    key: Secrets.mapsPlacesID,
};

export const fetchJobs = (region, callback) => async dispetch => {
    // if we have permission to use geolocation. 
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
        try {
            const { latitude, longitude } = region;
            const address = await Location.reverseGeocodeAsync({ latitude, longitude });
            console.log(address);

            const url = buildSearchUrl(region);
            const { data } = await axios.get(url);

            const results = data.results.slice(0, 10).map((item) => {
                item.distance = distance(latitude, longitude, item.geometry.location.lat, item.geometry.location.lng).toFixed(2);
                return item;
            });

            
            dispetch({ type: FETCH_JOBS, payload: results });
            callback();
        } catch (err) {
            console.log(err);
        }            
    }
};

export const likeJob = (job) => {
    return {
        payload: job,
        type: LIKE_JOB
    };
};

export const clearLikedJobs = () => {
    return {
        type: CLEAR_LIKED_JOBS
    };
};

export const viewJobDetail = (job, callback) => async dispetch => {
    const url = buildSearchPlaceidUrl(job.place_id);
    const { data } = await axios.get(url);
    
    job.detail = data.result;
    console.log(job.place_id);
    dispetch({ type: VIEW_JOB_DETAIL, payload: job });
    callback();
};

// Helpers
const buildSearchUrl = (region) => {
    const location = `${region.latitude},${region.longitude}`;
    const query = qs.stringify({ ...PLACES_QUERY_PARAMS, location });

    return `${PLACES_ROOT_URL}${query}`;
};

const buildSearchPlaceidUrl = (placeid) => {
    const query = qs.stringify({ ...PLACE_DETAIL_PARAMS, placeid });
    return `${PLACE_DETAIL}${query}`;
};

const distance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p)) /2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};
