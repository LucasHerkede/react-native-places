import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAIL
} from './types';
import Secrets from '../Secrets';

const STORAGE_FB_TOKEN = 'fb_token';
const STORAGE_FB_EXIPRES = 'fb_expires';
const FACEBOOK_APP_ID = Secrets.facebookID;

export const facebookLogin = () => async dispatch => {
    const currentToken = await AsyncStorage.getItem(STORAGE_FB_TOKEN);
    const currentExpires = await AsyncStorage.getItem(STORAGE_FB_EXIPRES);
    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (currentToken && currentExpires && currentExpires > currentTime) {
        // Dispatch an acontion saying FB login is done
        dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: { token: currentToken, expires: currentExpires } });
    } else {
        // start up login proccess 
        try {
            const { token, expires } = await doFacebookLogin();
            await AsyncStorage.setItem(STORAGE_FB_TOKEN, token);
            await AsyncStorage.setItem(STORAGE_FB_EXIPRES, String(expires));
            dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: { token, expires } });
        } catch (error) {
            dispatch({ type: FACEBOOK_LOGIN_FAIL });
        }
    }
};

const doFacebookLogin = async () => {
    const { type, token, expires } = await Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_APP_ID, 
        { permissions: ['public_profile'] }
    );
    
    if (type === 'cancel') {
        throw Error({ error: 'Facebook login cancelled' });
    }

    if (type === 'success') {
        return { token, expires };
    }
};

