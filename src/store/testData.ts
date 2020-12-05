import { ColumnProps, PostProps, UserProps } from './types'

export const testColumns: ColumnProps[] = [
  {
    _id: '1',
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg'
      // url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    }
  },
  {
    _id: '2',
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    _id: '3',
    title: 'test3的专栏',
    description: '这是的test3专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    _id: '4',
    title: 'test4的专栏',
    description: '这是的test4专栏，有一段非常有意思的简介，可以更新一下欧'
  }
]

export const testPosts: PostProps[] = [
  {
    _id: '1',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    // image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100',
    createdAt: '2020-06-11 10:34:22',
    column: '1'
  },
  {
    _id: '2',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    createdAt: '2020-06-11 10:34:22',
    column: '1'
  },
  {
    _id: '3',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    createdAt: '2020-06-11 10:34:22',
    column: '1'
  }
]

export const currentUser: UserProps = {
  isLogin: false
  // nickName: 'viking',
  // _id: 'v_123',
  // column: '1'
}
