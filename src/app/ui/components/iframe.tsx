//
//  __          __     _____  _   _ _____ _   _  _____
//  \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|
//   \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __
//    \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |
//     \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |
//      \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|
//
// The purpose of this iframe is to wrap content from external sources,
// primarily for use with inscriptions. Iframes are dangerous and we
// need to be very careful with our use of them.
//
// Below, we use the sandbox attribute to limit what they can do, as well as
// disabling any interaction with pointer events and user selection.
import { HTMLStyledProps, styled } from 'leather-styles/jsx';

interface IframeProps extends HTMLStyledProps<'iframe'> {
  onError(): void;
  src: string;
}
export function Iframe({ onError, src, ...props }: IframeProps) {
  return (
    <styled.iframe
      loading="lazy"
      onError={onError}
      overflow="hidden"
      pointerEvents="none"
      sandbox="allow-scripts"
      src={src}
      userSelect="none"
      {...props}
    />
  );
}
