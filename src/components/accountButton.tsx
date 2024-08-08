import DisconnectButton from "./disconnetButton";
import data from "../data/data.json";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function AccountButton() {
  const [subMenu, setSubMenu] = useState(false);
  const handleToggleSubMenu = useCallback(() => {
    console.log("hello2");
    setSubMenu((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <div
        onClick={handleToggleSubMenu}
        className="relative flex h-[36px] w-fit cursor-pointer items-center justify-center gap-[5px] rounded-[10px] bg-white px-[10px] duration-300 hover:shadow-lg"
      >
        <span className="block h-[24px] w-[24px] bg-[url('/images/icons/assethub-icon.svg')] bg-contain bg-center bg-no-repeat" />
        <p className="text-[14px] leading-[24px]">14WfA...Ty4Fj</p>
        <span className="block h-[16px] w-[16px] bg-[url('/images/icons/downarrow-icon.svg')] bg-contain bg-center bg-no-repeat" />
      </div>
      {subMenu && (
        <div className="absolute right-[-21px] top-[calc(100%+20px)] flex w-[290px] flex-col gap-[20px] rounded-[10px] bg-white p-[20px]">
          <div className="flex items-center gap-[10px]">
            <span className="block h-[30px] w-[30px] bg-[url('/images/icons/assethub-icon.svg')] bg-contain bg-center bg-no-repeat" />
            <p className="text-[16px] font-bold leading-[24px]">14WfA...Ty4Fj</p>
            <span className="block h-[18px] w-[18px] bg-[url('/images/icons/copy-icon.svg')] bg-contain bg-center bg-no-repeat" />
          </div>
          <DisconnectButton />
          <span className="block h-[1px] w-full bg-[#1216191A]" />
          {data.tokens.map((token) => (
            <div key={token.name} className="flex items-center gap-[10px]">
              <Image src={token.icon} width={30} height={30} alt={token.name} />
              <div className="flex flex-col ">
                <p className="text-[16px] leading-[21px] text-[#121619]">{token.balance}</p>
                <p className="text-[12px] leading-[16px] text-[#12161980]">{token.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
