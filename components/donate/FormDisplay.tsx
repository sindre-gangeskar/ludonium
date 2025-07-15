"use client";
import { PlatformProps, PlatformTypeProps, PlatformTypes } from "@/lib/definitions";
import { Box, Button, Radio, Card, CardActions, CardContent, FormControl, Input, Typography, RadioGroup, Checkbox, useColorScheme, FormLabel } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useActionState, useState } from "react";
import Terms from "./Terms";
import { useSession } from "next-auth/react";
import { submitDonation } from "@/app/donate/actions";
import DonationSuccess from "./DonationSuccess";
export default function FormDisplay({ platforms, platformTypes }: { platforms: PlatformProps[]; platformTypes: PlatformTypeProps[] }) {
	const [agreed, setAgreed] = useState<boolean>(false);
	const [activePlatformType, setActivePlatformType] = useState<PlatformTypes>("pc");
	const [activePlatform, setActivePlatform] = useState<PlatformProps>({ name: platforms[0]?.name, id: platforms[0]?.id });
	const { data } = useSession();
	const [state, dispatch, isPending] = useActionState(submitDonation, null);
	const consolePlatforms = platforms.filter(platform => platform?.platformType?.name === "console");
	const pcPlatforms = platforms.filter(platform => platform?.platformType?.name === "pc");
	const { mode } = useColorScheme();

	const formControlSx: SxProps = {};

	const getDefaultPlatform = (platformType: PlatformTypes) => {
		if (platformType === "pc") return pcPlatforms[0];
		else return consolePlatforms[0];
	};
	const updateAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAgreed(e.target.checked);
	};

	return platforms.length && platformTypes.length > 0 ? (
		state?.status === "success" ? (
			<DonationSuccess />
		) : (
			<Card sx={{ maxWidth: "md", mx: "auto", my: 4, px: 4, py: 2 }}>
				<form action={dispatch}>
					<input name="discordId" defaultValue={data?.user?.id} type="hidden"></input>
					<CardContent sx={{ gap: 2 }}>
						{/* Platform Type Selection */}
						<FormControl sx={{ ...formControlSx }}>
							<Typography level="title-sm">Select PC or Console</Typography>
							<RadioGroup orientation="horizontal" defaultValue={platformTypes[0].id} sx={{ gap: 2, my: 2, justifyContent: "center" }}>
								{platformTypes.map(type => (
									<Button
										size="lg"
										color={activePlatformType === type.name ? "primary" : "neutral"}
										variant={activePlatformType == type.name ? "solid" : "soft"}
										component={Radio}
										onChange={() => {
											setActivePlatformType(type.name as PlatformTypes);
											setActivePlatform({
												name: getDefaultPlatform(type?.name as PlatformTypes).name,
												id: getDefaultPlatform(type?.name as PlatformTypes).id,
											});
										}}
										label={type.name}
										value={type.id}
										key={type.id}
										name="platformTypeId"
										sx={{ textTransform: type.name === "console" ? "capitalize" : "uppercase", maxWidth: 'fit-content' }}></Button>
								))}
							</RadioGroup>
						</FormControl>
						{/* Platform Selection */}
						<FormControl sx={{ ...formControlSx }}>
							<Typography level="title-sm">Select Platform</Typography>
							<Box component={"div"} sx={{ width: "100%" }}>
								<RadioGroup
									id={"platform"}
									orientation="horizontal"
									value={activePlatform.id}
									sx={{
										mx: "auto",
										gap: 2,
										my: 2,
										display: "grid",
										gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
										textAlign: "start",
									}}>
									{platforms.map(
										platform =>
											activePlatformType === platform?.platformType?.name && (
												<Button
													size="lg"
													color={activePlatform.name === platform.name ? "primary" : "neutral"}
													variant={activePlatform.name === platform.name ? "solid" : "soft"}
													component={Radio}
													onChange={() => {
														setActivePlatform({ name: platform.name, id: platform.id });

														if (platform.platformType && platform.platformType.name) {
															setActivePlatformType(platform.platformType.name as PlatformTypes);
														}
													}}
													label={platform.name}
													value={platform.id}
													key={platform.id}
													name="platformId"
													sx={{
														textTransform: platform.name !== "ea" ? "capitalize" : "uppercase",
														width: "100%",
														mx: "auto",
														alignContent: "center",
													}}></Button>
											)
									)}
								</RadioGroup>
							</Box>
						</FormControl>
						{/* Game Name Input */}
						<FormControl sx={{ ...formControlSx }}>
							<FormLabel>Game name</FormLabel>
							<Input required name="gameName" variant={mode === "dark" ? "outlined" : "soft"} color="neutral" placeholder="Enter the name of the game here" autoComplete="gameName"></Input>
						</FormControl>
						{/* Game Key Input */}
						<FormControl>
							<FormLabel>Game key</FormLabel>
							<Input name={"key"} placeholder={`Enter your ${activePlatform.name} key here...`}></Input>
						</FormControl>
					</CardContent>
					<CardActions>
						<Card color="danger" variant="outlined" sx={{ my: 2 }}>
							<CardContent>
								<Terms />
							</CardContent>
							<CardActions>
								<Checkbox sx={{ mx: "auto", flex: 1 }} label={"I agree to these terms"} onChange={updateAgreement}></Checkbox>
								<Button loading={isPending} sx={{ flex: 1 }} type="submit" size="lg" disabled={!agreed} color="success">
									Submit donation
								</Button>
							</CardActions>
						</Card>
					</CardActions>
				</form>
			</Card>
		)
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
