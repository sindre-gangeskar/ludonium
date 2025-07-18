import { Typography, List, ListItem, Box } from "@mui/joy";
import { ColorPaletteProp } from "@mui/joy";
export default function FormTerms({ className, id }: { className?: string; id?: string }) {
	const termAgreementColor: ColorPaletteProp = "neutral";

	return (
		<Box id={id} className={className}>
			<Typography color="primary" level="title-lg" variant="plain" p={2}>
				Please read the terms underneath <strong>thoroughly</strong> before submitting your key.
			</Typography>
			<List marker="disc">
				<ListItem>
					<Typography level="title-md" color={termAgreementColor}>
						You agree to forfeit all ownership of the game key you are donating upon submission.
					</Typography>
				</ListItem>
				<ListItem>
					<Typography level="title-md" color={termAgreementColor}>
						You acknowledge that the game key has <strong>not</strong> been redeemed, <strong>is valid</strong> and that you do not intend to reedem it in the future after submission.
					</Typography>
				</ListItem>
				<ListItem>
					<Typography level="title-md" color={termAgreementColor}>
						You agree to allow the system to store your <strong>Discord ID</strong> in order to keep track of the donations made by you.
					</Typography>
				</ListItem>
			</List>
		</Box>
	);
}
