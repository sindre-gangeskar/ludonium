import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { encrypt, generateKeyHash, parseClientPrismaError } from "../utils";
export default class KeyService {
	static async create(key: string, platformId: number) {
		try {
			const { encrypted, iv, authTag } = encrypt(key);
			const keyHash = generateKeyHash(key);
			return await prisma.key.create({ data: { key: encrypted.toString("hex"), keyHash: keyHash, platformId: platformId, iv: iv.toString("hex"), authTag: authTag.toString("hex") } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			if (prismaError) return { status: "fail", statusCode: 409, errors: { key: prismaError.message } } as ResponseProps;
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while submitting key" } } as ResponseProps;
		}
	}
	static async getById(id: number) {
		try {
			return await prisma.key.findFirst({ where: { id: id }, include: {Platform: true} });
		} catch (error) {
			const message = "An internal server message has occurred while retrieving key";
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: message } } as ResponseProps;
		}
	}
	static async getAll() {
		try {
			return await prisma.key.findMany({ include: { Platform: true } });
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while fetching keys" } } as ResponseProps;
		}
	}
}
