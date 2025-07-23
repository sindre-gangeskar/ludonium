import { ResponseProps } from "@/lib/definitions";
import DonationService from "@/lib/services/DonationService";

export async function getDonations(discordId: string) {
	try {
		return await DonationService.getAll(discordId);
	} catch (error) {
		return error as ResponseProps
	}
}
