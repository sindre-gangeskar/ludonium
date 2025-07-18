import { DonationProps, PlatformProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { isKeyValid } from "../utils";
import KeyService from "./KeyService";

export default class DontationService {
	static async getDonations(discordId: string) {
		try {
			return (await prisma.donation.findMany({ where: { discordId: discordId }, include: { platform: true, platformType: true, region: true } })).map(donation => ({
				region: { id: donation?.region?.id, name: donation?.region?.name },
				platform: donation?.platform?.name,
				platformType: donation?.platformType?.name,
			})) as DonationProps[];
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to get donations" } as ResponseProps;
		}
	}

	static async createDonation(formdata: FormData) {
		try {
			const validated = await validateForm(formdata);
			if (!validated.success) throw { status: "fail", statusCode: 400, errors: validated.errors } as ResponseProps;

			const createdKey = await KeyService.create(validated.data.key, +validated.data.platformId);
			await prisma.donation.create({
				data: { regionId: +validated.data.regionId, keyId: createdKey.id, platformId: +validated.data.platformId, platformTypeId: +validated.data.platformTypeId, discordId: validated.data.discordId },
			});

			return { status: "success", statusCode: 201, message: "Successfully created donation" } as ResponseProps;
		} catch (error) {
			console.error(error);
			if (error && typeof error === "object" && "errors" in error) return error as ResponseProps;
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to create a donation" } as ResponseProps;
		}
	}
}

async function validateForm(formdata: FormData) {
	const platform = await prisma.platform.findFirst({ where: { id: Number(formdata.get("platformId")) } });
	if (!platform) throw new Error("Failed to retrieve platform by provided id");
	const numberRegex = /^[0-9]+$/;
	let accumulatedErrors: { [key: string]: string } = {};
	const form = Object.fromEntries(formdata.entries());

	const data: { regionId: string; platformId: string; platformTypeId: string; key: string; discordId: string } = {
		regionId: form.regionId.toString(),
		discordId: form.discordId.toString(),
		key: form.key.toString(),
		platformId: form.platformId.toString(),
		platformTypeId: form.platformTypeId.toString(),
	};

	if (typeof data.discordId !== "string" || data.discordId === "") {
		accumulatedErrors = { ...accumulatedErrors, discordId: "Discord ID must be a string and cannot be empty" };
	}
	if (!numberRegex.test(data.platformTypeId)) {
		accumulatedErrors = { ...accumulatedErrors, platformTypeId: "platformTypeId is required and must be a number" };
	}
	if (!numberRegex.test(data.platformId)) {
		accumulatedErrors = { ...accumulatedErrors, platformId: "platformId is required and must be a number" };
	}
	if (!numberRegex.test(data.regionId)) {
		accumulatedErrors = { ...accumulatedErrors, platformId: "platformId is required and must be a number" };
	}
	if (data.key && !isKeyValid(platform.name as PlatformProps["name"], data.key.toString())) {
		accumulatedErrors = { ...accumulatedErrors, key: `Invalid ${platform.name} key format` };
	}
	console.error(accumulatedErrors);
	return Object.keys(accumulatedErrors).length > 0 ? { errors: accumulatedErrors, success: false, data: data } : { data, success: true };
}
