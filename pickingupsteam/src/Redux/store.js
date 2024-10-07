import {configureStore} from '@reduxjs/toolkit'
import authReducer from './AccountManagement/AuthSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})