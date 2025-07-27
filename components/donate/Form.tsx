import { getAllPlatforms, getAllRegions } from "@/app/donate/actions";
import FormDisplay from "./FormDisplay";
import { PlatformTypeProps, PlatformProps, RegionProps } from "@/lib/definitions";

export default async function Form() {
	const platforms = (await getAllPlatforms()) as { data: PlatformProps[] };
	const regions = (await getAllRegions()) as { data: RegionProps[] };

	const platformTypes: PlatformTypeProps[] = platforms.data
		.filter(platform => platform.platformType !== undefined && platform?.platformType?.name)
		.map(platform => ({ id: platform.platformType?.id, name: platform.platformType!.name }))
		.filter((type, index, array) => array.findIndex(i => i.id === type.id) === index);

	return <FormDisplay regions={regions.data} platforms={platforms.data} platformTypes={platformTypes} />;
}
