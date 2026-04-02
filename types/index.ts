export interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  bio?: string
  avatar_url?: string
  website?: string
  location?: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_id: string
  content: string
  image_url?: string
  is_active: boolean
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  author?: Pick<User, 'id' | 'username' | 'avatar_url'>
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  user?: Pick<User, 'id' | 'username' | 'avatar_url'>
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}