export function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 32c.903 0 1.634-.733 1.634-1.565v-8.827h8.746c.875 0 1.62-.72 1.62-1.608 0-.874-.745-1.608-1.62-1.608h-8.746V9.565C21.634 8.72 20.904 8 20 8c-.889 0-1.634.72-1.634 1.565v8.827H9.62C8.774 18.392 8 19.127 8 20c0 .888.774 1.608 1.62 1.608h8.746v8.827c0 .832.745 1.565 1.634 1.565Z"
        fill="currentColor"
      />
    </svg>
  );
}
