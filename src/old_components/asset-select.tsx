import { Asset } from "@/types";
import Select from "@/ui/select";
import { getAssetIconSrc } from "@/utils";
import Image from "next/image";

interface Props {
  value: Asset;
  options?: Asset[];
  disabled?: boolean;
  onChange?: (value: Asset) => void;
}

export default function AssetSelect({ value, options, disabled, onChange = () => undefined }: Props) {
  return (
    <Select
      label={
        <div className="flex items-center gap-small truncate px-1">
          <Image width={22} height={22} alt="Asset icon" src={getAssetIconSrc(value.icon)} className="rounded-full" />
          <span>{value.symbol}</span>
        </div>
      }
      disabled={disabled}
      sameWidth
      labelClassName="flex items-center gap-middle shrink-0 w-32 justify-between bg-component h-full rounded-r-2xl px-1 hover:opacity-80 transition-[transform,color] disabled:translate-y-0 disabled:opacity-100 disabled:cursor-not-allowed"
      childClassName="flex flex-col py-small bg-component border-primary border border-radius gap-[1px]"
    >
      {options?.length ? (
        options.map((asset) => (
          <button
            key={asset.symbol}
            disabled={asset.id === value.id}
            onClick={() => onChange(asset)}
            className="flex items-center gap-small px-middle py-2 transition-colors hover:bg-white/10 disabled:bg-white/10"
          >
            <Image width={20} height={20} alt="Asset icon" src={getAssetIconSrc(asset.icon)} className="rounded-full" />
            <span className="text-sm font-medium">{asset.symbol}</span>
          </button>
        ))
      ) : (
        <div className="inline-flex justify-center px-middle py-2">
          <span className="text-sm font-medium text-slate-400">No data</span>
        </div>
      )}
    </Select>
  );
}
