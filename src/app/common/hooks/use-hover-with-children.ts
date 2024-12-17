import { useCallback, useState } from 'react';

interface HoverBind {
  onMouseEnter(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
  onMouseLeave(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export function useHoverWithChildren(): [boolean, HoverBind] {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    // If the related target is a child of the current element, don't trigger mouseleave
    if (event.currentTarget.contains(relatedTarget)) {
      return;
    }

    setIsHovered(false);
  }, []);

  const bind: HoverBind = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return [isHovered, bind];
}
