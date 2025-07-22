"use server";
import PlatformService from "@/lib/services/PlatformService";
import DontationService from "@/lib/services/DonationService";
import { ResponseProps } from "@/lib/definitions";
import RegionService from "@/lib/services/RegionService";

export async function getAllPlatforms() {
	return await PlatformService.getAll();
}

export async function getAllRegions() {
	return await RegionService.getAll();
}

export async function submitDonation(_state: ResponseProps | null, formdata: FormData) {
	return await DontationService.create(formdata);
}
