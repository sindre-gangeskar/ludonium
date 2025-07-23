"use server";
import PlatformService from "@/lib/services/PlatformService";
import DontationService from "@/lib/services/DonationService";
import { ResponseProps } from "@/lib/definitions";
import RegionService from "@/lib/services/RegionService";

export async function getAllPlatforms() {
	try {
		return await PlatformService.getAll();
	} catch (error) {
		return error as ResponseProps
	}
}

export async function getAllRegions() {
	try {
		return await RegionService.getAll();
	} catch (error) {
		return error as ResponseProps
	}
}

export async function submitDonation(_state: ResponseProps | null, formdata: FormData) {
	try {
		return await DontationService.create(formdata);
	} catch (error) {
		return error as ResponseProps;
	}
}
