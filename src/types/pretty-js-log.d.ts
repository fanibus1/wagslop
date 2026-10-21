// pretty-js-log ships no types
declare module 'pretty-js-log' {
	type LogFn = (...args: unknown[]) => void;

	interface Logger extends LogFn {
		debug: LogFn;
		info: LogFn;
		warn: LogFn;
		error: LogFn;
		id(newId: string): Logger;
	}

	export function logFactory(options?: {
		id?: string;
		path?: string;
		colors?: unknown;
		toStdout?: boolean;
		dayBasedFileLog?: boolean;
		dateFormat?: string;
	}): Logger;
}
