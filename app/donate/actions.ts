"use server";
import PlatformService from "@/lib/services/PlatformService";
import DontationService from "@/lib/services/DonationService";
import { z } from "zod";
import { PlatformProps, ResponseProps } from "@/lib/definitions";
export async function getAllPlatforms(): Promise<PlatformProps[]> {
	return await PlatformService.getAll();
}

export async function submitDonation(_state: ResponseProps | null, formdata: FormData) {
	const extractedData = Object.fromEntries(formdata.entries());

	const formSchema = z.object({
		gameName: z.string().min(1),
		key: z.string().min(1),
		discordId: z.string().min(1),
		platformId: z.coerce.number(),
		platformTypeId: z.coerce.number(),
	});

	const validated = formSchema.parse(extractedData);
	return await DontationService.createDonation(validated.discordId, validated.key, validated.gameName, validated.platformTypeId, validated.platformId);
}
