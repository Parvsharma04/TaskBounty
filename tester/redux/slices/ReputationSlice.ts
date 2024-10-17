import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface TasksLeft {
  value: number
}

const initialState: TasksLeft = {
  value: 0,
}

export const Reputation = createSlice({
  name: 'Reputation',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 2
    },
    decrement: (state) => {
      state.value -= 2
    },
    setReputation : (state, action: PayloadAction<number>)=>{
      state.value = action.payload*2
    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setReputation } = Reputation.actions

export default Reputation.reducer
