import TelegramBot from 'node-telegram-bot-api';

// Telegram bot token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN || '';

if (!token) {
  throw new Error('Telegram bot token is not defined in environment variables');
}

const bot = new TelegramBot(token, { polling: false });

export default bot;
