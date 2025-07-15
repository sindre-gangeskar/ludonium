import { Card, CardContent, Chip, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export default function DonationStat({ name, donations }: { name: string; donations: { [key: string]: number } }) {
	const statSx: SxProps = { px: 2, width: "100%", textTransform: "capitalize", borderRadius: "md" };
	return (
		<Card invertedColors size="md" color="primary" variant="solid" sx={theme => ({ maxWidth: "sm", width: "100%", border: `3px solid ${theme.palette.primary[400]}` })}>
			<CardContent>
				<Typography level="h2" sx={{ textTransform: "capitalize", textAlign: "center" }}>
					{name}
				</Typography>
				{Object.entries(donations).map(donation => (
					<Stack key={donation[0]} direction={"row"} gap={0} sx={{ justifyContent: "space-between" }}>
						<Typography color="neutral" variant="plain" level="title-lg" sx={{ ...statSx }}>
							{donation[0]}
						</Typography>
						<Chip color="primary" variant="outlined" size="lg" sx={{ ...statSx, flex: 0, py: 0 }}>
							{donation[1]}
						</Chip>
					</Stack>
				))}
			</CardContent>
		</Card>
	);
}
