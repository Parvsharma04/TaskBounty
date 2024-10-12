import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TasksLeft {
  value: number
}

const initialState: TasksLeft = {
  value: 5,
}

export const BountiesLeftSlice = createSlice({
  name: 'bountiesLeft',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    setValue : (state, action: PayloadAction<number>)=>{
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setValue } = BountiesLeftSlice.actions

export default BountiesLeftSlice.reducer
