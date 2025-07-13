"use client";
import { PlatformProps, PlatformTypeProps } from "@/lib/definitions";
import { Button, Radio, Card, CardActions, CardContent, FormControl, Input, Typography, RadioGroup, Checkbox, List, ListItem, useColorScheme, FormLabel } from "@mui/joy";
import { ColorPaletteProp, SxProps } from "@mui/joy/styles/types";
import { useState } from "react";

export default function FormDisplay({ platforms, platformTypes }: { platforms: PlatformProps[]; platformTypes: PlatformTypeProps[] }) {
	const [agreed, setAgreed] = useState<boolean>(false);
	const [platformType, setPlatformType] = useState<"pc" | "console">("pc");
	const { mode } = useColorScheme();

	const formControlSx: SxProps = {};
	const termAgreementColor: ColorPaletteProp = "danger";

	const updateAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAgreed(e.target.checked);
	};

	return platforms.length > 0 ? (
		<Card size="sm" sx={{ maxWidth: "sm", mx: "auto", my: 4, px: 4, py: 2, background: "transparent", backdropFilter: "blur(4px)" }}>
			<form>
				<CardContent sx={{ gap: 2 }}>
					{/* Platform Type Selection */}
					<FormControl sx={{ ...formControlSx }}>
						<FormLabel>Select PC or Console</FormLabel>
						<RadioGroup orientation="horizontal" defaultValue={platformTypes[0].id} sx={{ gap: 2, my: 2, justifyContent: "center" }}>
							{platformTypes.map(type => (
								<Radio
									onChange={() => {
										setPlatformType(type.name as "pc" | "console");
									}}
									label={type.name}
									value={type.id}
									key={type.id}
									sx={{ textTransform: type.name === "console" ? "capitalize" : "uppercase" }}>
								</Radio>
							))}
						</RadioGroup>
					</FormControl>
					{/* Platform Selection */}
					<FormControl sx={{ ...formControlSx }}>
						<FormLabel>Select Platform</FormLabel>
						<RadioGroup orientation="horizontal" defaultValue={platforms[0].id} sx={{ gap: 2, my: 2, justifyContent: "center" }}>
							{platforms.map(
								platform =>
									platformType === platform?.platformType?.name && <Radio label={platform.name} value={platform.id} key={platform.id} sx={{ textTransform: platform.name !== "ea" ? "capitalize" : "uppercase" }}></Radio>
							)}
						</RadioGroup>
					</FormControl>
					{/* Game Name Input */}
					<FormControl sx={{ ...formControlSx }}>
						<FormLabel>Game name</FormLabel>
						<Input required name="name" variant={mode === "dark" ? "outlined" : "soft"} color="neutral" placeholder="Enter the name of the game here"></Input>
					</FormControl>
					{/* Game Key Input */}
					<FormControl sx={{ ...formControlSx }}>
						<FormLabel>Game key</FormLabel>
						<Input required name="key" variant={"soft"} color="primary" placeholder="Enter the game key here"></Input>
					</FormControl>
				</CardContent>
				<CardActions>
					<Card color="danger" variant="outlined" sx={{ my: 2 }}>
						<CardContent>
							<Typography color="warning" variant="soft" p={2}>
								Please read the terms underneath <strong>thoroughly</strong> before submitting your key.
							</Typography>
							<List marker="disc">
								<ListItem>
									<Typography level="body-sm" color={termAgreementColor}>
										You agree to forfeit all ownership of the game key you are donating upon submission.
									</Typography>
								</ListItem>
								<ListItem>
									<Typography level="body-sm" color={termAgreementColor}>
										You acknowledge that the game key has <strong>not</strong> been redeemed, <strong>is valid</strong> and that you do not intend to reedem it in the future after submission.
									</Typography>
								</ListItem>
								<ListItem>
									<Typography color={termAgreementColor} level="body-sm">
										You agree to allow the system to store your Discord ID in order to keep track of the donations made by you.
									</Typography>
								</ListItem>
							</List>
						</CardContent>
						<CardActions>
							<Checkbox sx={{ mx: "auto", flex: 1 }} label={"I agree to these terms"} onChange={updateAgreement}></Checkbox>
							<Button sx={{ flex: 1 }} type="submit" size="lg" disabled={!agreed} color="success">
								Submit donation
							</Button>
						</CardActions>
					</Card>
				</CardActions>
			</form>
		</Card>
	) : (
		<Card sx={{ maxWidth: "sm", mt: 5, mx: "auto" }}>
			<CardContent>
				<Typography level="title-md">Donations are currently not available.</Typography>
				<Typography level="title-sm" color="warning">
					Please contact the moderators or admins on the discord server.
				</Typography>
			</CardContent>
		</Card>
	);
}
