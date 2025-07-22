import axios from "axios";
import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { getGiveawayDurationInDateTime } from "../utils";
import DontationService from "./DonationService";

const discordServerURL = process.env.DISCORD_SERVER_URL;
export default class DiscordService {
	static async test() {
		try {
			return await axios.get(`${discordServerURL}/discord-test`, { headers: { 'Content-Type': 'application/json' } });
		} catch (error) {
			console.error(error);
			return {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while running test function'}} as ResponseProps
		}
	}
	static async getGuildData() {
		try {
			return await axios.get(`${discordServerURL}/get-server-info`, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while fetching guild data" } } as ResponseProps;
		}
	}
	static async createGiveaway(donationId: number) {
		try {
			const donation = await DontationService.getById(donationId);
			if (!donation) throw new Error("Failed to find donation");

			const deadline = getGiveawayDurationInDateTime(2);
			const giveaway = await prisma.giveaway.create({ data: { donationId: donation.id, statusId: 1, duration: deadline } });

			return await axios.post(`${discordServerURL}/create-giveaway`, { donation: { ...donation }, giveaway: { id: giveaway.id } }, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An in internal server error has occurred while creating giveaway" } } as ResponseProps;
		}
	}
	static async getRoles() {
		try {
			
		} catch (error) {
			console.error(error);
			return {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while retrieving roles'}} as ResponseProps
		}
	}
}
