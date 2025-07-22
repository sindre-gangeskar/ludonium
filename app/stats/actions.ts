import DonationService from "@/lib/services/DonationService";

export async function getDonations(discordId: string) {
	return await DonationService.getAll(discordId);
}
