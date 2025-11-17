"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Organization {
  id: string
  name: string
  type: string
  memberCount: number
}

interface AuthContextType {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  createOrganization: (name: string, type: string, inviteEmails: string[]) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DUMMY_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "/user-avatar.jpg",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "admin123",
    avatar: "/user-avatar.jpg",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "user123",
    avatar: "/user-avatar.jpg",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    password: "test123",
    avatar: "/user-avatar.jpg",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // Simulate checking for existing session
        const savedUser = localStorage.getItem("session-share-user")
        const savedOrg = localStorage.getItem("session-share-org")

        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        if (savedOrg) {
          setOrganization(JSON.parse(savedOrg))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = DUMMY_USERS.find((u) => u.email === email && u.password === password)

      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }

        setUser(userData)
        localStorage.setItem("session-share-user", JSON.stringify(userData))
      } else {
        throw new Error("Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        id: "2",
        name: "Google User",
        email: "user@gmail.com",
        avatar: "/google-user-avatar.jpg",
      }

      setUser(userData)
      localStorage.setItem("session-share-user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: "/new-user-avatar.jpg",
      }

      setUser(userData)
      localStorage.setItem("session-share-user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const createOrganization = async (name: string, type: string, inviteEmails: string[]) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orgData = {
        id: Date.now().toString(),
        name: name,
        type: type,
        memberCount: inviteEmails.length + 1,
      }

      setOrganization(orgData)
      localStorage.setItem("session-share-org", JSON.stringify(orgData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setOrganization(null)
    localStorage.removeItem("session-share-user")
    localStorage.removeItem("session-share-org")
  }

  const value = {
    user,
    organization,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    createOrganization,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
