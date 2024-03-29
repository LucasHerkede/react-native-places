import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Location } from 'expo';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';
import Secrets from '../Secrets';

const config = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['likedJobs']
};

const reducer = persistCombineReducers(config, reducers);
// Set some CONST for the aplaciation 

Location.setApiKey(Secrets.locationID);

export default function configurationStore(initialState = {}) {
    const store = createStore(
        reducer,
        initialState,
        applyMiddleware(thunk),
    );

    const persistor = persistStore(store);
    return { persistor, store };
}
