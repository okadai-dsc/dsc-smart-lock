import { App, LogLevel } from '@slack/bolt';

require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

app.use(async ({ next }) => {
  await next();
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  console.log(message);
  if (message.subtype === undefined || message.subtype === 'bot_message') {
    await say(`Hey there <@${message.user}>!`);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
