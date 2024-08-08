import Image from "next/image";
import { PropsWithChildren } from "react";

export default function Footer() {
  return (
    <div className="app-footer">
      <div className="container mx-auto flex h-full items-center justify-between px-middle">
        <span className="text-sm font-light text-white/50">{`© ${new Date().getFullYear()} Darwinia Network`}</span>
        <div className="flex shrink-0 items-center gap-5">
          <SocialLink href="https://github.com/darwinia-network">
            <Image width={18} height={18} alt="Github" src="/images/social/github.svg" />
          </SocialLink>
          <SocialLink href="https://twitter.com/DarwiniaNetwork">
            <Image width={18} height={18} alt="Twitter" src="/images/social/twitter.svg" />
          </SocialLink>
          <SocialLink href="https://discord.com/invite/VcYFYETrw5">
            <Image width={20} height={20} alt="Discord" src="/images/social/discord.svg" />
          </SocialLink>
          <SocialLink href="mailto:hello@darwinia.network">
            <Image width={18} height={18} alt="Email" src="/images/social/email.svg" />
          </SocialLink>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ children, href }: PropsWithChildren<{ href: string }>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="opacity-60 transition hover:scale-105 hover:opacity-100 active:scale-95"
    >
      {children}
    </a>
  );
}
