import { isAddress } from "viem";
import EVMIdenticon from "./evm-identicon";
import Identicon from "@polkadot/react-identicon";

interface Props {
  address: string;
  size: number;
}

export default function AddressIdenticon({ address, size }: Props) {
  return (
    <div className="inline-flex shrink-0 items-center justify-center">
      {isAddress(address) ? (
        <EVMIdenticon diameter={size} address={address} />
      ) : (
        <Identicon size={size} value={address} theme="polkadot" />
      )}
    </div>
  );
}
