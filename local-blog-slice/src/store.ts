import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import blogReducer from 'pages/blog/blog.slice'
import { blogApi } from 'pages/blog/components/blog.service'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: { blog: blogReducer, [blogApi.reducerPath]: blogApi.reducer },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(blogApi.middleware)
  }
})
setupListeners(store.dispatch)
//lấy RootState và AppDispatch từ storer
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
//async thunkAPI
export const useAppDispatch = () => useDispatch<AppDispatch>()
