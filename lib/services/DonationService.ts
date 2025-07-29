import { DonationProps, PlatformProps, PlatformTypeProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { isKeyValid, parseClientPrismaError } from "../utils";
import GiveawayService from "./GiveawayService";
import DiscordService from "./DiscordService";
import KeyService from "./KeyService";

const allowAutoGiveaway = Boolean(process.env.DISCORD_ALLOW_AUTO_GIVEAWAY === "true");
export default class DonationService {
	static async getAll(discordId: string) {
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
	static async create(formdata: FormData) {
		try {
			const validated = await validateForm(formdata);
			if (!validated.success) throw { status: "fail", statusCode: 400, errors: validated.errors } as ResponseProps;

			const createdKey = await KeyService.create(validated.data.key, +validated.data.platformId);
			if (!("key" in createdKey)) throw createdKey;

			const donation = await prisma.donation.create({
				data: { regionId: +validated.data.regionId, keyId: createdKey.id, platformId: +validated.data.platformId, platformTypeId: +validated.data.platformTypeId, discordId: validated.data.discordId },
			});

			if (allowAutoGiveaway === true) {
				await DiscordService.createGiveaway(donation.id);
			}
			return donation;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donation");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to create a donation" } as ResponseProps);
		}
	}
	static async getById(donationId: number) {
		try {
			return await prisma.donation.findFirstOrThrow({ where: { id: donationId }, include: { key: true, platform: true, region: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donation");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get donation by id" } } as ResponseProps);
		}
	}
	static async getByRegionId(regionId: number) {
		try {
			return await prisma.donation.findMany({ where: { regionId: regionId }, include: { region: true, platform: true, platformType: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donations");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to fetch donations by region" } } as ResponseProps);
		}
	}
	static async getByPlatformType(platformType: PlatformTypeProps["name"]) {
		try {
			const donations = await prisma.donation.findMany({ where: { platformType: { name: platformType }, giveawayId: null } });
			return donations;
		} catch (error) {
			console.error(error);
			const prismaError = await parseClientPrismaError(error, "donations");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to retrieve donations by platform" } } as ResponseProps);
		}
	}
	static async getCountByPlatformType(platformType: PlatformTypeProps["name"]) {
		try {
			return await prisma.donation.count({ where: { platformType: { name: platformType }, giveawayId: null } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donations");
			throw (
				prismaError ?? ({ status: "success", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to retrieve donations count by platform type name" } } as ResponseProps)
			);
		}
	}
	static async assignGiveawayId(id: number, giveawayId: number) {
		try {
			const giveaway = await GiveawayService.getById(giveawayId);
			await prisma.donation.update({ where: { id: id }, data: { giveawayId: giveaway.id } });
			return { status: "success", statusCode: 200, message: "Successfully assigned giveaway id to donation" } as ResponseProps;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donations");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while assigning a giveaway id to donation" } } as ResponseProps);
		}
	}
	static async getByGiveawayId(id: number) {
		try {
			return await prisma.donation.findFirst({ where: { giveawayId: id }, include: { key: true, platform: true, region: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "donations");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to retrieve giveaway by donation id" } as ResponseProps);
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
