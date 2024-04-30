import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/makes" className="text-white">
        Makes
      </Link>
    </div>
  );
}
