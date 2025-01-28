const fs = require("fs");
const path = require("path");
module.exports.Utils = class Utils {

	constructor(client, project_folder) {
		this.client = client;
		this.project_folder = project_folder;
	}

	_findNested = (dir, pattern) => {

		let results = [];

		fs.readdirSync(dir).forEach(inner_dir => {

			inner_dir = path.resolve(dir, inner_dir);
			const stat = fs.statSync(inner_dir);

			if (stat.isDirectory()) {
				results = results.concat(this._findNested(inner_dir, pattern));
			}

			if (stat.isFile() && inner_dir.endsWith(pattern)) {
				results.push(inner_dir);
			}

		});	
		
		return results;

	}

	loadModules = (dir, command=false) => {

		const jsFiles = this._findNested(this.project_folder + `${path.sep}${dir}${path.sep}`, ".js");

		if (jsFiles.length <= 0) return console.log(`Yükleyecek ${command ? "komut" : "dosya"} yok.`);

		console.log(`${jsFiles.length} ${command ? "komut" : "dosya"} ${jsFiles.length <= 1 ? "yükleniyor..." : "yükleniyor..."}`);
		jsFiles.forEach(file => {
			const pull = require(file);

			if (command) {
				if (this.client.commands.get(pull.help.name)) console.warn(`ÇATIŞMA: Aynı komutlar bulundu: ${pull.help.name}`);
				else this.client.commands.set(pull.help.name, pull);

				if (pull.help.aliases && typeof pull.help.aliases == "object") {
					pull.help.aliases.forEach(alias => {
						if (this.client.aliases.get(alias)) console.warn(`ÇATIŞMA: Aynı aliaslar bulundu: ${alias}`);
						else if (this.client.commands.get(alias)) console.warn(`ÇATIŞMA: Alias, komut adıyla çakışıyor: ${alias}`)
						else this.client.aliases.set(alias, pull.help.name);
					});
				}
			}

		});

	}

	loadCommand = (command, autoReload=true) => {
		
		if (!autoReload) {
			const commandFiles = this._findNested(this.project_folder + "\\commands\\", ".js");
			command = commandFiles.filter(commandFile => commandFile.split("\\").pop() == `${command}.js`)[0];
			if (!command) return "Bilinmeyen Komut";
		}
		
		try {

			const cmd = require(command);
			if (this.client.commands.get(cmd.help.name)) return "Komut Zaten Yüklü";

            this.client.commands.set(cmd.help.name, cmd);
            cmd.help.aliases.forEach(alias => {
                this.client.aliases.set(alias, cmd.help.name);
			});
			return "Komut Yüklendi";
			
        } catch {
            return "Hata";
		}

	}

	unloadCOmmand = (command, autoReload=true) => {

		if (!autoReload) {
			const commandFiles = this._findNested(this.project_folder + "\\commands\\", ".js");
			command = commandFiles.filter(commandFile => commandFile.split("\\").pop() == `${command}.js`)[0];
			if (!command) return "Bilinmeyen Komut";
		}

        try {
			const commandName = command.split("\\").pop().split(".")[0];
			const res = this.client.commands.delete(commandName);
			if (!res) return "Komut Yüklenmedi";
			
            delete require.cache[require.resolve(command)];
			return "Komut Kaldırıldı";

        } catch (err) {
            return "Hata";
        }

	}

	reloadCommand = (commandName) => {

		const commandFiles = this._findNested(this.project_folder + "\\commands\\", ".js");
		const command = commandFiles.filter(commandFile => commandFile.split("\\").pop() == `${commandName}.js`)[0];
		if (!command) return "Bilinmeyen Komut";

		const res = this.unloadCOmmand(command);

		switch (res) {
			case "Komut Kaldırıldı": return this.loadCommand(command);
			default: return res;
		}

	}

	formatSeconds = (seconds) => {
		return new Date(seconds * 1000).toISOString().substr(11, 8)
	}

	replaceStrChar = (str, index, replacement) => {
		return str.substr(0, index) + replacement + str.substr(index + replacement.length);
	}

}
