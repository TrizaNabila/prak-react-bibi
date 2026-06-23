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

export const usersAPI = {
  async fetchUsers() {
    if (DEV_AUTH) {
      return readDevUsers()
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) throw error
    return data
  },

  async createUser(userData) {
    if (DEV_AUTH) {
      const users = readDevUsers()
      const newId = "dev-" + Math.random().toString(36).substr(2, 9)
      const newUser = { id: newId, ...userData, points: 0, tier: "bronze", confirmed: true }
      users.push(newUser)
      writeDevUsers(users)
      return newUser
    }

    // In a real live app, creating a user usually goes through Auth.
    // For admin managing profiles table, they can insert directly.
    const { data, error } = await supabase
      .from("profiles")
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    if (DEV_AUTH) {
      const users = readDevUsers()
      const idx = users.findIndex(x => x.id === id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates }
        writeDevUsers(users)
        return users[idx]
      }
      throw new Error("User not found")
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteUser(id) {
    if (DEV_AUTH) {
      const users = readDevUsers()
      const filtered = users.filter(x => x.id !== id)
      writeDevUsers(filtered)
      return
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)

    if (error) throw error
  },
}
