"use client";
import { PlatformProps, PlatformTypeProps, PlatformTypes, RegionProps } from "@/lib/definitions";
import { Box, Button, Radio, Card, CardActions, CardContent, FormControl, Input, Typography, RadioGroup, Checkbox, FormLabel, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useActionState, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { submitDonation } from "@/app/donate/actions";

import FormTerms from "./FormTerms";
import FormSuccess from "./FormSuccess";
import FormInputError from "./FormInputError";
import FormError from "./FormError";
import Header from "../ui/Header";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { ResponseProps } from "@/lib/definitions";
import FormKeyFormatGuide from "./FormKeyFormatGuide";

export default function FormDisplay({ platforms, platformTypes, regions }: { platforms: PlatformProps[]; platformTypes: PlatformTypeProps[]; regions: RegionProps[] }) {
	const { data } = useSession();
	const formRef = useRef<HTMLFormElement>(null);
	const [agreed, setAgreed] = useState<boolean>(false);
	const [activePlatformType, setActivePlatformType] = useState<PlatformTypes>("pc");
	const [activePlatform, setActivePlatform] = useState<PlatformProps>({ name: platforms[0]?.name, id: platforms[0]?.id });
	const [state, dispatch, isPending] = useActionState(submitDonation, null);
	const [formState, setFormState] = useState<ResponseProps | null>(null);

	const consolePlatforms = platforms.filter(platform => platform?.platformType?.name === "console");
	const pcPlatforms = platforms.filter(platform => platform?.platformType?.name === "pc");

	const cardSx: SxProps = { borderRadius: "1.25rem" };
	const radioGroupSx: SxProps = { mx: "auto", gap: 2, my: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 0fr))", justifyItems: "center", justifyContent: "center" };

	const getDefaultPlatform = (platformType: PlatformTypes) => {
		if (platformType === "pc") return pcPlatforms[0];
		else return consolePlatforms[0];
	};
	const updateAgreementState = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAgreed(e.target.checked);
	};
	const resetFormState = () => {
		if (formRef.current) formRef.current.reset();
		setAgreed(false);
		setActivePlatformType("pc");
		setActivePlatform({ name: platforms[0].name, id: platforms[0].id });
		setFormState(null);
	};

	useGSAP(() => {
		const tl = gsap.timeline();

		tl.set(".input-card > *, .title > *", { opacity: 0, filter: "blur(12px)" });
		tl.set(".input-card, .title > *", { opacity: 0, x: 100 });
		gsap.to(".input-card, .title > *", { opacity: 1, x: 0, duration: 1.4, stagger: 0.2, ease: "power2.out" });
		gsap.to(".input-card > *, .title > *", { opacity: 1, filter: "blur(0px)", duration: 1.1, delay: 0.1, ease: "power2.out", stagger: 0.2 });
	});

	useEffect(() => {
		setFormState(state);
	}, [state]);

	if (formState?.status === "error") return <FormError />;

	return platforms.length && platformTypes.length > 0 ? (
		formState?.status === "success" ? (
			<FormSuccess onClick={resetFormState} />
		) : (
			<form ref={formRef} action={dispatch}>
				<Stack rowGap={"column"} gap={2} sx={{ maxWidth: "sm", mx: "auto", my: 4 }}>
					<Header className="title" title="Donate a game key" description="Submission form for donating a game key to the community" />

					<input name="discordId" defaultValue={data?.user?.id} type="hidden"></input>
					{/* Platform Type Selection */}
					<Card className="input-card" size="lg" sx={{ ...cardSx }} variant="soft">
						<CardContent>
							<FormControl>
								<Typography className="label" level="title-sm">
									Select PC or Console
								</Typography>
								<RadioGroup orientation="horizontal" defaultValue={platformTypes[0].id} sx={{ gap: 2, my: 2, justifyContent: "center" }}>
									{platformTypes.map(type => (
										<Radio
											size="lg"
											color={"secondary"}
											variant={"outlined"}
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
											sx={{ textTransform: type.name === "console" ? "capitalize" : "uppercase", maxWidth: "fit-content" }}></Radio>
									))}
								</RadioGroup>
							</FormControl>
						</CardContent>
					</Card>

					{/* Platform Selection */}
					<Card className="input-card" size="lg" sx={{ ...cardSx }} variant="soft">
						<CardContent>
							<FormControl>
								<Typography className="label" level="title-sm">
									Select Platform
								</Typography>
								<Box component={"div"} sx={{ width: "100%" }}>
									<RadioGroup id={"platform"} orientation="horizontal" value={activePlatform.id} sx={{ ...radioGroupSx }}>
										{platforms.map(
											platform =>
												activePlatformType === platform?.platformType?.name && (
													<Radio
														size="lg"
														color={"secondary"}
														variant={"outlined"}
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
															mx: "auto",
															minWidth: "150px",
															textAlign: "center",
														}}></Radio>
												)
										)}
									</RadioGroup>
								</Box>
							</FormControl>
						</CardContent>
					</Card>

					{/* Region Selection */}
					<Card className="input-card" size="lg" sx={{ ...cardSx }} variant="soft">
						<CardContent>
							<FormControl>
								<FormLabel className="label">Select Region</FormLabel>
								<Box>
									<RadioGroup orientation="horizontal" defaultValue={regions[0].id} sx={{ ...radioGroupSx }}>
										{regions.map(region => (
											<Radio
												size="lg"
												color={"secondary"}
												variant={"outlined"}
												label={region.name}
												value={region.id}
												key={region.id}
												name="regionId"
												sx={{
													mx: "auto",
													minWidth: "150px",
													textAlign: "center",
													textTransform: "uppercase",
												}}></Radio>
										))}
									</RadioGroup>
								</Box>
							</FormControl>
						</CardContent>
					</Card>

					{/* Game Key Input */}
					<Card className="input-card" size="lg" sx={{ ...cardSx }} variant="soft">
						<CardContent>
							<FormControl>
								<FormLabel required className="label">
									Game Key
								</FormLabel>
								<Input required color="secondary" name={"key"} placeholder={`Enter your ${activePlatform.name} key here...`}></Input>
								{state?.errors && "key" in state?.errors && <FormInputError>{state.errors.key}</FormInputError>}
							</FormControl>
							<FormKeyFormatGuide platform={activePlatform.name} />
						</CardContent>
					</Card>

					{/* Submission */}
					<Card className="input-card" size="lg" sx={{ ...cardSx }} variant="soft" color="neutral">
						<CardContent>
							<FormTerms id={"terms"} />
						</CardContent>
						<CardActions>
							<Checkbox sx={{ mx: "auto", flex: 1 }} label={"I agree to these terms"} onChange={updateAgreementState}></Checkbox>
							<Button loading={isPending} sx={{ flex: 1 }} type="submit" size="lg" disabled={!agreed} color="primary">
								Submit donation
							</Button>
						</CardActions>
					</Card>
				</Stack>
			</form>
		)
	) : (
		<Card className="input-card" sx={{ maxWidth: "sm", mt: 5, mx: "auto" }}>
			<CardContent>
				<Typography level="title-md">Donations are currently unavailable.</Typography>
				<Typography level="title-sm" color="warning">
					Please contact the moderators or admins on the discord server.
				</Typography>
			</CardContent>
		</Card>
	);
}
