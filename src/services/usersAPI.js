import { supabase } from "./supabaseClient"

export const usersAPI = {
  async fetchUsers() {
    const { data, error } = await supabase.from("users").select("*")
    if (error) throw error
    return data
  },

  async createUser(userData) {
    const { data, error } = await supabase.from("users").insert([userData])
    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id)
    if (error) throw error
    return data
  },

  async deleteUser(id) {
    const { error } = await supabase.from("users").delete().eq("id", id)
    if (error) throw error
  },
}
