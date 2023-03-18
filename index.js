const TelegramApi = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const bot = new TelegramApi('5989117648:AAF1iWkMohg5yfqpBPHIOdCtD5EaH0PE_lY', {
  polling: true,
});
const doc = new GoogleSpreadsheet(
  '1MxxVlGY-67hk99f3HymqUe9TNCjP-lb5KcgNw0WG18A'
);

let payload = {};

const startOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Так', callback_data: 'Yes' },
        { text: 'Ні', callback_data: 'No' },
      ],
    ],
  },
};
const start = async () => {
  await doc.useServiceAccountAuth({
    client_email: 'cyberboroshno@cyberboroshnomap.iam.gserviceaccount.com',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw3FG/Km+8TLCz\nhrEuTvmso6ub8AxYe7/A0Di8pZX/gZ6LznpKKfgxp/8pAfWfYoSRdgZGXE1PtVFJ\nz8uzbkpKSgyyewBkrexOmUWpA5HTNeQFCa1ITXuPI41tJ7FUrQc/2I5V5YpixzLd\npQlVNN05rpkWYHHwcbgSObGXiiio/HNW7IPKJdO3KJ39q+BPiNe6tkN+dev0scNp\nUNYwnFJH6SuIqmKuxvaLOBdCxiQvhNkF+HY8qr/CMjFejgvpmgRIew6USK9hBJBm\niezy/xGR9/YtAN0ZBA+6MwwR569FQGxsL3Ko01RWWlCwLgOnKA7fYxEe2dMKUPp6\ncdxPmL2nAgMBAAECggEAVJCD5cv8sSRaOPzmKyZH62w22dDllklVXnQxLMJf/lOT\n43VOs7dtnRCeyJTPRO5uRL8SMQJhVQN1Yr2gwKKzkuHlQFHf1kPzAYH39OBoEX1r\nEZ2W5UNnGQH+1XptJ/ezx6tcI2YlzSVCBQisdblZLgN132UuFbHKOaysZbEB0ApZ\nu8pR+1AN6zu4ZiKPudyXzQTJXFiISiiZPUOo/Y39QkA1oMO1SiuP91o1/m5KgoLX\nELyi6ASuFGUWsSd+z3FnbjzH+Icxc5vEOuLzVPAEJk995elKlzpH/9La/thcwpBR\nWLkUplTj/+h8l8Qy4ANsfSDIni+kGgCwbiF76CApgQKBgQDf93rpIthV8jw7VgcQ\n35Ul5IuzmQPpxL2wXEuK7MpUTxubiUEgqcJU9gBmhlPENevRPpWH71PWL23G1X3I\nDSQN6eM3tNSzwkzNIMcrtRDgwszDNEDJHT5qpEYd84IqjxZgSPUaWd/GRUghNJaN\nCTmCeqiOwRBExRVYSnGTlKLm7wKBgQDKKA3S0FRospw6pElURSx5v3NAWT2vjh/V\n1GHaQRVqqD1SjhKcjiDY+yfD4VaGh0/A1pWNV0bqagZFGcbe1EoeG+U8U9vyxiZ6\nNyCvqXqyjgtWFtIcvKnf9E8jLI0o/jXpCGl8+l4ydqnGY1aLCfq7tPFciJfuhs+1\n70hrrsVUyQKBgGrZRJgo+ZC3Sij8t85C/ILhcAy0uXszU1PqFFgo87YZL5CagKm2\nk3G5EyPWfewj1Wc0Nl5tvU93vSWZALMKIeNJbA9NhBRmZAGQ27RsY6r3BH00Vpwc\nCYUS7iin3be0H/a7l8OEkQ+kSe8diZ2rgvZO0k+Yp8xHQhGnIlxIExedAoGBAMnR\nMPO8nfgkEAoPR1HE+UDWW+Xq8cVYmvmrXME6ZnojWY0YXwZCchKMskdAqFQHtBwt\nXgJMFnUhwf6sXDjLMO9cI/+VLKjzHyi17oDQLrkhS7n3cG3V/7WgPn08FfTNzN5H\nUqC9htrUUmvHcne+T72jR658g0lS9vyH1QID6ebZAoGBANiYpcrwVNw80P6d92Fc\nA004khdt01aADtdhh1eqrPq46XcD+zUGD3bSzUNGGM02l7qQS5V1AWjyBnc2CV6j\nhkjD75+PupqPN1zJ2Fmuq7agFx1NuE4kPUXGiYf8hTx5YXKCsxb8sfqQSK7D0l06\ncv8PCDZCCmU55C3cHnRtOYtQ\n-----END PRIVATE KEY-----\n',
  });

  await doc.loadInfo();

  const sheet = await doc.sheetsByIndex[0];
  bot.setMyCommands([{ command: '/start', description: 'Почати' }]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      return await bot.sendMessage(
        chatId,
        'Хочеш додати локацію?',
        startOptions
      );
    }
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === 'Yes') {
      return bot
        .sendMessage(chatId, 'Надішли координати', {
          reply_markup: JSON.stringify({ force_reply: true }),
        })
        .then((res) => {
          bot.onReplyToMessage(res.chat.id, res.message_id, (reply) => {
            payload.coordinates = reply.text;
            bot
              .sendMessage(
                reply.chat.id,
                'Надішліть текст з датою геолокації, якщо дата відео відома та вона різниться від дати геолокації напишіть це в тексті. Приклад: Підрозділ КіберБорошно мочить русню(відео - 16.03.2023, геолокація - 20.03.2023)',
                {
                  reply_markup: JSON.stringify({ force_reply: true }),
                }
              )
              .then((res) => {
                bot.onReplyToMessage(res.chat.id, res.message_id, (reply) => {
                  payload.message = reply.text;
                  bot
                    .sendMessage(
                      reply.chat.id,
                      'Надішліть посилання на повідомлення з геолокацією',
                      {
                        reply_markup: JSON.stringify({ force_reply: true }),
                      }
                    )
                    .then((res) => {
                      bot.onReplyToMessage(
                        res.chat.id,
                        res.message_id,
                        async (reply) => {
                          payload.link = reply.text;
                          await sheet
                            .addRow({
                              WKT: `POINT (${payload.coordinates
                                .split(',')
                                .reverse()
                                .join(' ')})`,
                              name: payload.message,
                              description: payload.link,
                            })
                            .catch((err) => console.log(err))
                            .then((res) => console.log(res));
                          bot.sendMessage(
                            reply.chat.id,
                            'Дякую! Якщо хочеш надіслати ще локацію надішли команду /start'
                          );
                          payload = {};
                        }
                      );
                    });
                });
              });
          });
        });
    } else {
      return bot.sendMessage(
        chatId,
        'Якщо захочеш надіслати щось напиши /start'
      );
    }
  });
};

start();
