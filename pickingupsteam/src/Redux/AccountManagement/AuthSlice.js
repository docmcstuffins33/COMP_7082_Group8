//fairly sure this isn't used? don't want to take it out, just in case.

import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user:null,
    isAuthenticated: false,
}

// create auth slice for login and signOut state
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(action.payload);
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        saveUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        signOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
})  

export const {login, signOut, saveUser} = authSlice.actions;
export default authSlice.reducer;