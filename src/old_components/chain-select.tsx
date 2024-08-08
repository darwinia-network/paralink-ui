import { ChainConfig } from "@/types";
import Select from "@/ui/select";
import { getChainLogoSrc } from "@/utils";
import Image from "next/image";

interface Props {
  value: ChainConfig;
  options?: ChainConfig[];
  disabled?: boolean;
  onChange?: (value: ChainConfig) => void;
}

export default function ChainSelect({ value, options, disabled, onChange = () => undefined }: Props) {
  return (
    <Select
      label={
        <div className="flex max-w-[12rem] items-center gap-small">
          <Image width={20} height={20} alt="Chain logo" src={getChainLogoSrc(value.logo)} />
          <span className="truncate text-white/50">{value.name}</span>
        </div>
      }
      disabled={disabled}
      sameWidth
      labelClassName="flex items-center gap-middle py-[4px] px-[6px] bg-transparent hover:bg-white/10 border-radius"
      childClassName="flex flex-col py-small bg-component border-primary border border-radius gap-[1px]"
      arrowClassName="opacity-50"
    >
      {options?.length ? (
        options.map((chain) => (
          <button
            key={chain.network}
            disabled={chain.network === value.network}
            onClick={() => onChange(chain)}
            className="flex items-center gap-small px-middle py-2 transition-colors hover:bg-white/10 disabled:bg-white/10"
          >
            <Image width={18} height={18} alt="Chain logo" src={getChainLogoSrc(chain.logo)} />
            <span className="truncate text-sm font-medium">{chain.name}</span>
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
