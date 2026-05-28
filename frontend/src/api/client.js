import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export const submitResult = (data) => api.post('/results/', data)
export const getLeaderboard = (limit = 10) => api.get(`/leaderboard/?limit=${limit}`)