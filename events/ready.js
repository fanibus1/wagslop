const { Events } = require('discord.js');
const { LOGGER } = require('../logger.js');

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		LOGGER.info(`Ready! Logged in as ${client.user.tag}`);
	},
};
