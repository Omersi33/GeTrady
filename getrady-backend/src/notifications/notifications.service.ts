import { Injectable, Logger } from '@nestjs/common'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'

@Injectable()
export class NotificationsService {
  private readonly expo = new Expo()
  private readonly log = new Logger(NotificationsService.name)

  async sendPush(tokens: string[], title: string, body: string, data: any = {}) {
    const messages: ExpoPushMessage[] = []

    for (const token of tokens) {
      if (!Expo.isExpoPushToken(token)) {
        this.log.warn(`Token push invalide : ${token}`)
        continue
      }
      messages.push({ to: token, sound: 'default', title, body, data })
    }

    const chunks = this.expo.chunkPushNotifications(messages)
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk)
      } catch (err) {
        this.log.error('Erreur envoi push', err)
      }
    }
  }
}