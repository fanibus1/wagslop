const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	/*
	 * @type interaction ChatInputCommand
	 */
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		// if (!interaction.isChatInputCommand()) return;

		await interaction.reply(
			`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
		);
	},
};
