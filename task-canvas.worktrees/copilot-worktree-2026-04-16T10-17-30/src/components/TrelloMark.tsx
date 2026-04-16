interface TrelloMarkProps {
  className?: string;
  tileClassName?: string;
  glyphClassName?: string;
}

export default function TrelloMark({
  className = '',
  tileClassName = '',
  glyphClassName = '',
}: TrelloMarkProps) {
  return (
    <div className={`flex items-center justify-center rounded-[4px] bg-[#0c66e4] ${className} ${tileClassName}`.trim()}>
      <svg viewBox="0 0 24 24" className={`text-white ${glyphClassName}`.trim()} fill="currentColor" aria-hidden="true">
        <rect x="4" y="4" width="7" height="16" rx="1.8" />
        <rect x="13" y="4" width="7" height="10" rx="1.8" />
      </svg>
    </div>
  );
}
