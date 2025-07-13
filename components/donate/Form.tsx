import { getAllPlatforms } from "@/app/donate/actions";
import FormDisplay from "./FormDisplay";
import { PlatformProps, PlatformTypeProps } from "@/lib/definitions";

export default async function Form() {
	const platforms: PlatformProps[] = await getAllPlatforms();
	const platformTypes: PlatformTypeProps[] = platforms
		.filter(platform => platform.platformType !== undefined && platform.platformType.name)
		.map(platform => ({ id: platform.platformType?.id, name: platform.platformType!.name }))
		.filter((type, index, array) => array.findIndex(i => i.id === type.id) === index);

	return <FormDisplay platforms={platforms} platformTypes={platformTypes} />;
}
