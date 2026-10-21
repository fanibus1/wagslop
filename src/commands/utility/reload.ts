import { SlashCommandBuilder } from 'discord.js';
import { LOGGER } from '../../logger';
import type { Command } from '../../types';

export default {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true),
		),

	async execute(interaction) {
		const commandName = interaction.options
			.getString('command', true)
			.toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(
				`There is no command with name \`${commandName}\`!`,
			);
		}

		// First delete file from require.cache before requiring and setting command file to `client.commands`
		delete require.cache[require.resolve(`./${command.data.name}.js`)];

		try {
			const newCommand: Command = require(`./${command.data.name}.js`).default;
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`,
			);
		} catch (error) {
			console.error(error);
			LOGGER.error(error);

			await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${(error as Error).message}\``,
			);
		}
	},
} satisfies Command;
