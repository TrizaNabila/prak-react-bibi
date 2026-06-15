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
      const user = { email: u.email }
      setDevSession(user)
      return { session: { user }, user }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signUp(email, password) {
    if (DEV_AUTH) {
      const users = readDevUsers()
      if (users.find((x) => x.email === email)) {
        throw new Error("User already exists")
      }
      const newUser = { email, password, confirmed: true }
      users.push(newUser)
      writeDevUsers(users)
      const user = { email }
      setDevSession(user)
      return { session: { user }, user }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
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
    return data
  },
}
