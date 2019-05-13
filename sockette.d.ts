declare module "sockette" {
	export default class Sockette {
		constructor(url: string, options?: SocketteOptions);
		send(data: any): void;
		json(data: any): void;
		close(code?: number, reason?: string): void;
		reconnect(): void;
		open(): void;
	}

	export interface SocketteOptions {
		protocols?: string | string[];
		timeout?: number;
		maxAttempts?: number;
		onopen?: (this: Sockette, ev: Event) => any;
		onmessage?: (this: Sockette, ev: MessageEvent) => any;
		onreconnect?: (this: Sockette, ev: Event | CloseEvent) => any;
		onmaximum?: (this: Sockette, ev: CloseEvent) => any;
		onclose?: (this: Sockette, ev: CloseEvent) => any;
		onerror?: (this: Sockette, ev: Event) => any;
	}
}
