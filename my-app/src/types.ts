export interface Message {
  content: string
  senderId: string
  receiverId: string
  timestamp: string
  status: 'sent' | 'seen';// Add 'status' if it's required
}
