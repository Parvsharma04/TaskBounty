import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MembershipAmountInterface {
  amount: string;
}

const initialState: MembershipAmountInterface = {
  amount: "0",
};

export const MembershipAmountSlice = createSlice({
  name: "MembershipAmountSlice",
  initialState,
  reducers: {
    AmountIncrement: (state, action: PayloadAction<string>) => {
      state.amount = (
        parseFloat(state.amount) + parseFloat(action.payload)
      ).toString();
    },
    AmountDecrement: (state, action: PayloadAction<string>) => {
      if (state.amount > "0") {
        state.amount = (
          parseFloat(state.amount) - parseFloat(action.payload)
        ).toString();
      } else state.amount = "0";
    },
  },
});

// Action creators are generated for each case reducer function
export const { AmountIncrement, AmountDecrement } = MembershipAmountSlice.actions;

export default MembershipAmountSlice.reducer;
