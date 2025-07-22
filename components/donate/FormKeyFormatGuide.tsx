import { PlatformProps } from "@/lib/definitions";
import { Card, CardContent, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export default function FormKeyFormatGuide({ platform }: { platform: PlatformProps["name"] }) {
	const steamFormat: string[] = ["AAAAA-BBBBB-CCCCC-DDDDD-EEEEE", "AAAAA-BBBBB-CCCCC", "AAAAABBBBBCCCCCDDDDDEEEEE", "ABCDE12345XYZA3"];
	const epicFormat: string[] = ["AAAAA-BBBBB-CCCCC-DDDDD-EEEEE"];
	const gogFormat: string[] = ["AAAAA-BBBBB-CCCCC-DDDDD-EEEEE"];
	const xboxFormat: string[] = ["AAAAA-BBBBB-CCCCC-DDDDD-EEEEE"];
	const playstationFormat: string[] = ["AAAA-BBBB-CCCC"];
	const eaFormat: string[] = ["AAAA-BBBB-CCCC-DDDD"];
	const ubisoftFormat: string[] = ["AAA-BBBB-CCCC-DDDD-EEEE", "AAAA-BBBB-CCCC-DDDD"];
	const switchFormat: string[] = ["AAAA-BBBB-CCCC-DDDD"];
	const textSx: SxProps = { textAlign: "center", pointerEvents: "none", userSelect: "none" };
	return (
		<Card size="sm" color="warning" variant="outlined" sx={{ my: 1, userSelect: "none" }}>
			<Typography color="warning" level="title-md" textAlign={"center"} sx={{ p: 0, m: 0 }}>
				Valid {platform} key formats
			</Typography>
			<CardContent>
				<Stack gap={1}>
					{platform === "gog" && <Guidelines arr={gogFormat} sx={textSx} />}
					{platform === "steam" && <Guidelines arr={steamFormat} sx={textSx} />}
					{platform === "ea" && <Guidelines arr={eaFormat} sx={textSx} />}
					{platform === "epic" && <Guidelines arr={epicFormat} sx={textSx} />}
					{platform === "ubisoft" && <Guidelines arr={ubisoftFormat} sx={textSx} />}
					{platform === "switch" && <Guidelines arr={switchFormat} sx={textSx} />}
					{platform === "xbox" && <Guidelines arr={xboxFormat} sx={textSx} />}
					{platform === "playstation" && <Guidelines arr={playstationFormat} sx={textSx} />}
				</Stack>
			</CardContent>
		</Card>
	);
}

function Guidelines({ arr, sx }: { arr: string[]; sx: SxProps }) {
	return arr.map(format => (
		<Typography variant="plain" color="warning" level="title-sm" key={format} sx={{ ...sx }}>
			{format}
		</Typography>
	));
}
