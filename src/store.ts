import { createStore } from 'vuex'
import { testColumns, testPosts, currentUser, ColumnProps, PostProps, UserProps } from './testData'

export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testColumns,
    posts: testPosts,
    user: currentUser
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'marlon' }
    }
  }
})

export default store
