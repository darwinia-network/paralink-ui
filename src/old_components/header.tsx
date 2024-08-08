import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="app-header fixed left-0 top-0 w-full">
      <div className="container mx-auto flex h-full items-center justify-between px-middle">
        <Link href="/">
          <Image width={156} height={18} alt="Logo" src="/images/logo.png" />
        </Link>
      </div>
    </div>
  );
}
