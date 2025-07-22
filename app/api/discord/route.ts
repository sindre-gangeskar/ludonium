import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const {data: { data }} = await axios.get("http://localhost:3001/get-guild-info", { headers: { "Content-Type": "application/json" } });
		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		throw error;
	}
}
