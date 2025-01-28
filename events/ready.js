const Discord = require("discord.js")
const { client, config } = require("../lurixdm.js")

client.on("ready", () => {

    console.log("|\n|    DM-Duyuru Bot\n|   Made by lurixgithub\n|\n| Last Update: 24.01.2025\n|")

    client.user.setActivity(`www.youtube.com/@luriXgithub v${config.version}`, { type: "WATCHING" }).catch(console.error);

})