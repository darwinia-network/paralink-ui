import { BaseBridge, UniversalBridge } from "@/libs";
import { useCallback, useEffect, useState } from "react";
import { from } from "rxjs";
import { BN } from "@polkadot/util";
import { Currency } from "@/types";

export function useAssetLimit(bridge: BaseBridge | undefined, position: "source" | "target") {
  const [value, setValue] = useState<{ currency: Currency; amount: BN }>();

  const update = useCallback(() => {
    if (bridge && position === "target") {
      return from(bridge.getAssetLimitOnTargetChain()).subscribe({
        next: setValue,
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      setValue(undefined);
    }
  }, [bridge, position]);

  useEffect(() => {
    const sub$$ = update();
    return () => {
      sub$$?.unsubscribe();
    };
  }, [update]);

  return { value, update };
}
