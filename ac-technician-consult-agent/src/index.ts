import { LineWebhookRequest } from './common';
import { reply, constructAccessToken } from './line.api';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}
		const headers = Object.fromEntries(request.headers);
		const body: LineWebhookRequest = await request.json();
		// const lineSignature = headers['x-line-signature'];
		ctx.waitUntil(handleLineWebhook(body, env, ctx));
		return new Response('OK', { status: 200 });
	},
} satisfies ExportedHandler<Env>;

async function handleLineWebhook(body: LineWebhookRequest, env: Env, ctx: ExecutionContext) {
	const event = body.events[0];
	const query = event.message.text;
	const promptMessage = `
		คุณเป็นช่างแอร์ที่คอยช่วยเหลือลูกค้าในการแก้ไขปัญหาของ Air Conditioner
		ตอบแบบเป็นระเบียบ อ่านง่าย
		Query: ${query}
	`;
	const answer = await env.AI.autorag("ac-technician-rag-48sd484c").aiSearch({
		query: promptMessage,
	});
	const response = answer.response;
	// Send response back to LINE
	const channelAccessToken = env.CHANNEL_ACCESS_TOKEN || 'test';
	const accessToken = constructAccessToken(channelAccessToken);
	await reply(accessToken, event.replyToken, [{ type: 'text', text: response }]);
}
	