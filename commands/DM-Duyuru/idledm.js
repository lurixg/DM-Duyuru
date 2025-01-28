const whitelist = require("../../whitelist.json");

module.exports.execute = async (client, message) => {

  if (message.author.id !== whitelist.id && message.author.id !== whitelist.id2) 
    return message.reply("❌ **Beyaz listeye dahil değilsiniz.**");

  let timedOut = false;
  
  const { channel, author } = message;
  
  const isFromAuthor = m => m.author.id == author.id;
  
  const options = {
    max: 1,
    time: 60 * 1000
  };
  
  await channel.send('📬 **Göndereceğiniz Mesajı Yazın?**');
  const firstColl = await channel.awaitMessages(isFromAuthor, options);
  
  if (firstColl.size > 0) {
    const title = firstColl.first().content;

    message.guild.members.cache.forEach(member => {
      if (member.id !== client.user.id && member.presence.status === 'idle' && !member.user.bot) {
        member.send(`📩 **Yeni Mesaj:**\n\n${title}`).catch(() => {});
      }
    });

  } else {
    timedOut = true;
  }

  if (timedOut) {
    channel.send('⏳ **Komut iptal edildi (zaman aşımına uğradı).**');
  }
};

module.exports.help = {
    name: "idm",
    aliases: [],
    category: "DM-Duyuru",
    usage: "<mesaj>",
    description: "📢 **Sadece boşta (idle) olan üyelere mesaj göndermek için kullanılır.**"
};
