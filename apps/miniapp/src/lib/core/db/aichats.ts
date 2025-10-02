/**
 * AI Chats client - placeholder for WhatsApp/messaging integration
 */

export class AIChatsClient {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  // TODO: Implement AI Chats API methods
  async sendMessage(channelId: string, message: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async receiveWebhook(payload: unknown): Promise<void> {
    throw new Error('Not implemented')
  }

  async getChannelInfo(channelId: string): Promise<unknown> {
    throw new Error('Not implemented')
  }
}

export function createAIChatsClient(): AIChatsClient {
  const apiUrl = process.env.AICHATS_API_URL
  const apiKey = process.env.AICHATS_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Missing AI Chats environment variables')
  }

  return new AIChatsClient(apiUrl, apiKey)
}
