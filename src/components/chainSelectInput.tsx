"use clients";

import Image from "next/image";
import data from "../data/data.json";
import { useState } from "react";

export interface chainType {
  name: string;
  logo: string;
}

export default function ChainSelectInput({
  selectedChain,
  setSelectedChain,
}: {
  selectedChain: chainType;
  setSelectedChain: (chain: chainType) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => {
        setOpen(!open);
      }}
    >
      <div className="flex items-center justify-center gap-[5px]">
        <Image src={selectedChain.logo} width={20} height={20} alt={selectedChain.name} />
        <p className="text-[12px] leading-[15px]">{selectedChain.name}</p>
        <span className="block h-[16px] w-[16px] bg-[url('/images/icons/downarrow-icon.svg')] bg-contain bg-center bg-no-repeat" />
      </div>
      {open && (
        <div className="absolute left-[-10px] right-[-10px] top-[calc(100%+10px)] z-10 flex h-fit flex-col gap-[10px] rounded-[10px] bg-white p-[10px] shadow-lg">
          {data.chains.map((item: chainType) => (
            <div key={item.name} className="flex items-center gap-[5px]" onClick={() => setSelectedChain(item)}>
              <Image src={item.logo} width={20} height={20} alt={item.name} />
              <p className="text-[12px] leading-[15px]">{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
