import { PropsWithChildren, ReactElement } from "react";
import Label from "./label";

interface Props {
  label: string;
  extra?: ReactElement;
  className?: string;
}

export default function TransferSection({ label, extra, children, className }: PropsWithChildren<Props>) {
  return (
    <div className={`relative flex flex-col gap-middle ${className}`}>
      <div className={`absolute left-0 flex w-full items-end justify-between ${extra ? "-top-9" : "-top-7"}`}>
        <Label text={label} />
        {extra}
      </div>
      <div className="border-radius bg-app-black">{children}</div>
    </div>
  );
}
