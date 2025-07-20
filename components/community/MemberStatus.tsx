"use client";

import { Chip, Skeleton, Stack, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
export default function MemberStatus() {
	const { data, status } = useSession();
	if (status === "loading") return <Skeleton variant="inline" animation={"wave"} width={100} height={15}></Skeleton>;

	if (data) {
		return (
			<Chip color={`${data.isMemberOfGuild ? "success" : "danger"}`} variant="outlined" sx={{ mx: "auto" }}>
				<Stack direction={"row"} gap={2} sx={{ alignItems: "center" }}>
					<Typography level="title-sm" endDecorator={data.isMemberOfGuild ? <Check /> : <Close />}>
						Membership Status:{" "}
					</Typography>
				</Stack>
			</Chip>
		);
	} else return null;
}
