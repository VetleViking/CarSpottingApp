import Link from "next/link";

export default function MySpots() {
  return (
    <div>
        <div className="text-white text-center">My Spots</div>
        <div className="text-white">Coming soon</div>  
        <Link href="/" className="text-white">
            Back
        </Link>
    </div>
  );
}
