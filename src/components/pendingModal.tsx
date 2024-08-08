import Image from "next/image";

export default function PendingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <>
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 top-0 h-[100vh] w-[100vw]">
          <div className="relative flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="flex h-[400px] w-[400px] flex-col items-center justify-center gap-[20px] rounded-[20px] bg-white p-[21px]">
              <Image src={"/images/icons/pending-icon.svg"} width={64} height={80} alt="Darwinia Paralink" />
              <p className="text-[18px] font-bold leading-[23px] text-[#121619]">Transaction is being Processing</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
