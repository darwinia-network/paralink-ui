import Image from "next/image";

export default function SuccessModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <>
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 top-0 h-[100vh] w-[100vw]">
          <div className="relative flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="flex h-[400px] w-[400px] flex-col items-center justify-center gap-[20px] rounded-[20px] bg-white p-[21px]">
              <Image src={"/images/icons/success-icon.svg"} width={80} height={80} alt="Darwinia Paralink" />
              <div className="flex flex-col items-center gap-[10px]">
                <p className="text-[18px] font-bold leading-[23px] text-[#121619]">Success !</p>
                <p className="text-[14px] leading-[24px] text-[#121619]">You send 1,888 USDT</p>
              </div>
              <div className="flex w-full flex-col items-center gap-[10px]">
                <button className="h-[34px] w-full rounded-[10px] bg-[#FF0083] text-[14px] font-bold text-white">
                  OK
                </button>
                <button className="h-[34px] w-full rounded-[10px] bg-[#FF00831A] text-[14px] font-bold text-[#FF0083]">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
