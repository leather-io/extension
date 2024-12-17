import { AnimatePresence, motion } from 'framer-motion';
import { token } from 'leather-styles/tokens';

export function BackgroundOverlay({ show = false }: { show?: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: token('colors.ink.component-background-default'),
          }}
        />
      )}
    </AnimatePresence>
  );
}
