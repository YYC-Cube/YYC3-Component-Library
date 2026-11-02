"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share2, Music, ImageIcon, MapPin } from "lucide-react"

interface Post {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  content: string
  attachmentType?: "music" | "image"
  attachmentUrl?: string
  location?: string
  timestamp: string
  likes: number
  comments: number
  liked: boolean
}

export default function MusicCommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "user1",
        name: "音乐爱好者",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "刚刚用AI创作了一首新曲子，感觉灵感爆发！",
      attachmentType: "music",
      attachmentUrl: "/placeholder-music.mp3",
      location: "北京",
      timestamp: "10分钟前",
      likes: 24,
      comments: 5,
      liked: false,
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "电子音乐制作人",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "分享一下我的新MV，欢迎大家提意见！",
      attachmentType: "image",
      attachmentUrl: "/placeholder.svg?height=200&width=400",
      timestamp: "2小时前",
      likes: 56,
      comments: 12,
      liked: true,
    },
  ])

  const [newPostContent, setNewPostContent] = useState("")

  const addPost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        id: "me",
        name: "我",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newPostContent,
      timestamp: "刚刚",
      likes: 0,
      comments: 0,
      liked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")
  }

  const toggleLike = (id: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          const liked = !post.liked
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold">音乐社区动态</h2>

      <div className="space-y-4">
        <Textarea
          placeholder="分享你的音乐创作..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full"
        />

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Music className="w-4 h-4 mr-2" />
              添加音乐
            </Button>
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              添加图片
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              添加位置
            </Button>
          </div>

          <Button onClick={addPost} disabled={!newPostContent.trim()}>
            发布
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-blue-900/30 p-4 rounded-lg">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <p className="text-xs text-white/70">{post.timestamp}</p>
                  </div>

                  {post.location && (
                    <div className="flex items-center text-xs text-white/70">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.location}
                    </div>
                  )}
                </div>

                <p className="my-2">{post.content}</p>

                {post.attachmentType === "music" && (
                  <div className="my-2 bg-blue-900/50 p-2 rounded">
                    <div className="flex items-center">
                      <Music className="w-5 h-5 mr-2 text-blue-400" />
                      <div className="flex-grow">
                        <div className="h-1 bg-blue-900 rounded-full">
                          <div className="h-1 bg-blue-500 rounded-full w-1/3" />
                        </div>
                      </div>
                      <span className="text-xs ml-2">0:45</span>
                    </div>
                  </div>
                )}

                {post.attachmentType === "image" && (
                  <div className="my-2">
                    <img
                      src={post.attachmentUrl || "/placeholder.svg"}
                      alt="Post attachment"
                      className="rounded-lg w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex space-x-4 mt-3">
                  <button
                    className={`flex items-center text-sm ${post.liked ? "text-red-500" : "text-white/70"} hover:text-red-500`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" fill={post.liked ? "currentColor" : "none"} />
                    {post.likes}
                  </button>

                  <button className="flex items-center text-sm text-white/70 hover:text-white">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {post.comments}
                  </button>

                  <button className="flex items-center text-sm text-white/70 hover:text-white">
                    <Share2 className="w-4 h-4 mr-1" />
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
