interface Props {
  value: number;
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-0.5 bg-[#1E1E1E]">
      <div
        className="h-full bg-hazard transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}