import { PlatformProps, PlatformTypeProps, RegionProps, StatusProps } from "@/lib/definitions";
import prisma from "@/lib/prisma/prisma";

async function seed() {
	try {
		const platforms: PlatformProps[] = [
			{ name: "steam", platformTypeId: 1 },
			{ name: "epic", platformTypeId: 1 },
			{ name: "gog", platformTypeId: 1 },
			{ name: "ea", platformTypeId: 1 },
			{ name: "ubisoft", platformTypeId: 1 },
			{ name: "switch", platformTypeId: 2 },
			{ name: "xbox", platformTypeId: 2 },
			{ name: "playstation", platformTypeId: 2 },
		];
		const statuses: StatusProps[] = [{ name: "active" }, { name: "inactive" }];

		const regions: RegionProps[] = [{ name: "eu" }, { name: "us" }, { name: "latam" }, { name: "au" }, { name: "asia" }, { name: "ru" }, { name: "cis" }, { name: "global" }];

		const platformTypes: PlatformTypeProps[] = [{ name: "pc" }, { name: "console" }];
		
		for (const status of statuses) {
			await prisma.status.upsert({ where: { name: status.name }, create: { name: status.name }, update: {} });
		}

		for (const region of regions) {
			await prisma.region.upsert({ where: { name: region.name }, create: { ...region }, update: {} });
		}

		for (const type of platformTypes) {
			await prisma.platformType.upsert({ where: { name: type.name }, create: { ...type }, update: {} });
		}

		for (const platform of platforms) {
			await prisma.platform.upsert({
				where: { name: platform.name },
				create: { name: platform.name, platformTypeId: platform.platformTypeId },
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
