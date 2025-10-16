import axios from "axios";
import { DiscordEmbedProps, ResponseProps } from "../definitions";
import DonationService from "./DonationService";
import GiveawayService from "./GiveawayService";
import { unstable_cache } from "next/cache";
import { capitalizeString, decrypt, getColorFromHexToInt, getDiscordVariables, parseClientPrismaError, parseDiscordError } from "../utils/server";
import KeyService from "./KeyService";
const revalidate = process.env.REVALIDATE_AFTER ? +process.env.REVALIDATE_AFTER : 60 * 60 * 3;
const { serverUrl } = getDiscordVariables();
export default class DiscordService {
	static getGulildData = unstable_cache(async () => {
		try {
			const { data: { data } } = await axios.get(`${serverUrl}/get-guild-info`, { headers: { "Content-Type": "application/json" } });
			return data;
		} catch (error) {
			console.error(error);
			throw { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while fetching guild data" } } as ResponseProps;
		}
	}, [ 'guild-data' ], { revalidate: revalidate })

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
			throw {
				status: "error",
				statusCode: 500,
				message: "An internal server error has occurred while trying to retrieve guild membership data",
				errors: { guild: "Failed to retrieve guild membership data" },
			} as ResponseProps;
		}
	}
	static async sendGiveawayWinDM(discordId: string, keyId: number, platform: string, region: string, giveawayId: number) {
		try {
			const key = await KeyService.getById(keyId);
			const decrypted = decrypt(key.key, key.iv, key.authTag);
			const embed: DiscordEmbedProps = {
				title: "Congratulations!",
				description: "You've won a donated game key giveaway!",
				color: getColorFromHexToInt("#9327ff"),
				fields: [
					{ name: "Platform", value: capitalizeString(platform) },
					{ name: "Region", value: region.toUpperCase() },
					{ name: "Key", value: decrypted.toUpperCase() },
				],
			};
			const body = { embeds: [ embed ] };

			return await axios.post(`${serverUrl}/send-winner-dm/${discordId}`, body);
		} catch (error) {
			console.error(error);
			const discordError = await parseDiscordError(error, giveawayId);
			throw discordError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to send giveaway winner dm" } as ResponseProps);
		}
	}
}
