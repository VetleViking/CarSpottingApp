import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>FaFD</h1>
      <Link href="/makes">
        Makes
      </Link>
    </div>
  );
}
