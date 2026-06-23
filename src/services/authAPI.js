import { supabase } from "./supabaseClient"

const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true"

function readDevUsers() {
  try {
    return JSON.parse(localStorage.getItem("dev_users") || "[]")
  } catch (e) {
    return []
  }
}

function writeDevUsers(users) {
  localStorage.setItem("dev_users", JSON.stringify(users))
}

function setDevSession(user) {
  localStorage.setItem("dev_session", JSON.stringify({ user }))
}

function clearDevSession() {
  localStorage.removeItem("dev_session")
}

function getDevSession() {
  try {
    return JSON.parse(localStorage.getItem("dev_session") || "null")
  } catch (e) {
    return null
  }
}

export const authAPI = {
  async signIn(email, password) {
    if (DEV_AUTH) {
      const users = readDevUsers()
      const u = users.find((x) => x.email === email && x.password === password)
      if (!u) throw new Error("Invalid login credentials")
      const user = { 
        id: u.id || "dev-id", 
        email: u.email, 
        profile: { 
          role: u.role || "member", 
          tier: u.tier || "bronze", 
          points: u.points || 0,
          name: u.name || "Dev User"
        } 
      }
      setDevSession(user)
      return { session: { user }, user }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Fetch user profile info
    const profile = await this.getProfile(data.user.id)
    const userWithProfile = { ...data.user, profile }
    
    return { session: data.session, user: userWithProfile }
  },

  async signUp(email, password, name = "", phone = "") {
    if (DEV_AUTH) {
      const users = readDevUsers()
      if (users.find((x) => x.email === email)) {
        throw new Error("User already exists")
      }
      const newId = "dev-" + Math.random().toString(36).substr(2, 9)
      const newUser = { 
        id: newId, 
        email, 
        password, 
        name, 
        phone, 
        role: "member", 
        tier: "bronze", 
        points: 0, 
        confirmed: true 
      }
      users.push(newUser)
      writeDevUsers(users)
      
      const user = { 
        id: newId, 
        email, 
        profile: { role: "member", tier: "bronze", points: 0, name } 
      }
      setDevSession(user)
      return { session: { user }, user }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    })
    if (error) throw error
    return data
  },

  async signOut() {
    if (DEV_AUTH) {
      clearDevSession()
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    if (DEV_AUTH) {
      const s = getDevSession()
      return { session: s }
    }
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    
    if (data.session) {
      const profile = await this.getProfile(data.session.user.id)
      data.session.user.profile = profile
    }
    
    return data;
  },

  async getProfile(userId) {
    if (DEV_AUTH) {
      const s = getDevSession()
      return s?.user?.profile || { role: "member", tier: "bronze", points: 0 }
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      
    if (error) {
      console.error("Error fetching user profile:", error)
      return { role: "member", tier: "bronze", points: 0 }
    }
    return data
  }
}
