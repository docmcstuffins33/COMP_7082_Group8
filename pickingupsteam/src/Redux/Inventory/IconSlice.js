import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    icons: null,
}

const IconSlice = createSlice({
    name: 'icons',
    initialState,
    reducers: {
        fetchIcon: (state, action) => {
            state.icons = action.payload;
        },
    },
})  

export const {fetchIcon} = IconSlice.actions;
export default IconSlice.reducer;