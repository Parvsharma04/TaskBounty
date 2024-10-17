import { configureStore } from '@reduxjs/toolkit'
import BountiesLeftSlice from './slices/BountiesLeftSlice'
import ReputationSlice from './slices/ReputationSlice'

export const store = configureStore({
  reducer: {
    BountiesLeft: BountiesLeftSlice,
    Reputation: ReputationSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
