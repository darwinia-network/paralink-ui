export default function WalletSelectionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <>
      {visible && (
        <div className="fixed left-0 top-0 h-[100vw] w-[100vw]">
          <div className="flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.1)]">
            <div className="flex h-[300px] w-[400px] rounded-[20px] bg-white p-[20px]"></div>
          </div>
        </div>
      )}
    </>
  );
}
