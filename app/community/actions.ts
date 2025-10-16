"use server";
import { redirect } from "next/navigation";
import DiscordService from "@/lib/services/DiscordService";

export async function getDiscordServerInfo() {
	return await DiscordService.getGulildData();
}

export async function redirectToInviteLink() {
	const inviteLink = process.env.DISCORD_INVITE_URL;
	if (inviteLink) return redirect(inviteLink);
}