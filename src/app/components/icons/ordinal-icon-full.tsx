export function OrdinalIconFull(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={90}
      height={90}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={45} cy={45} r={32.5} fill="#fff" stroke="#fff" strokeWidth={9} />
      <circle cx={45} cy={45} r={44} stroke="#fff" strokeWidth={2} />
    </svg>
  );
}
