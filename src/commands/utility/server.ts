import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../types';

export default {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		if (!interaction.inCachedGuild()) {
			return interaction.reply('This command only works in a server.');
		}

		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(
			`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
		);
	},
} satisfies Command;
