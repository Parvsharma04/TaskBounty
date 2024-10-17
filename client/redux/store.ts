import { configureStore } from "@reduxjs/toolkit";
import MembershipAmountSlice from "./slices/MembershipAmountSlice ";
import MembershipDurationSlice from "./slices/MembershipDurationSlice";
import MembershipPlanSlice from "./slices/MembershipPlanSlice";

export const store = configureStore({
  reducer: {
    membershipPlan: MembershipPlanSlice,
    membershipAmount: MembershipAmountSlice,
    membershipDuration: MembershipDurationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
