import {configureStore} from '@reduxjs/toolkit'
import authReducer from './AccountManagement/AuthSlice'
import iconReducer from './Inventory/IconSlice'
import backgroundReducer from './Inventory/BackgroundSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        icon: iconReducer,
        background: backgroundReducer,
    }
});