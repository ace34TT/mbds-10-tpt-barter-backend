import OneSignal from 'onesignal-node';

require("dotenv").config()

// Initialize OneSignal client with your App ID and REST API Key
const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID || "", process.env.ONESIGNAL_REST_API_KEY || "");

// Function to send a push notification
export async function sendPushNotification(playerId: string, message: string): Promise<void> {
    const notification = {
        contents: {
            en: message,
        },
        include_player_ids: [playerId], // The device token (player ID) from OneSignal
    };
    try {
        const response = await client.createNotification(notification);
        console.log('Successfully sent notification:', response.body);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

