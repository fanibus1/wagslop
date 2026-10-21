const { Events, MessageFlags, Collection } = require('discord.js');
const { DEFAULT_COOLDOWN } = require('../const.js');
const { LOGGER } = require('../logger.js');

// Receive chat input command interactions
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(
			interaction.commandName,
		);

		if (!command) {
			LOGGER.error(
				`No command matching ${interaction.commandName} was found.`,
			);
			return;
		}

		try {
			LOGGER.debug(
				`User ${interaction.user.id} executing \`${command.data.name}\`...`,
			);

			// COOLDOWNS
			const { cooldowns } = interaction.client;

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const cooldownAmount =
				(command.cooldown ?? DEFAULT_COOLDOWN) * 1_000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime =
					timestamps.get(interaction.user.id) + cooldownAmount;

				if ((waitTime = expirationTime - now) > 0) {
					LOGGER.debug(
						`User ${interaction.user.id} must wait ${waitTime / 1_000} s for command \`${command.data.name}\` (cooldown ${cooldownAmount / 1_000} s)`,
					);

					const expiredTimestamp = Math.round(expirationTime / 1_000);
					return interaction.reply({
						content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			// set user key in command and timeout
			timestamps.set(interaction.user.id, now);
			setTimeout(() => {
				LOGGER.debug(
					`Deleting timestamp for command \`${command.data.name}\`, user ${interaction.user.id}`,
				);
				timestamps.delete(interaction.user.id);
			}, cooldownAmount);

			// actually execute command
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};
