"use client";

import { Stack, Card, CardContent, Typography, Button, Box, ButtonProps } from "@mui/joy";
import Header from "../ui/Header";
import StatCard from "./StatCard";
import { useActionState } from "react";
import { createConsoleGiveaway, createPCGiveaway } from "@/app/admin/dashboard/actions";
import { ComputerRounded, VideogameAssetRounded } from "@mui/icons-material";
import StateMessage from "../ui/StateMessage";
export default function DashboardDisplay({ count: { pc, console } }: { count: { pc: number; console: number } }) {
	const [pcState, pcDispatch, pcLoading] = useActionState(createPCGiveaway, null);
	const [consoleState, consoleDispatch, consoleLoading] = useActionState(createConsoleGiveaway, null);

	const buttonProps: ButtonProps = { variant: "plain", fullWidth: true, size: "lg", type: "submit" };
	return (
		<Stack maxWidth={"md"} mx={"auto"}>
			<Header title="Giveaway Management" description="Manage donations and giveaways"></Header>

			<Card variant={"outlined"}>
				<CardContent sx={{ gap: 6 }}>
					<Typography level="title-lg" textAlign={"center"}>
						Stats
					</Typography>
					<Stack direction={"row"} gap={2} mx={"auto"} sx={{ width: "100%", justifyContent: "space-evenly" }}>
						<StatCard count={pc} title="PC" color="success" />
						<StatCard count={console} title="Console" color="primary" />
					</Stack>
					<Stack>
						<Stack direction={"row"} sx={{ mx: "auto", justifyContent: "space-evenly", width: "100%", gap: 3 }}>
							<Box component={"form"} action={pcDispatch}>
								<Button {...buttonProps} disabled={pcLoading || pc == 0} startDecorator={<ComputerRounded />} loading={pcLoading}>
									Start PC Game Giveaway
								</Button>
								<StateMessage state={pcState} errorKey="pc" prioritize={["success"]} />
							</Box>

							<Box component={"form"} action={consoleDispatch}>
								<Button {...buttonProps} disabled={consoleLoading || console == 0} startDecorator={<VideogameAssetRounded />} loading={consoleLoading}>
									Start Console Game Giveaway
								</Button>
								<StateMessage state={consoleState} errorKey="console" prioritize={["success"]} />
							</Box>
						</Stack>
						<StateMessage state={pcState} errorKey="pc" prioritize={["fail", "error"]} />
						<StateMessage state={consoleState} errorKey="console" prioritize={["fail", "error"]} />
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}
