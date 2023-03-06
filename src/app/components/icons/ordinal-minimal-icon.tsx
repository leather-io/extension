export function OrdinalMinimalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={15} cy={15} r={15} fill="#0C0C0D" />
      <circle cx={15} cy={15} r={11.25} fill="#fff" />
      <circle cx={15} cy={15} r={5.625} fill="#0C0C0D" />
    </svg>
  );
}
