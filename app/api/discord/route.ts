import { NextResponse } from "next/server";
export async function GET() {
	try {
		const response = await fetch(`${process.env.DISCORD_API_URL}/guilds/${process.env.DISCORD_GUILD_ID}`, {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data = await response.json();
			const body = {
				name: data.name,
				description: data.description,
				icon: `${process.env.DISCORD_ICON_URL}/${process.env.DISCORD_GUILD_ID}/${data.icon}`,
				roles: data.roles,
			};
			return NextResponse.json(body);
		} else return NextResponse.json({}, { status: 500, statusText: "Failed to fetch to Discord API" });
	} catch (error) {
		console.error(error);
		throw error;
	}
}
