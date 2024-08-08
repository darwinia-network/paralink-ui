import Tooltip from "@/ui/tooltip";
import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

export default function SwitchCross({ disabled, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className="relative h-[1px]">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex w-full items-center justify-center">
        <Tooltip content="This cross-chain is currently unavailable" disabled={!disabled} className="shrink-0">
          <button
            className="shrink-0 transition hover:scale-105 hover:opacity-80 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-100"
            disabled={disabled}
            {...rest}
          >
            <Image width={36} height={36} alt="Switch cross" src="/images/switch-cross.svg" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
