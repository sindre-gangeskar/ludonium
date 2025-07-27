"use server";
import { DonationProps, ResponseProps } from "@/lib/definitions";
import DontationService from "@/lib/services/DonationService";
import GiveawayService from "@/lib/services/GiveawayService";
import { revalidatePath } from "next/cache";

interface DonationsDataProps {
	pc: number;
	console: number;
}

export async function getAvailableDonationsCount() {
	try {
		const pcCount = await DontationService.getCountByPlatformType("pc");
		const consoleCount = await DontationService.getCountByPlatformType("console");
		return { status: "success", statusCode: 200, message: "Successfully retrieved donation counts", data: { pc: pcCount, console: consoleCount } } as ResponseProps<DonationsDataProps>;
	} catch (error) {
		return error as ResponseProps<DonationProps>;
	}
}

export async function createConsoleGiveaway() {
	try {
		await GiveawayService.createRandomGiveaway("console");
		revalidatePath("/");
		return { status: "success", statusCode: 200, message: "Successfully created Console giveaway" } as ResponseProps;
	} catch (error) {
		console.error(error);
		return error as ResponseProps;
	}
}
export async function createPCGiveaway() {
	try {
		await GiveawayService.createRandomGiveaway("pc");
		revalidatePath("/");
		return { status: "success", statusCode: 200, message: "Successfully created PC giveaway" } as ResponseProps;
	} catch (error) {
		console.error(error);
		return error as ResponseProps;
	}
}
