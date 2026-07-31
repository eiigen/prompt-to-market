interface Props {
  value: number;
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-surface-border">
      <div
        className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
