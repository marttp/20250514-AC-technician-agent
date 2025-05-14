export interface LineWebhookRequest {
	destination: string;
	events: LineMessageEvent[];
}

export interface LineMessageEvent {
	type: 'message';
	message: LineMessage;
	replyToken: string;
	source: LineMessageSource;
	timestamp: number;
}

export interface LineMessage {
	type: 'text';
	id?: string;
	quoteToken?: string;
	text: string;
}

export interface LineMessageSource {
	type: string;
	userId: string;
}
