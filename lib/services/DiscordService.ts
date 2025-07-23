import axios from "axios";
import { ResponseProps } from "../definitions";
import DontationService from "./DonationService";
import GiveawayService from "./GiveawayService";
import { parseClientPrismaError } from "../utils";

const discordServerURL = process.env.DISCORD_SERVER_URL;
export default class DiscordService {
	static async test() {
		try {
			return await axios.get(`${discordServerURL}/discord-test`, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while running test function" } } as ResponseProps;
		}
	}
	static async getGuildData() {
		try {
			return await axios.get(`${discordServerURL}/get-guild-info`, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while fetching guild data" } } as ResponseProps;
		}
	}
	static async createGiveaway(donationId: number) {
		try {
			const donation = await DontationService.getById(donationId);
			if (!donation) throw new Error("Failed to find donation");

			const giveaway = await GiveawayService.create(donation.id);
			if (!giveaway || !("id" in giveaway) || !("duration" in giveaway)) throw new Error("Failed to create giveaway");

			return await axios.post(`${discordServerURL}/create-giveaway`, { donation: { ...donation }, giveaway: { id: giveaway.id, deadline: giveaway.duration } }, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, 'giveaway');
			throw prismaError ?? { status: "error", statusCode: 500, errors: { generic: "An in internal server error has occurred while creating giveaway" } } as ResponseProps;
		}
	}
	static async getRoles() {
		try {

		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while retrieving roles" } } as ResponseProps;
		}
	}
}
