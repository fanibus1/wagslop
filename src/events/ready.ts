import { Events } from 'discord.js';
import { LOGGER } from '../logger';
import type { Event } from '../types';

// When the client is ready, run this code (only once).
// `client` is a `Client<true>` here, so properties like `client.user` are non-nullable.
export default {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		LOGGER.info(`Ready! Logged in as ${client.user.tag}`);
	},
} satisfies Event<Events.ClientReady>;
