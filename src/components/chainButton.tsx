import { useCallback, useState } from "react";
import data from "../data/data.json";
import Image from "next/image";

export default function ChainButton() {
  const [subMenu, setSubMenu] = useState<boolean>(false);
  const handleToggleSubMenu = useCallback(() => {
    setSubMenu((prev) => !prev);
  }, []);
  return (
    <div className="relative">
      <div
        className="flex h-[36px] w-fit cursor-pointer items-center justify-center gap-[5px] rounded-[10px] bg-white px-[10px] duration-300 hover:shadow-lg"
        onClick={handleToggleSubMenu}
      >
        <span className="block h-[24px] w-[24px] bg-[url('/images/icons/assethub-icon.svg')] bg-contain bg-center bg-no-repeat" />
        <span className="block h-[16px] w-[16px] bg-[url('/images/icons/downarrow-icon.svg')] bg-contain bg-center bg-no-repeat" />
      </div>
      {subMenu && (
        <div className="absolute right-[-21px] top-[calc(100%+20px)] flex w-[151px] flex-col gap-[20px] rounded-[10px] bg-white p-[20px]">
          {data.chains.map((chain) => (
            <div key={chain.name} className="flex items-center gap-[10px]">
              <Image src={chain.logo} width={24} height={24} alt={chain.name} />
              <div className="flex flex-col ">
                <p className="text-[14px] leading-[24px] text-[#121619]">{chain.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
