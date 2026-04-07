import { createSlice } from '@reduxjs/toolkit';

export const navSlice = createSlice({
  name: 'nav',
  initialState: { 
    activeSection: 'home',
    darkMode: true // በዲፎልት ጨለማ እንዲሆን
  },
  reducers: {
    setActiveSection: (state, action) => { state.activeSection = action.payload; },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode; }
  },
});

export const { setActiveSection, toggleDarkMode } = navSlice.actions;
export default navSlice.reducer;