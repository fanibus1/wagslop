import type {
	ChatInputCommandInteraction,
	ClientEvents,
	Collection,
	SlashCommandBuilder,
} from 'discord.js';

export interface Command {
	data: Pick<SlashCommandBuilder, 'name' | 'toJSON'>;
	cooldown?: number;
	execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute(...args: ClientEvents[K]): unknown;
}

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, Command>;
		// command name -> (user id -> last used timestamp)
		cooldowns: Collection<string, Collection<string, number>>;
	}
}
