import Link from "next/link";
import data from "../data/data.json";
export default function Footer() {
  return (
    <section className="flex h-[35px] w-full items-center justify-center px-[30px] lg:h-[56px] lg:justify-between">
      <p className="text-[12px] leading-[15px] text-[#12161980]">@ 2024 Paralink powerd by Darwinia Network</p>
      <div className="hidden items-center justify-center gap-[10px] lg:flex">
        {data.social.map((item: any) => (
          <Link key={item.name} href={item.url}>
            <span
              className="block h-[24px] w-[24px] bg-contain bg-center bg-no-repeat"
              style={{ background: `url(${item.icon})` }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
