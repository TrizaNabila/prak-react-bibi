import { supabase } from "./supabaseClient"

const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true"

// Helper to get/set mock dev orders from localStorage
function readDevOrders() {
  try {
    return JSON.parse(localStorage.getItem("dev_orders") || "[]")
  } catch (e) {
    return []
  }
}

function writeDevOrders(orders) {
  localStorage.setItem("dev_orders", JSON.stringify(orders))
}

export const ordersAPI = {
  async fetchOrders() {
    if (DEV_AUTH) {
      return readDevOrders()
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        profiles (
          name,
          email
        )
      `)
      .order("order_date", { ascending: false })

    if (error) throw error
    return data
  },

  async fetchUserOrders(userId) {
    if (DEV_AUTH) {
      const all = readDevOrders()
      return all.filter(x => x.customer_id === userId)
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            tittle,
            code
          )
        )
      `)
      .eq("customer_id", userId)
      .order("order_date", { ascending: false })

    if (error) throw error
    return data
  },

  async fetchOrderDetails(orderId) {
    if (DEV_AUTH) {
      const all = readDevOrders()
      return all.find(x => x.id === orderId)
    }

    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        products (
          tittle,
          code,
          category,
          brand
        )
      `)
      .eq("order_id", orderId)

    if (error) throw error
    return data
  },

  // business logic for placing orders, calculating points and tiering
  async createOrder(userId, items, userProfile) {
    // 1. Calculate totals
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // Tier discount
    let discountPercent = 5
    if (userProfile.tier === "silver") discountPercent = 10
    else if (userProfile.tier === "gold") discountPercent = 15
    else if (userProfile.tier === "platinum") discountPercent = 20
    
    const discountAmount = totalAmount * (discountPercent / 100)
    const finalAmount = totalAmount - discountAmount
    
    // Earn 1 point per Rp 10.000 spent on final paid amount
    const pointsEarned = Math.floor(finalAmount / 10000)
    
    const newPoints = (userProfile.points || 0) + pointsEarned
    let newTier = "bronze"
    if (newPoints >= 1000) newTier = "platinum"
    else if (newPoints >= 300) newTier = "gold"
    else if (newPoints >= 100) newTier = "silver"

    if (DEV_AUTH) {
      const orders = readDevOrders()
      const newOrderId = "ord-" + Math.random().toString(36).substr(2, 9)
      const newOrder = {
        id: newOrderId,
        customer_id: userId,
        order_date: new Date().toISOString(),
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        points_earned: pointsEarned,
        status: "Pending",
        profiles: {
          name: userProfile.name || "Dev User",
          email: userProfile.email
        },
        order_items: items.map(item => ({
          ...item,
          products: { tittle: item.product_name || "Product" }
        }))
      }
      orders.unshift(newOrder)
      writeDevOrders(orders)

      // Update mock user points/tier in localStorage
      const users = JSON.parse(localStorage.getItem("dev_users") || "[]")
      const uIdx = users.findIndex(x => x.id === userId)
      if (uIdx !== -1) {
        users[uIdx].points = newPoints
        users[uIdx].tier = newTier
        localStorage.setItem("dev_users", JSON.stringify(users))
        
        // Update current dev session
        const sess = JSON.parse(localStorage.getItem("dev_session") || "{}")
        if (sess.user) {
          sess.user.profile.points = newPoints
          sess.user.profile.tier = newTier
          localStorage.setItem("dev_session", JSON.stringify(sess))
        }
      }
      return newOrder
    }

    // --- Live Supabase Implementation ---
    // Start transaction sequence
    // A. Insert Order Header
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{
        customer_id: userId,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        points_earned: pointsEarned,
        status: "Pending"
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // B. Insert Order Items
    const itemsToInsert = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert)

    if (itemsError) throw itemsError

    // C. Deduct Stock & Update
    for (const item of items) {
      const { data: prod } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single()
        
      if (prod) {
        const remainingStock = Math.max(0, prod.stock - item.quantity)
        await supabase
          .from("products")
          .update({ stock: remainingStock })
          .eq("id", item.product_id)
      }
    }

    // D. Update Profile Points & Tier
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        points: newPoints,
        tier: newTier
      })
      .eq("id", userId)

    if (profileError) throw profileError

    return orderData
  },

  async updateOrderStatus(orderId, status) {
    if (DEV_AUTH) {
      const orders = readDevOrders()
      const idx = orders.findIndex(x => x.id === orderId)
      if (idx !== -1) {
        orders[idx].status = status
        writeDevOrders(orders)
        return orders[idx]
      }
      throw new Error("Order not found")
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
