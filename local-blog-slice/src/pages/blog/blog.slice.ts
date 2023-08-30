import {
  createReducer,
  createAction,
  createSlice,
  PayloadAction,
  nanoid,
  current,
  createAsyncThunk
} from '@reduxjs/toolkit'
import { initalPostlist } from 'constant/blog'
import { Post } from 'types/blog.type'
import http from 'utils/http'

interface BlogState {
  postList: Post[]
  EditingPost: Post | null
}
const initialState: BlogState = {
  postList: [],
  EditingPost: null
}

export const getPostList = createAsyncThunk(
  'blog/getPostList',
  async (_, thunkAPI) => {
  const response = await http.get<Post[]>('posts', {
    signal: thunkAPI.signal
  })
  return response.data
})
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    deletePost: (state, action: PayloadAction<string>) => {
      state.postList = state.postList.filter((post) => post.id !== action.payload)
    },
    startEditPost: (state, action: PayloadAction<Post>) => {
      state.EditingPost = action.payload
    },
    endEditingPost: (state, action: PayloadAction<Post>) => {
      state.postList = state.postList.map((post) => {
        if (post.id === action.payload.id) {
          return action.payload
        }
        return post
      })
      state.EditingPost = null
    },
    cancelEditingPost: (state) => {
      state.EditingPost = null
    },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        //immerjs => mustate an toàn
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid()
        }
      })
    }
  },
  extraReducers(bulider) {
    bulider
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log(`action types: ${action.type}`, current(state))
      })
  }
})
export const { addPost, cancelEditingPost, deletePost, endEditingPost, startEditPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
// export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
//   return {
//     payload: {
//       ...post,
//       id: nanoid()
//     }
//   }
// })
// export const deletePost = createAction<string>('blog/deletePost')
// export const startEditPost = createAction<Post>('blog/editPost')
// export const endEditingPost = createAction<Post>('blog/endEditingPost')
// export const cancelEditingPost = createAction('blog/cancelEditingPost')
// const blogReducer = createReducer(initialState, (bulider) => {
//   bulider
//     .addCase(addPost, (state, action) => {
//       const post = action.payload
//       state.postList.push(post)
//     })
//     .addCase(deletePost, (state, action) => {
//       state.postList = state.postList.filter((post) => post.id !== action.payload)
//     })
//     .addCase(startEditPost, (state, action) => {
//       state.EditingPost = action.payload
//     })
//     .addCase(endEditingPost, (state, action) => {
//       state.postList = state.postList.map((post) => {
//         if (post.id === action.payload.id) {
//           return action.payload
//         }
//         return post
//       })
//       state.EditingPost = null
//     })
//     .addCase(cancelEditingPost, (state, action) => {
//       state.EditingPost = null
//     })
// })
// export default blogReducer
