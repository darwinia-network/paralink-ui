import { useToggle } from "@/hooks";
import {
  FloatingPortal,
  Placement,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import Image from "next/image";
import { ChangeEventHandler, PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import Input from "./input";
import { InputAlert } from "@/old_components/input-alert";

interface Props {
  alert?: string;
  value?: string;
  placeholder?: string;
  suffix?: ReactElement | boolean;
  innerSuffix?: ReactElement;
  disabled?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  clearable?: boolean;
  canInput?: boolean;
  sameWidth?: boolean;
  placement?: Placement;
  wrapClassName?: string;
  inputClassName?: string;
  childClassName?: string;
  arrowClassName?: string;
  inputChildren?: JSX.Element;
  onClear?: () => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function InputSelect({
  alert,
  value,
  placeholder,
  suffix = true,
  innerSuffix,
  disabled,
  children,
  hoverable = false,
  clickable = true,
  clearable,
  placement,
  canInput,
  sameWidth,
  inputChildren,
  wrapClassName,
  inputClassName,
  childClassName,
  arrowClassName,
  onClear = () => undefined,
  onChange = () => undefined,
}: PropsWithChildren<Props>) {
  const { state: isOpen, setState: setIsOpen, setFalse: setIsOpenFalse } = useToggle(false);
  const valueRef = useRef(value);

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(6),
      sameWidth
        ? size({
            apply({ rects, elements }) {
              Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
            },
          })
        : undefined,
    ],
  });

  const { styles, isMounted } = useTransitionStyles(context, {
    initial: { transform: "translateY(-10px)", opacity: 0 },
    open: { transform: "translateY(0)", opacity: 1 },
    close: { transform: "translateY(-10px)", opacity: 0 },
  });

  const hover = useHover(context, { enabled: hoverable });
  const click = useClick(context, { enabled: clickable });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss]);

  useEffect(() => {
    if (canInput) {
      if (value) {
        setIsOpen(false);
      } else if ((hoverable || clickable) && valueRef.current) {
        setIsOpen(true);
      }
    }
    valueRef.current = value;
  }, [value, clickable, hoverable, canInput, setIsOpen]);

  return (
    <>
      <div
        className={`relative ${disabled ? "cursor-not-allowed" : ""} ${wrapClassName}`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <Input
          className={`${canInput ? "" : "hover:cursor-pointer"} ${inputClassName}`}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          readOnly={!canInput}
          inputChildren={inputChildren}
        />
        {suffix === true ? (
          <div className="flex h-full shrink-0 items-center gap-small">
            {value && clearable ? (
              <div
                className="relative h-[16px] w-[16px] shrink-0 rounded-full bg-transparent p-[2px] opacity-80 transition hover:scale-105 hover:cursor-pointer hover:bg-white/20 hover:opacity-100 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              >
                <Image alt="Close" fill src="/images/close.svg" />
              </div>
            ) : null}
            <Image
              style={{ transform: isOpen ? "rotateX(180deg)" : "rotateX(0)" }}
              className={`shrink-0 transition-transform ${arrowClassName}`}
              src="/images/caret-down.svg"
              alt="Caret down"
              width={16}
              height={16}
            />
            {innerSuffix}
          </div>
        ) : (
          suffix ?? null
        )}

        {alert ? <InputAlert text={alert} /> : null}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div style={floatingStyles} ref={refs.setFloating} {...getFloatingProps()} className="z-20">
            <div className={`${childClassName}`} style={styles} onClick={setIsOpenFalse}>
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
