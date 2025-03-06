import { sanitize } from 'dompurify';
import { Box } from 'leather-styles/jsx';

interface CollectibleTextLayoutProps {
  children: string;
}
export function CollectibleTextLayout({ children }: CollectibleTextLayoutProps) {
  return (
    <Box
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '30px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
      }}
      bg="black"
      color="white"
      height="100%"
      p="20px"
      position="relative"
      overflow="hidden"
      textAlign="left"
      width="100%"
    >
      <pre>{sanitize(children)}</pre>
    </Box>
  );
}
