import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MembershipDurationInterface {
  duration: number;
}

const initialState: MembershipDurationInterface = {
  duration: 0,
};

export const MembershipDurationSlice = createSlice({
  name: "MembershipDuration",
  initialState,
  reducers: {
    durationIncrement: (state, action: PayloadAction<number>) => {
      state.duration = state.duration + action.payload;
    },
    durationDecrement: (state, action: PayloadAction<number>) => {
      if (state.duration > 0) {
        state.duration = state.duration - action.payload;
      } else state.duration = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { durationIncrement, durationDecrement } =
  MembershipDurationSlice.actions;

export default MembershipDurationSlice.reducer;
