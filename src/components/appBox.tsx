"use client";

import { useCallback, useState } from "react";
import data from "../data/data.json";
import Image from "next/image";
import ChainSelectInput, { chainType } from "./chainSelectInput";
import SuccessModal from "./successModal";
import PendingModal from "./pendingModal";

export default function AppBox() {
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [senderSelectedChain, setSenderSelectedChain] = useState<chainType>(data.chains[0]);
  const [recipientSelectedChain, setRecipientSelectedChain] = useState<chainType>(data.chains[0]);
  const [senderAddress, setSenderAddress] = useState<string>("14WfAfDX24cU8StvAGgPnBqGZyJ3gFcPFHh39rQouzvTy4Fj");
  const [recipientAddress, setRecipientAddress] = useState<string>("14WfAfDX24cU8StvAGgPnBqGZyJ3gFcPFHh39rQouzvTy4Fj");
  const [amount, setAmount] = useState<string>("0");
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [pendingModal, setPendingModal] = useState<boolean>(false);

  const handleCloseSuccessModal = useCallback(() => {
    setSuccessModal(false);
  }, []);

  const handleClosePendingModal = useCallback(() => {
    setPendingModal(false);
  }, []);

  return (
    <section className="flex h-[509px] w-[400px] flex-col gap-[20px] rounded-[20px] bg-white p-[20px]">
      <div className="flex h-[95px] flex-col gap-[10px] rounded-[10px] bg-[#F2F3F5] p-[20px]">
        <div>
          <p className="text-[12px] leading-[15.22px] text-[#12161980]">Token</p>
        </div>
        <div className="flex items-center gap-[10px]">
          {data.tokens.map((item: any) => (
            <div
              className="flex items-center gap-[10px]"
              key={item.name}
              onClick={() => {
                setSelectedToken(item.name);
              }}
            >
              <Image src={item.icon} width={30} height={30} alt="item.name" />
              {selectedToken === item.name && <p className="text-[18px] font-[700] leading-[23px]">{item.name}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-[95px] flex-col gap-[10px] rounded-[10px] bg-[#F2F3F5] p-[10px]">
        <div className="flex items-center justify-between">
          <p className="text-[12px] leading-[15.22px] text-[#12161980]">Sender</p>
          <ChainSelectInput selectedChain={senderSelectedChain} setSelectedChain={setSenderSelectedChain} />
        </div>
        <input
          type="text"
          value={senderAddress}
          onChange={(e) => {
            setSenderAddress(e.target.value);
          }}
          className="h-[24px] text-ellipsis whitespace-nowrap border-none bg-transparent text-[14px] font-[700] leading-[24px] outline-none"
        />
      </div>
      <div className="flex h-[95px] flex-col gap-[10px] rounded-[10px] bg-[#F2F3F5] p-[10px]">
        <div className="flex items-center justify-between">
          <p className="text-[12px] leading-[15.22px] text-[#12161980]">Recipient</p>
          <ChainSelectInput selectedChain={recipientSelectedChain} setSelectedChain={setRecipientSelectedChain} />
        </div>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => {
            setRecipientAddress(e.target.value);
          }}
          className="h-[24px] text-ellipsis whitespace-nowrap border-none bg-transparent text-[14px] font-[700] leading-[24px] outline-none"
        />
      </div>
      <div>
        <div className="flex h-[95px] flex-col gap-[10px] rounded-[10px] bg-[#F2F3F5] p-[10px]">
          <div>
            <p className="text-[12px] leading-[15.22px] text-[#12161980]">Amount</p>
          </div>
          <div className="flex items-center justify-center gap-[10px]">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="h-[24px] flex-grow text-ellipsis whitespace-nowrap border-none bg-transparent text-[14px] font-[700] leading-[24px] outline-none"
            />
            <button className="h-[26px] w-fit flex-shrink-0 rounded-[5px] bg-[#FF00831A] px-[15px] text-[12px] font-bold text-[#FF0083]">
              Max
            </button>
          </div>
        </div>
        <p className="mt-[5px] text-[12px] leading-[15px] text-[#12161980]">Balance: 994,744.238 USDT</p>
      </div>
      <button className="h-[34px] flex-shrink-0 rounded-[10px] bg-[#FF0083] text-[14px] leading-[24px] text-white">
        Send
      </button>
      <SuccessModal visible={successModal} onClose={handleCloseSuccessModal} />
      <PendingModal visible={pendingModal} onClose={handleClosePendingModal} />
    </section>
  );
}
