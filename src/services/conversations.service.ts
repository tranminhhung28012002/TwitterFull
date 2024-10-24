import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class ConversationService {
  async getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    try {
      const match = {
        $or: [
          { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
          { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
        ]
      }
      const conversations = await databaseService.conversations
        .find(match)
        .sort({ created_at: -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray()
      const total = await databaseService.conversations.countDocuments(match)

      return { conversations, total }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hội thoại:', error)
      throw new Error('Không thể lấy danh sách hội thoại')
    }
  }
}

const conversationService = new ConversationService()
export default conversationService
