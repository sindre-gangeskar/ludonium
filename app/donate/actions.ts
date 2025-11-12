"use server";
import PlatformService from "@/lib/services/PlatformService";
import DonationService from "@/lib/services/DonationService";
import { PlatformProps, RegionProps, ResponseProps } from "@/lib/definitions";
import RegionService from "@/lib/services/RegionService";
import DiscordService from "@/lib/services/DiscordService";

export async function getAllPlatforms() {
	try {
		const data = await PlatformService.getAll();
		return { status: "success", statusCode: 200, data: data as PlatformProps[] } as ResponseProps;
	} catch (error) {
		return error as ResponseProps;
	}
}

export async function getAllRegions() {
	try {
		const data = await RegionService.getAll();
		return { status: "success", statusCode: 200, data: data as RegionProps[] } as ResponseProps;
	} catch (error) {
		return error as ResponseProps;
	}
}

export async function submitDonation(_state: ResponseProps | null, formdata: FormData) {
	try {
		const discordId = String(formdata.get("discordId"));
		if (!discordId) return { status: "fail", statusCode: 400, message: "Failed to retrieve discord id" } as ResponseProps;
		const response = await DiscordService.validateDiscordGuildMembership(discordId);
		console.log(response);
		if (response && response.data.status === "success") {
			await DonationService.create(formdata);
			return { status: "success", statusCode: 201, message: "Successfully created donation" } as ResponseProps;
		} else return response.data;

	} catch (error) {
		return error as ResponseProps;
	}
}
