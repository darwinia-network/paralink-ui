import InputSelect from "@/ui/input-select";
import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef } from "react";
import ConnectWallet from "./connect-wallet";
import { WalletAccount } from "@talismn/connect-wallets";
import { isValidAddress, toShortAdrress } from "@/utils";
import { useAccountName, useTransfer } from "@/hooks";
import AddressIdenticon from "./address-identicon";
import { ApiPromise } from "@polkadot/api";
import { AddressType } from "@/types";

interface Value {
  name?: string;
  address: string;
  valid: boolean;
}

interface Props {
  canInput?: boolean;
  api: ApiPromise | undefined;
  who: "sender" | "recipient";
  value?: Value;
  options?: Pick<Value, "address" | "name">[];
  accounts?: WalletAccount[];
  placeholder?: string;
  onClear?: (value: undefined) => void;
  onChange?: (value: Value | undefined) => void;
  onAccountChange?: (account: WalletAccount) => void;
}

export default function AddressInput({
  api,
  who,
  value,
  options,
  accounts,
  placeholder,
  canInput,
  onClear,
  onChange = () => undefined,
  onAccountChange = () => undefined,
}: Props) {
  const { sourceChain, targetChain } = useTransfer();

  const addressType = useMemo(
    () => (who === "sender" ? sourceChain.addressType : targetChain.addressType),
    [who, sourceChain, targetChain],
  );
  const addressTypeRef = useRef(addressType);

  const handleClear = useCallback(() => onClear && onClear(undefined), [onClear]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      if (canInput) {
        const address = e.target.value;
        const valid = address ? isValidAddress(address, addressType) : true;
        onChange({ valid, address });
      }
    },
    [addressType, canInput, onChange],
  );

  // Fire onChange to update `valid`
  useEffect(() => {
    if (addressType !== addressTypeRef.current && value) {
      onChange(who === "sender" ? undefined : { ...value, valid: isValidAddress(value.address, addressType) });
    }
    addressTypeRef.current = addressType;
  }, [who, value, addressType, onChange]);

  return (
    <InputSelect
      sameWidth
      clearable
      clickable={!!options?.length || !canInput}
      canInput={canInput}
      innerSuffix={<ConnectWallet who={who} height="full" />}
      wrapClassName={`h-12 bg-transparent flex items-center justify-between p-1 border border-radius transition-colors duration-200 ${
        value?.valid === false ? "border-alert" : "border-transparent"
      }`}
      inputClassName="w-full border-radius h-full bg-transparent px-1"
      childClassName="flex flex-col py-middle bg-component border-primary border border-radius max-h-60 overflow-y-auto"
      placeholder={placeholder ?? "Address"}
      value={value?.address ?? ""} // Keep it as a controlled component
      inputChildren={
        value?.name ? (
          <div className="inline-block px-1">
            {value.name}
            <span className="text-white/50">&nbsp;({toShortAdrress(value.address)})</span>
          </div>
        ) : undefined
      }
      alert={value?.valid === false ? "* Unavailable address" : ""}
      onClear={handleClear}
      onChange={handleChange}
    >
      {options?.length ? (
        options.map((account, index) => (
          <Option
            api={api}
            account={account}
            key={account.address}
            addressType={addressType}
            onClick={() => {
              if (accounts?.at(index)) {
                onAccountChange(accounts[index]);
              }
            }}
            onChange={onChange}
            disabled={!isValidAddress(account.address, addressType)}
          />
        ))
      ) : (
        <div className="inline-flex justify-center px-middle py-small">
          <span className="text-sm font-medium text-slate-400">No data</span>
        </div>
      )}
    </InputSelect>
  );
}

function Option({
  api,
  account,
  disabled,
  addressType,
  onClick,
  onChange,
}: {
  account: Pick<Value, "address" | "name">;
  api: ApiPromise | undefined;
  disabled?: boolean;
  addressType: AddressType;
  onClick: () => void;
  onChange: (value: Value | undefined) => void;
}) {
  const name = useAccountName(account.address, api);

  return (
    <button
      onClick={() => {
        onChange({ ...account, name: account.name ?? name, valid: isValidAddress(account.address, addressType) });
        onClick();
      }}
      disabled={disabled}
      className="flex items-center gap-middle px-middle py-1 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <AddressIdenticon size={20} address={account.address} />
      {account.name || name !== account.address ? (
        <div className="inline-block truncate text-sm font-medium">
          {account.name ?? name}
          <span className="text-white/50">&nbsp;({toShortAdrress(account.address)})</span>
        </div>
      ) : (
        <span className="truncate text-sm font-medium">{account.address}</span>
      )}
    </button>
  );
}
