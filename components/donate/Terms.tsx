import { Typography, List, ListItem } from "@mui/joy";
import { ColorPaletteProp } from "@mui/joy";
export default function Terms() {
	const termAgreementColor: ColorPaletteProp = "danger";

	return (
		<>
			<Typography color="warning" level="title-md" variant="solid" p={2}>
				Please read the terms underneath <strong>thoroughly</strong> before submitting your key.
			</Typography>
			<List marker="disc">
				<ListItem>
					<Typography level="title-sm" color={termAgreementColor}>
						You agree to forfeit all ownership of the game key you are donating upon submission.
					</Typography>
				</ListItem>
				<ListItem>
					<Typography level="title-sm" color={termAgreementColor}>
						You acknowledge that the game key has <strong>not</strong> been redeemed, <strong>is valid</strong> and that you do not intend to reedem it in the future after submission.
					</Typography>
				</ListItem>
				<ListItem>
					<Typography color={termAgreementColor} level="title-sm">
						You agree to allow the system to store your Discord ID in order to keep track of the donations made by you.
					</Typography>
				</ListItem>
			</List>
		</>
	);
}
