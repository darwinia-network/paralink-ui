import { Asset, Cross } from "@/types";
import Input from "@/ui/input";
import { BN, BN_ZERO, bnToBn } from "@polkadot/util";
import AssetSelect from "./asset-select";
import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef } from "react";
import { formatBalance } from "@/utils";
import { formatUnits, parseUnits } from "viem";
import { InputAlert } from "./input-alert";

interface Value {
  valid: boolean;
  input: string;
  amount: BN;
}

interface Props {
  value?: Value;
  disabled?: boolean;
  placeholder?: string;
  balance?: BN;
  cross?: Cross;
  asset: Asset;
  assetSupply?: BN;
  assetLimit?: BN;
  assetOptions?: Asset[];
  onChange?: (value: Value) => void;
  onAssetChange?: (value: Asset) => void;
}

export default function BalanceInput({
  value,
  disabled,
  placeholder,
  balance,
  cross,
  asset,
  assetSupply,
  assetLimit,
  assetOptions,
  onChange = () => undefined,
  onAssetChange,
}: Props) {
  const assetRef = useRef(asset);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const _placeholder = useMemo(() => {
    if (balance && asset) {
      return `Available balance ${formatBalance(balance, asset.decimals)}`;
    }
    return placeholder ?? "Enter an amount";
  }, [balance, asset, placeholder]);

  const min = useMemo(() => {
    if (cross && cross.fee.asset.local.id === asset.id) {
      return cross.fee.amount;
    }
    return undefined;
  }, [cross, asset.id]);

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.target.value) {
        if (!Number.isNaN(Number(e.target.value)) && asset) {
          onChange(parseValue(e.target.value, asset.decimals, min, balance, assetLimit, assetSupply));
        }
      } else {
        onChange({ valid: true, input: e.target.value, amount: BN_ZERO });
      }
    },
    [asset, min, balance, assetLimit, assetSupply, onChange],
  );

  useEffect(() => {
    // Fire onChange to update `amount`
    if (assetRef.current?.decimals !== asset?.decimals) {
      onChange(parseValue(value?.input || "", asset?.decimals || 0, min, balance, assetLimit, assetSupply));
    }
    assetRef.current = asset;
  }, [value, asset, min, balance, assetLimit, assetSupply, onChange]);

  const insufficient = balance && value?.input && balance.lt(value.amount) ? true : false;
  const requireMin = min && value?.input && value.amount.lt(min) ? true : false;
  const requireLimit = isExcess(assetLimit, assetSupply, value?.amount);

  return (
    <div
      className={`border-radius relative flex h-12 items-center justify-between border p-1 transition-colors ${
        value?.valid === false ? "border-alert" : "border-transparent"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Input
        disabled={disabled}
        placeholder={_placeholder}
        className="h-full w-full bg-transparent px-1"
        ref={inputRef}
        value={value?.input}
        onChange={handleInputChange}
      />
      <div className="flex h-full items-center gap-[2px]">
        <button
          className="h-full rounded-l-2xl bg-component px-2 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-100"
          onClick={() => {
            if (balance && assetSupply) {
              if (assetLimit && assetSupply.gte(assetLimit)) {
                onChange({ valid: !(min && min.gt(BN_ZERO)), input: "0", amount: BN_ZERO });
              } else if (assetLimit) {
                const remaining = assetLimit.sub(assetSupply);
                const amount = remaining.lte(balance) ? remaining : balance;
                const input = formatUnits(BigInt(amount.toString()), asset.decimals);
                onChange({ valid: !(min && min.gt(amount)), input, amount });
              } else {
                onChange({
                  amount: balance,
                  valid: !(min && min.gt(balance)),
                  input: formatUnits(BigInt(balance.toString()), asset.decimals),
                });
              }
            } else {
              onChange({ valid: !(min && min.gt(BN_ZERO)), input: "0", amount: BN_ZERO });
            }
          }}
          disabled={disabled}
        >
          Max
        </button>
        <AssetSelect disabled={disabled} value={asset} options={assetOptions} onChange={onAssetChange} />
      </div>

      {/* Alert */}
      {requireLimit ? (
        <InputAlert
          text={`* Limit: ${formatBalance(assetLimit ?? BN_ZERO, asset?.decimals ?? 0)}, supply: ${formatBalance(
            (assetSupply ?? BN_ZERO).add(value?.amount ?? BN_ZERO),
            asset?.decimals ?? 0,
          )}.`}
        />
      ) : requireMin ? (
        <InputAlert
          text={`* At least ${formatBalance(min ?? BN_ZERO, asset?.decimals ?? 0)} ${asset.symbol} for tx fee.`}
        />
      ) : insufficient ? (
        <InputAlert text="* Insufficient." />
      ) : null}

      {/*  Invisible */}
      <span className="invisible fixed left-0 top-0 -z-50" ref={spanRef}>
        {value?.input}
      </span>
    </div>
  );
}

function parseValue(origin: string, decimals: number, min?: BN, max?: BN, limit?: BN, supply?: BN) {
  let input = "";
  let amount = BN_ZERO;
  const [i, d] = origin.split(".").concat("-1");
  if (i) {
    input = d === "-1" ? i : d ? `${i}.${d.slice(0, decimals)}` : `${i}.`;
    amount = bnToBn(parseUnits(input, decimals));
  }
  const valid =
    min && amount.lt(min) ? false : max && amount.gt(max) ? false : isExcess(limit, supply, amount) ? false : true;
  return { input, amount, valid };
}

function isExcess(limit?: BN, supply?: BN, amount = BN_ZERO) {
  return limit && supply && supply.add(amount).gt(limit) ? true : false;
}
