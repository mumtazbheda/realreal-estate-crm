/**
 * MailWizz client - placeholder for email marketing integration
 */

export class MailWizzClient {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  // TODO: Implement MailWizz API methods
  async subscribe(email: string, listId: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async unsubscribe(email: string, listId: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async sendCampaign(campaignId: string): Promise<void> {
    throw new Error('Not implemented')
  }
}

export function createMailWizzClient(): MailWizzClient {
  const apiUrl = process.env.MAILWIZZ_API_URL
  const apiKey = process.env.MAILWIZZ_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Missing MailWizz environment variables')
  }

  return new MailWizzClient(apiUrl, apiKey)
}
