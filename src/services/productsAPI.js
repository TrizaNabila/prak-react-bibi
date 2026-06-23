import { supabase } from "./supabaseClient"
import initialProducts from "../data/Products.json"

const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true"

function readDevProducts() {
  try {
    const local = localStorage.getItem("dev_products")
    if (!local) {
      localStorage.setItem("dev_products", JSON.stringify(initialProducts))
      return initialProducts
    }
    return JSON.parse(local)
  } catch (e) {
    return initialProducts
  }
}

function writeDevProducts(products) {
  localStorage.setItem("dev_products", JSON.stringify(products))
}

export const productsAPI = {
  async fetchProducts() {
    if (DEV_AUTH) {
      return readDevProducts()
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })
      
    if (error) throw error
    return data
  },

  async fetchProductById(id) {
    if (DEV_AUTH) {
      const list = readDevProducts()
      return list.find(x => x.id === parseInt(id))
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async createProduct(productData) {
    if (DEV_AUTH) {
      const list = readDevProducts()
      const newId = list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1
      const newProduct = { ...productData, id: newId }
      list.push(newProduct)
      writeDevProducts(list)
      return newProduct
    }

    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProduct(id, updates) {
    if (DEV_AUTH) {
      const list = readDevProducts()
      const idx = list.findIndex(x => x.id === parseInt(id))
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates }
        writeDevProducts(list)
        return list[idx]
      }
      throw new Error("Product not found")
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProduct(id) {
    if (DEV_AUTH) {
      const list = readDevProducts()
      const filtered = list.filter(x => x.id !== parseInt(id))
      writeDevProducts(filtered)
      return
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
