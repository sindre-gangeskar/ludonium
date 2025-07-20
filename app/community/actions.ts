"use server";
import DiscordBotService from "@/lib/services/DiscordService";
import { redirect } from "next/navigation";

export async function getDiscordServerInfo() {
	return await fetch("/api/discord");
}

export async function redirectToInviteLink() {
	const inviteLink = process.env.DISCORD_INVITE_URL;
	if (inviteLink) return redirect(inviteLink);
}

export async function pingDiscordChannel() {
  await DiscordBotService.test();
}