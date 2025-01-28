const discord = require("discord.js");
const { config } = require("../../lurixdm.js");

module.exports.execute = async (client, message, args) => {

    const helpCommand = client.commands.get("help").help;
    const embed = new discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL(client.user))
        .setFooter(`İsteyen: ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor('#7289DA') // Modern bir renk ekledim (Discord mavisi)
        .setDescription('🔹 **Komut Yardımı** \nHangi komutu görmek istersiniz?');

    if (!args[0]) {

        const categories = [...new Set(client.commands.map(command => command.help.category))];
    
        embed.setTitle(`${client.user.tag} | Komut Listesi`)
            .setDescription([
                `**Prefix:** \`${config.prefix}\` ⚡`,
                `<> : **Zorunlu** | [] : **Opsiyonel** 🔧`,
                `Daha fazla detay için \`${config.prefix}${helpCommand.name} ${helpCommand.usage}\` komutunu kullanabilirsiniz. 🔎`
            ].join("\n"));
    
        let categorisedCommands;
    
        for (const category of categories) {
            categorisedCommands = client.commands.filter(cmd => cmd.help.category == category);
            embed.addField(`${category} 📂`, categorisedCommands.map(cmd => `\`${cmd.help.name}\``).join(", "));
        }
    
        message.channel.send(embed);
        return;
    }

    const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    if (!command) return this.execute(client, message, []);

    const commandInfo = command.help;
    const aliasesPresent = commandInfo.aliases.length > 0;
    
    embed.setTitle(`✨ ${commandInfo.name.toUpperCase()} KOMUTU ✨`)
        .setDescription(commandInfo.description)
        .addField("🔑 **Kullanım**", `\`${config.prefix}${commandInfo.name}${commandInfo.usage != "" ? ` ${commandInfo.usage}` : ""}\``)
        .addField("🔄 **Aliaslar**", `${aliasesPresent ? commandInfo.aliases.map(alias => `\`${alias}\``).join(", ") : "⛔ Yok"}`);

    message.channel.send(embed);

}

module.exports.help = {
    name: "help",
    aliases: [],
    category: "Çeşitli",
    usage: "[komut]",
    description: "Komutlar çok karmaşık mı? Yardıma mı ihtiyacınız var? Yardım için buradayım! 💡"
}
