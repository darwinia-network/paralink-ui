"use client";

import { useTalisman, useToggle, useTransfer } from "@/hooks";
import { WalletID } from "@/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MouseEventHandler, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import AddressIdenticon from "./address-identicon";
import { toShortAdrress } from "@/utils";
import Tooltip from "@/ui/tooltip";

const Modal = dynamic(() => import("@/ui/modal"), { ssr: false });

interface Props {
  who: "sender" | "recipient";
  kind?: "component" | "primary";
  height?: "full" | "padding";
}

export default function ConnectWallet({ who, kind = "component", height = "padding" }: Props) {
  const { state: isOpen, setTrue: setIsOpenTrue, setFalse: setIsOpenFalse } = useToggle(false);
  const {
    sender,
    sourceChain,
    targetChain,
    activeSenderWallet,
    activeRecipientWallet,
    setSender,
    setActiveSenderAccount,
    setActiveRecipientAccount,
    setActiveSenderWallet,
    setActiveRecipientWallet,
  } = useTransfer();
  const { talismanAccounts, connectTalisman } = useTalisman();
  const { openConnectModal } = useConnectModal();
  const { address: activeAddress } = useAccount();

  const [supported, activeWallet, clearValue, setActiveAccount, setActiveWallet] = useMemo(
    () => [
      who === "sender" ? sourceChain.wallets : targetChain.wallets,
      who === "sender" ? activeSenderWallet : activeRecipientWallet,
      who === "sender" ? setSender : () => undefined,
      who === "sender" ? setActiveSenderAccount : setActiveRecipientAccount,
      who === "sender" ? setActiveSenderWallet : setActiveRecipientWallet,
    ],
    [
      who,
      sourceChain,
      targetChain,
      activeSenderWallet,
      activeRecipientWallet,
      setSender,
      setActiveSenderAccount,
      setActiveRecipientAccount,
      setActiveSenderWallet,
      setActiveRecipientWallet,
    ],
  );

  const handleConnect = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.stopPropagation();
      setIsOpenTrue();
    },
    [setIsOpenTrue],
  );

  const handleDisconnect = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.stopPropagation();
      clearValue(undefined);
      setActiveWallet(undefined);
      setActiveAccount(undefined);
    },
    [clearValue, setActiveWallet, setActiveAccount],
  );

  const [supportedWalletEvm, supportedWalletTalisman] = useMemo(() => {
    return [supported.some((id) => id === WalletID.EVM), supported.some((id) => id === WalletID.TALISMAN)];
  }, [supported]);

  useEffect(() => {
    if (!supported.some((id) => id === WalletID.TALISMAN) && activeWallet === WalletID.TALISMAN) {
      setActiveWallet(undefined);
      clearValue(undefined);
    } else if (!supported.some((id) => id === WalletID.EVM) && activeWallet === WalletID.EVM) {
      setActiveWallet(undefined);
      clearValue(undefined);
    }
  }, [supported, activeWallet, clearValue, setActiveWallet]);

  const walletIcon = kind === "primary" ? null : activeWallet === WalletID.EVM ? "evm.png" : "talisman-red.svg";

  // Major for page header
  if (kind === "primary" && sender?.address) {
    return (
      <Button disabled>
        <AddressIdenticon size={22} address={sender.address} />
        <span className="truncate">{toShortAdrress(sender.address)}</span>
      </Button>
    );
  }

  return (talismanAccounts.length || activeAddress) && activeWallet ? (
    <Button onClick={handleDisconnect} kind={kind} height={height}>
      {walletIcon && (
        <Image width={16} height={16} alt="Wallet" src={`/images/wallet/${walletIcon}`} className="rounded-full" />
      )}
      <span>Disconnect</span>
    </Button>
  ) : (
    <>
      <Button onClick={handleConnect} kind={kind} height={height}>
        <span>Connect wallet</span>
      </Button>
      <Modal
        title={who === "sender" ? "Sender wallets" : "Recipient wallets"}
        isOpen={isOpen}
        onClose={setIsOpenFalse}
        className="w-full lg:w-[24rem]"
      >
        <div className="flex flex-col">
          <Item
            who={who}
            icon="talisman-red.svg"
            name="Talisman"
            onClick={() => {
              setActiveWallet(WalletID.TALISMAN);
              connectTalisman();
              setIsOpenFalse();
            }}
            disabled={!supportedWalletTalisman}
          />
          <Item
            who={who}
            icon="evm.png"
            name="EVM wallets"
            onClick={() => {
              setActiveWallet(WalletID.EVM);
              openConnectModal?.();
              setIsOpenFalse();
            }}
            disabled={!supportedWalletEvm}
          />
        </div>
      </Modal>
    </>
  );
}

function Button({
  kind,
  height,
  disabled,
  children,
  onClick,
}: PropsWithChildren<
  Pick<Props, "kind" | "height"> & {
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }
>) {
  return (
    <button
      onClick={onClick}
      className={`border-radius flex shrink-0 items-center gap-small border px-middle transition-[transform,color] hover:opacity-80 active:translate-y-1 disabled:translate-y-0 disabled:opacity-100 ${
        kind === "component" ? "border-component bg-component" : "border-primary bg-primary"
      } ${height === "full" ? "h-full" : "py-small"}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Item({
  who,
  icon,
  name,
  disabled,
  onClick,
}: {
  icon: string;
  name: string;
  who: "sender" | "recipient";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { sourceChain, targetChain } = useTransfer();
  const chain = who === "sender" ? sourceChain : targetChain;
  return (
    <Tooltip content={`Unavailable for ${chain.name}`} className="w-full" disabled={!disabled}>
      <button
        className="border-radius flex w-full items-center gap-middle bg-transparent p-middle transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={onClick}
      >
        <Image width={20} height={20} alt="Wallet icon" src={`/images/wallet/${icon}`} className="rounded-full" />
        <span>{name}</span>
      </button>
    </Tooltip>
  );
}
