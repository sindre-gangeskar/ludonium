import axios from "axios";
import { DiscordEmbedProps, ResponseProps } from "../definitions";
import DonationService from "./DonationService";
import GiveawayService from "./GiveawayService";

import { capitalizeString, getColorFromHexToInt, getDiscordVariables, parseClientPrismaError } from "../utils";

const { serverUrl } = getDiscordVariables();
export default class DiscordService {
	static async getGuildData() {
		try {
			return await axios.get(`${serverUrl}/get-guild-info`, { headers: { "Content-Type": "application/json" } });
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
			return await axios.post(`${serverUrl}/create-giveaway`, body, { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An in internal server error has occurred while creating giveaway" } } as ResponseProps);
		}
	}
	static async validateDiscordGuildMembership(discordId: string) {
		try {
			const result = await axios.get(`${serverUrl}/validate-guild-membership/${discordId}`);
			return result;
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to retrieve guild membership data", errors: {"guild": "Failed to retrieve guild membership data"} } as ResponseProps;
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
			return await axios.post(`${serverUrl}/send-winner-dm/${discordId}`, body);
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to send giveaway winner dm" } as ResponseProps;
		}
	}
}
