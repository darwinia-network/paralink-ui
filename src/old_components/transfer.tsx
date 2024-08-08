"use client";

import Button from "@/ui/button";
import BalanceInput from "./balance-input";
import ChainSelect from "./chain-select";
import TransferSection from "./transfer-section";
import { formatBalance, isExceedingCrossChainLimit, parseCross } from "@/utils";
import { useTalisman, useTransfer } from "@/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SwitchCross from "./switch-cross";
import AddressInput from "./address-input";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Asset, ChainConfig, WalletID } from "@/types";
import { BN_ZERO } from "@polkadot/util";
import notification from "@/ui/notification";
import Image from "next/image";

const {
  defaultSourceChainOptions,
  defaultTargetChainOptions,
  defaultSourceAssetOptions,
  availableSourceAssetOptions,
  availableTargetChainOptions,
  availableTargetAssetOptions,
} = parseCross();

export default function Transfer() {
  const {
    sourceApi,
    targetApi,
    assetLimitOnTargetChain,
    targetAssetSupply,
    sender,
    recipient,
    sourceChain,
    targetChain,
    sourceAsset,
    targetAsset,
    feeBalanceOnSourceChain,
    existentialDepositOnTargetChain,
    sourceAssetBalance,
    targetAssetBalance,
    sourceNativeBalance,
    targetNativeBalance,
    transferAmount,
    bridgeInstance,
    activeSenderAccount,
    activeSenderWallet,
    activeRecipientWallet,
    setSender,
    setRecipient,
    setActiveSenderAccount,
    setActiveRecipientAccount,
    setSourceChain,
    setTargetChain,
    setSourceAsset,
    setTargetAsset,
    setTransferAmount,
    transfer,
    updateSourceAssetBalance,
    updateTargetAssetBalance,
    updateTargetAssetSupply,
    updateSourceNativeBalance,
    updateTargetNativeBalance,
    updateFeeBalanceOnSourceChain,
  } = useTransfer();
  const [sourceChainOptions, _setSourceChainOptions] = useState(defaultSourceChainOptions);
  const [targetChainOptions, setTargetChainOptions] = useState(defaultTargetChainOptions);
  const [sourceAssetOptions, setSourceAssetOptions] = useState(defaultSourceAssetOptions);
  const [busy, setBusy] = useState(false);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { talismanAccounts } = useTalisman();
  const { address } = useAccount();

  const canSwitch = useMemo(() => {
    const length =
      availableTargetAssetOptions[targetChain.network]?.[targetAsset.symbol]?.[sourceChain.network]?.length;
    return !!length;
  }, [sourceChain, targetChain, targetAsset]);

  const needSwitchNetwork = useMemo(
    () => activeSenderWallet === WalletID.EVM && chain && chain.id !== sourceChain.id,
    [chain, sourceChain, activeSenderWallet],
  );

  const sourceChainRef = useRef(sourceChain);
  const targetChainRef = useRef(targetChain);
  const sourceAssetRef = useRef(sourceAsset);
  const targetAssetRef = useRef(targetAsset);

  const feeAlert = useMemo(() => {
    const fee = bridgeInstance?.getCrossInfo()?.fee;
    if (fee && feeBalanceOnSourceChain && fee.amount.gt(feeBalanceOnSourceChain.amount)) {
      return (
        <div className="flex items-start justify-center gap-small">
          <Image alt="Warning" width={15} height={15} src="/images/warning.svg" />
          <span className="text-xs text-alert">{`You need at least ${formatBalance(
            fee.amount,
            feeBalanceOnSourceChain.currency.decimals,
          )} ${feeBalanceOnSourceChain.currency.symbol} in your Sender on ${
            sourceChainRef.current.name
          } to cover cross-chain fees.`}</span>
        </div>
      );
    }
    return null;
  }, [bridgeInstance, feeBalanceOnSourceChain]);
  const existentialAlertOnSourceChain = useMemo(() => {
    if (
      sourceChain.existential &&
      sourceNativeBalance &&
      sourceNativeBalance.amount.lt(sourceChain.existential.minBalance)
    ) {
      return (
        <div className="flex items-start justify-center gap-small">
          <Image alt="Warning" width={15} height={15} src="/images/warning.svg" />
          <span className="text-xs text-alert">{`You need at least ${formatBalance(
            sourceChain.existential.minBalance,
            sourceChain.nativeCurrency.decimals,
          )} ${sourceChain.nativeCurrency.symbol} in your Sender on ${
            sourceChain.name
          } to keep an account alive.`}</span>
        </div>
      );
    }
    return null;
  }, [
    sourceChain.existential,
    sourceChain.name,
    sourceChain.nativeCurrency.decimals,
    sourceChain.nativeCurrency.symbol,
    sourceNativeBalance,
  ]);
  const existentialAlertOnTargetChain = useMemo(() => {
    if (
      targetNativeBalance &&
      existentialDepositOnTargetChain &&
      targetNativeBalance.amount.lt(existentialDepositOnTargetChain.amount)
    ) {
      return (
        <div className="flex items-start justify-center gap-small">
          <Image alt="Warning" width={15} height={15} src="/images/warning.svg" />
          <span className="text-xs text-alert">{`You need at least ${formatBalance(
            existentialDepositOnTargetChain.amount,
            existentialDepositOnTargetChain.currency.decimals,
          )} ${existentialDepositOnTargetChain.currency.symbol} in your Recipient on ${
            targetChainRef.current.name
          } to keep an account open.`}</span>
        </div>
      );
    }
    return null;
  }, [targetNativeBalance, existentialDepositOnTargetChain]);

  const _setSourceChain = useCallback(
    (chain: ChainConfig | undefined) => {
      setSourceChain((prev) => chain ?? prev);
      sourceChainRef.current = chain ?? sourceChainRef.current;
    },
    [setSourceChain],
  );

  const _setTargetChain = useCallback(
    (chain: ChainConfig | undefined) => {
      setTargetChain((prev) => chain ?? prev);
      targetChainRef.current = chain ?? targetChainRef.current;
    },
    [setTargetChain],
  );

  const _setSourceAsset = useCallback(
    (asset: Asset | undefined) => {
      setSourceAsset((prev) => asset ?? prev);
      sourceAssetRef.current = asset ?? sourceAssetRef.current;
    },
    [setSourceAsset],
  );

  const _setTargetAsset = useCallback(
    (asset: Asset | undefined) => {
      setTargetAsset((prev) => asset ?? prev);
      targetAssetRef.current = asset ?? targetAssetRef.current;
    },
    [setTargetAsset],
  );

  const handleSwitch = useCallback(() => {
    setSourceChain(targetChainRef.current);
    setTargetChain(sourceChainRef.current);
    setSourceAsset(targetAssetRef.current);
    setTargetAsset(sourceAssetRef.current);

    const c = sourceChainRef.current;
    sourceChainRef.current = targetChainRef.current;
    targetChainRef.current = c;

    const a = sourceAssetRef.current;
    sourceAssetRef.current = targetAssetRef.current;
    targetAssetRef.current = a;
  }, [setSourceChain, setTargetChain, setSourceAsset, setTargetAsset]);

  const handleSend = useCallback(async () => {
    if (needSwitchNetwork) {
      switchNetwork?.(sourceChain.id);
    } else if (bridgeInstance && recipient) {
      const callback = {
        successCb: () => {
          setBusy(false);
          setTransferAmount({ valid: true, input: "", amount: BN_ZERO });
          updateSourceAssetBalance();
          updateTargetAssetBalance();
          updateTargetAssetSupply();
          updateSourceNativeBalance();
          updateTargetNativeBalance();
          updateFeeBalanceOnSourceChain();
        },
        failedCb: () => {
          setBusy(false);
        },
      };
      const sender_ = activeSenderAccount ?? (address && sender?.address === address ? address : undefined);
      setBusy(true);
      if (await isExceedingCrossChainLimit(bridgeInstance, transferAmount.input)) {
        notification.error({ title: "Transaction failed", description: "Exceeding the cross-chain limit." });
        updateTargetAssetSupply();
        setBusy(false);
      } else if (sender_) {
        await transfer(bridgeInstance, sender_, recipient.address, transferAmount.amount, callback);
      }
    } else {
      notification.warn({ title: "Oops!", description: "Failed to construct bridge." });
    }
  }, [
    activeSenderAccount,
    address,
    bridgeInstance,
    needSwitchNetwork,
    recipient,
    sender?.address,
    setTransferAmount,
    sourceChain.id,
    switchNetwork,
    transfer,
    transferAmount.amount,
    transferAmount.input,
    updateFeeBalanceOnSourceChain,
    updateSourceAssetBalance,
    updateTargetAssetBalance,
    updateTargetAssetSupply,
    updateSourceNativeBalance,
    updateTargetNativeBalance,
  ]);

  useEffect(() => {
    const options = availableSourceAssetOptions[sourceChain.network] || [];
    setSourceAssetOptions(options);
    _setSourceAsset(options.at(0));
  }, [sourceChain, _setSourceAsset]);

  useEffect(() => {
    const options = availableTargetChainOptions[sourceChain.network]?.[sourceAsset.symbol] || [];
    setTargetChainOptions(options);
    _setTargetChain(options.at(0));
  }, [sourceChain, sourceAsset, _setTargetChain]);

  useEffect(() => {
    const options = availableTargetAssetOptions[sourceChain.network]?.[sourceAsset.symbol]?.[targetChain.network] || [];
    _setTargetAsset(options.at(0));
  }, [sourceChain, targetChain, sourceAsset, _setTargetAsset]);

  const disabledSend =
    !sender?.address ||
    !sender.valid ||
    !recipient?.address ||
    !recipient?.valid ||
    !transferAmount.input ||
    !transferAmount.valid ||
    !!feeAlert ||
    !!existentialAlertOnSourceChain ||
    !!existentialAlertOnTargetChain;
  const senderOptions =
    activeSenderWallet === WalletID.EVM && address
      ? [{ address }]
      : activeSenderWallet === WalletID.TALISMAN
      ? talismanAccounts
      : [];
  const recipientOptions =
    activeRecipientWallet === WalletID.EVM && address
      ? [{ address }]
      : activeRecipientWallet === WalletID.TALISMAN
      ? talismanAccounts
      : [];

  return (
    <div className="border-radius mx-auto mt-10 flex w-[34rem] flex-col gap-5 bg-component p-5 pb-8 shadow-2xl">
      {/* Sender */}
      <TransferSection label="Sender" className="border-radius mt-10 border-[2px] border-white/20">
        <AddressInput
          who="sender"
          api={sourceApi}
          placeholder="Select an address"
          value={sender}
          options={senderOptions}
          accounts={activeSenderWallet === WalletID.TALISMAN ? talismanAccounts : []}
          onClear={setSender}
          onChange={setSender}
          onAccountChange={setActiveSenderAccount}
        />
      </TransferSection>

      {/* Recipient */}
      <TransferSection label="Recipient" className="border-radius mt-10 border-[2px] border-white/20">
        <AddressInput
          canInput
          api={targetApi}
          who="recipient"
          placeholder="Select or enter an address"
          value={recipient}
          options={recipientOptions}
          accounts={activeRecipientWallet === WalletID.TALISMAN ? talismanAccounts : []}
          onClear={setRecipient}
          onChange={setRecipient}
          onAccountChange={setActiveRecipientAccount}
        />
      </TransferSection>

      {/* From */}
      <TransferSection
        label="From"
        extra={<ChainSelect value={sourceChain} options={sourceChainOptions} onChange={_setSourceChain} />}
        className="border-radius mb-3 mt-12 border-[2px] border-white/20"
      >
        <BalanceInput
          value={transferAmount}
          asset={sourceAsset}
          cross={bridgeInstance?.getCrossInfo()}
          assetLimit={assetLimitOnTargetChain?.amount}
          assetSupply={targetAssetSupply?.amount}
          balance={sourceAssetBalance?.amount}
          assetOptions={sourceAssetOptions}
          onChange={setTransferAmount}
          onAssetChange={_setSourceAsset}
        />
      </TransferSection>

      {/* Switch */}
      <SwitchCross disabled={!canSwitch} onClick={handleSwitch} />

      {/* To */}
      <TransferSection
        label="To"
        extra={<ChainSelect value={targetChain} options={targetChainOptions} onChange={_setTargetChain} />}
        className="border-radius mt-3 border border-transparent"
      >
        <BalanceInput
          disabled
          asset={targetAsset}
          balance={targetAssetBalance?.amount}
          placeholder="Available balance 0"
        />
      </TransferSection>

      {/* Send */}
      <Button
        kind="primary"
        className="mt-4 py-middle"
        onClick={handleSend}
        disabled={!needSwitchNetwork && disabledSend}
        busy={busy}
      >
        {needSwitchNetwork ? "Switch network" : "Send"}
      </Button>

      {feeAlert ?? existentialAlertOnSourceChain ?? existentialAlertOnTargetChain}
    </div>
  );
}
