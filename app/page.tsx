import Login from "@/components/auth/Login";
import DonateForm from "@/components/donation/DonateForm";
import Hero from "@/components/home/Hero";
export default function Home() {
	return (
		<>
			<Hero/>
			<Login />
			<DonateForm/>
		</>
	);
}
