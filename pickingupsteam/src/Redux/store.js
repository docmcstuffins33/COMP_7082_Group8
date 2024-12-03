import {configureStore} from '@reduxjs/toolkit'
import authReducer from './AccountManagement/AuthSlice'
import iconReducer from './Inventory/IconSlice'
import backgroundReducer from './Inventory/BackgroundSlice'

//fairly sure this isn't used? don't want to take it out, just in case.
export const store = configureStore({
    reducer: {
        auth: authReducer,
        icon: iconReducer,
        background: backgroundReducer,
    }
});