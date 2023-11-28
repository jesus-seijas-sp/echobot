require('dotenv').config();
const { Server } = require('./server');
const { Bot } = require('./bot');

const bot = new Bot();
const server = new Server({
  port: process.env.PORT || 3000,
});
server.app.post('/api/messages', async (req, res) => {
  await bot.process(req, res);
});
server.start();