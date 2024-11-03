import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    backgrounds: null,
}

// create auth slice for login and signOut state
const BackgroundSlice = createSlice({
    name: 'backgrounds',
    initialState,
    reducers: {
        fetchBackground: (state, action) => {
            state.backgrounds = action.payload;
        },
    },
})  

export const {fetchBackground} = BackgroundSlice.actions;
export default BackgroundSlice.reducer;