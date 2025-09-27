"use client";

import { get_makes, get_spotted_makes } from "@/api/cars";
import LoadingAnimation from "@/components/LoadingAnim";
import ListComponent from "@/components/ListComponent";
import SearchReg from "@/components/SearchReg";
import { useEffect, useState } from "react";
import AddNew from "@/components/AddNew";
import Header from "@/components/Header";
import Search from "@/components/Search";
import Link from "next/link";

interface MakesClientProps {
	altUsername: string;
	username?: string;
}

const MakesClient = ({ altUsername, username }: MakesClientProps) => {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<{ name: string }[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const data = username
				? await get_spotted_makes(search, username)
				: await get_makes(search);
			data.sort((a: string, b: string) => a.localeCompare(b));
			setData(data);
			setLoading(false);
		};

		fetchData();
	}, [search, username]);

	return (
		<div>
			<Header username={altUsername} />
			<p className="text-center text-white text-3xl my-4">Select the make</p>
			<Search search={search} setSearch={setSearch} />
			<div className="flex gap-2 mx-1 mb-4 flex-wrap md:flex-nowrap">
				<div className="bg-black border border-[#9ca3af] cursor-pointer w-full">
					<Link
						href={`/makes/selected?make=unknown${
							username ? `&username=${username}` : ""
						}`}
					>
						<p className="text-[#9ca3af] font-ListComponent px-1 py-2 text-nowrap">
							Don&apos;t know
						</p>
					</Link>
				</div>
				{!username && <AddNew type="make" />}
				{!username && <SearchReg />}
			</div>
			{Array.isArray(data) && data.length > 0 ? (
				data.map((item: any, id) => (
					<div key={id}>
						<Link
							href={
								username
									? `/makes/selected?make=${item}&username=${username}`
									: `/makes/selected?make=${item}`
							}
						>
							<ListComponent title={item} />
						</Link>
					</div>
				))
			) : loading ? (
				<LoadingAnimation text="Loading" />
			) : (
				<p className="text-white font-ListComponent px-1 text-nowrap text-center">
					No makes found.
				</p>
			)}
		</div>
	);
};

export default MakesClient;
