"use server";
import PlatformService from "@/lib/services/PlatformService";
import DontationService from "@/lib/services/DonationService";
import { ResponseProps } from "@/lib/definitions";

export async function getAllPlatforms() {
	return await PlatformService.getAll();
}

export async function submitDonation(_state: ResponseProps | null, formdata: FormData) {
	return await DontationService.createDonation(formdata);
}
