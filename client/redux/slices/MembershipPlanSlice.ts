import { createSlice } from "@reduxjs/toolkit";

export interface MembershipPlanInterface {
  plan: string;
}

const initialState: MembershipPlanInterface = {
  plan: "Free",
};

export const MembershipPlanSlice = createSlice({
  name: "MembershipPlanSlice",
  initialState,
  reducers: {
    planIncrement: (state) => {
      state.plan = "Paid";
    },
    planDecrement: (state) => {
      state.plan = "Free";
    },
  },
});

// Action creators are generated for each case reducer function
export const { planIncrement, planDecrement} = MembershipPlanSlice.actions;

export default MembershipPlanSlice.reducer;
