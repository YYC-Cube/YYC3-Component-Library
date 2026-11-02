"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, Plus, Users, ThumbsUp, MessageSquare, Share2 } from "lucide-react"

interface PlaylistItem {
  id: string
  title: string
  artist: string
  addedBy: {
    id: string
    name: string
    avatar: string
  }
  votes: number
  comments: number
}

export default function CollaborativePlaylist() {
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([
    {
      id: "1",
      title: "星空协奏曲",
      artist: "梦想家",
      addedBy: {
        id: "user1",
        name: "音乐爱好者",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      votes: 12,
      comments: 3,
    },
    {
      id: "2",
      title: "电子梦境",
      artist: "数字诗人",
      addedBy: {
        id: "user2",
        name: "电子音乐制作人",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      votes: 8,
      comments: 5,
    },
  ])

  const [newItemTitle, setNewItemTitle] = useState("")
  const [collaborators, setCollaborators] = useState([
    { id: "user1", name: "音乐爱好者", avatar: "/placeholder.svg?height=40&width=40", online: true },
    { id: "user2", name: "电子音乐制作人", avatar: "/placeholder.svg?height=40&width=40", online: true },
    { id: "user3", name: "古典乐迷", avatar: "/placeholder.svg?height=40&width=40", online: false },
  ])

  const addItem = () => {
    if (!newItemTitle.trim()) return

    const newItem: PlaylistItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      artist: "我",
      addedBy: {
        id: "me",
        name: "我",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      votes: 0,
      comments: 0,
    }

    setPlaylistItems([...playlistItems, newItem])
    setNewItemTitle("")
  }

  const voteItem = (id: string) => {
    setPlaylistItems(playlistItems.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item)))
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <Music className="w-6 h-6 text-blue-400 mr-2" />
          协作歌单
        </h2>

        <div className="flex -space-x-2">
          {collaborators.slice(0, 3).map((user) => (
            <Avatar key={user.id} className={`border-2 ${user.online ? "border-green-500" : "border-gray-500"}`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          ))}

          {collaborators.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-blue-600">
              <span className="text-xs">+{collaborators.length - 3}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="添加歌曲..." value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} />
        <Button size="icon" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {playlistItems.map((item) => (
          <div key={item.id} className="bg-blue-900/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-white/70">{item.artist}</p>
              </div>

              <div className="flex items-center space-x-1 text-sm">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.addedBy.avatar} alt={item.addedBy.name} />
                  <AvatarFallback>{item.addedBy.name[0]}</AvatarFallback>
                </Avatar>
                <span>{item.addedBy.name}</span>
              </div>
            </div>

            <div className="flex mt-2 space-x-4">
              <button
                className="flex items-center text-sm text-white/70 hover:text-white"
                onClick={() => voteItem(item.id)}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {item.votes}
              </button>

              <button className="flex items-center text-sm text-white/70 hover:text-white">
                <MessageSquare className="w-4 h-4 mr-1" />
                {item.comments}
              </button>

              <button className="flex items-center text-sm text-white/70 hover:text-white">
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          邀请协作者
        </Button>

        <Button>开始播放</Button>
      </div>
    </div>
  )
}
