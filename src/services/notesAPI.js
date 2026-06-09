import axios from 'axios'

const API_URL = import.meta.env.VITE_NOTES_API_URL || "https://wsdugsyjnsggnraujalu.supabase.co/rest/v1/note"
const API_KEY = import.meta.env.VITE_NOTES_API_KEY || "sb_publishable_moJj5xX1IbKhstgWE8bOsg_oX-KCU3A"

const headers = {
    "Content-Type": "application/json",
    ...(API_KEY
        ? {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
          }
        : {}),
}

export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    async createNote(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    async deleteNote(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    },
}
