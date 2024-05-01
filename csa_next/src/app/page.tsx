import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="mt-8">
        <Link href="/myspots" className="text-white p-4 bg-gray-700 rounded-lg m-4">
          My Spots
        </Link>
        <Link href="/makes" className="text-white p-4 bg-gray-700 rounded-lg m-4">
          Makes
        </Link>
      </div>
    </div>
  );
}
