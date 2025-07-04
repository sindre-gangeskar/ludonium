import { Platform } from "@/lib/definitions";
import prisma from "@/lib/prisma/prisma";

async function seed() {
	try {
		const platforms: Platform[] = [{ name: "steam" }, { name: "xbox" }, { name: "playstation" }];

		for (const platform of platforms) {
			await prisma.platform.upsert({
				where: { name: platform.name },
				create: { name: platform.name },
				update: {},
			});
		}

		console.info("Database has been seeded 🟢");
	} catch (error) {
		console.error(error);
		throw error;
	}
}

seed()
	.then(async () => {
		prisma.$disconnect();
	})
	.catch(err => {
		console.error(err);
		prisma.$disconnect();
		process.exit(1);
	});
