"use client";
import { Typography, Stack, Avatar, Box } from "@mui/joy";
import Header from "../ui/Header";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import JoinServer from "./JoinServer";
import useDiscord from "@/hooks/useDiscord";
import { useSession } from "next-auth/react";

export default function ServerDisplay() {
	const { data: discordData } = useDiscord();
	const { data: sessionData } = useSession();
	useGSAP(() => {
		gsap.set("#content > *, #sub-content *", { opacity: 0, x: -150, filter: "blur(16px)" });
		gsap.to("#content > *, #sub-content *", { opacity: 1, x: 0, duration: 1.5, stagger: 0.2, filter: "blur(0px)", ease: "power4.out" });
	}, []);

	return (
		<Stack id="content" maxWidth={"lg"} mt={5} sx={{ mx: "auto" }}>
			<Header title={discordData?.name ?? "N/A"} />
			<Stack gap={3} direction={"column"} width={"fit-content"} sx={{ mx: "auto", alignItems: "center" }}>
				<Avatar sx={{ width: 120, height: 120, aspectRatio: 1 / 1, mx: "auto" }} size="lg" src={discordData?.iconURL ?? ""}></Avatar>
				{!sessionData?.isMemberOfGuild && status === "authenticated" && <JoinServer />}
			</Stack>
			<Stack maxWidth={"sm"} mx={"auto"} mt={5}>
				<Box id="sub-content">
					<Typography level="h2" color="secondary">
						Guild Description
					</Typography>
					<Typography level="title-md">{discordData?.description ?? "N/A"}</Typography>
				</Box>
			</Stack>
		</Stack>
	);
}
