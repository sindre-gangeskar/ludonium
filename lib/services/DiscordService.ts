import axios from "axios";
import { DiscordEmbedProps, ResponseProps } from "../definitions";
import DonationService from "./DonationService";
import GiveawayService from "./GiveawayService";

import { capitalizeString, getColorFromHexToInt, parseClientPrismaError } from "../utils";

const discordServerURL = process.env.DISCORD_SERVER_URL;
export default class DiscordService {
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
			const donation = await DonationService.getById(donationId);
			const giveaway = await GiveawayService.create(donation.id);
			const body = { donation: { ...donation }, giveaway: { id: giveaway.id, deadline: giveaway.duration } };
			return await axios.post(`${discordServerURL}/create-giveaway`, body, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An in internal server error has occurred while creating giveaway" } } as ResponseProps);
		}
	}
	static async validateDiscordGuildMembership(discordId: string) {
		try {
			return await axios.get(`${discordServerURL}/validate-guild-membership/${discordId}`);
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to retrieve guild membership data", errors: {"guild": "Failed to retrieve guild membership data"} } as ResponseProps;
		}
	}
	static async getRoles() {
		try {
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while retrieving roles" } } as ResponseProps;
		}
	}
	static async sendGiveawayWinDM(discordId: string, key: string, platform: string, region: string) {
		try {
			const embed: DiscordEmbedProps = {
				title: "Congratulations!",
				description: "You've won a donated game key giveaway!",
				color: getColorFromHexToInt("#9327ff"),
				fields: [
					{ name: "Platform", value: capitalizeString(platform) },
					{ name: "Region", value: region.toUpperCase() },
					{ name: "Key", value: key.toUpperCase() },
				],
			};
			const body = { embeds: [embed] };
			return await axios.post(`${discordServerURL}/send-winner-dm/${discordId}`, body);
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to send giveaway winner dm" } as ResponseProps;
		}
	}
}
