export function InputAlert({ text }: { text: string }) {
  return (
    <div className="absolute -bottom-[1.2rem] left-0 inline-flex w-full">
      <span className="text-xs font-light text-alert">{text}</span>
    </div>
  );
}
