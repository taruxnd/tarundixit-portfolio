"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  DEFAULT_TAGS,
  TAG_PILE_OFFSETS,
  type TagData,
} from "./tagData";

const FONT_STACK =
  "'Space Grotesk', 'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

type TagWithId = TagData & {
  id: string;
  initialX: number;
  initialY: number;
};

type DraggableTagsProps = {
  numberOfTags?: number;
  ambientGlow?: boolean;
  backgroundColor?: string;
  glowOpacity?: number;
  dragScale?: number;
  animateOnLoad?: boolean;
  animationStyle?: "fly in" | "fade up" | "instant";
  tags?: TagData[];
  className?: string;
  expandOnTap?: boolean;
  alignOnTap?: boolean;
  onRowAlignChange?: (aligned: boolean) => void;
  stackSize?: { width: number; height: number };
};

type LayoutTarget = {
  x: number;
  y: number;
  rotate: number;
};

type DraggableTagProps = {
  tag: TagWithId;
  position: LayoutTarget;
  zIndex: number;
  dragScale: number;
  isExpanded: boolean;
  expandOnTap: boolean;
  canAlignToRow: boolean;
  onDragStart: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onAlignToRow: () => void;
  onPositionChange: (id: string, position: LayoutTarget) => void;
  onMeasure: (id: string, width: number) => void;
};

const expandTransition: Transition = {
  type: "tween",
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
};

function DraggableTag({
  tag,
  position,
  zIndex,
  dragScale,
  isExpanded,
  expandOnTap,
  canAlignToRow,
  onDragStart,
  onExpand,
  onCollapse,
  onAlignToRow,
  onPositionChange,
  onMeasure,
}: DraggableTagProps) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  useEffect(() => {
    if (!isDragging) {
      x.set(position.x);
      y.set(position.y);
    }
  }, [isDragging, position.x, position.y, x, y]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const report = () => onMeasure(tag.id, node.offsetWidth);

    report();

    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => observer.disconnect();
  }, [tag.id, onMeasure, tag.title]);

  useEffect(() => {
    if (expandedRef.current && isExpanded) {
      setExpandedHeight(expandedRef.current.scrollHeight);
    }
  }, [isExpanded, tag.description, tag.linkEnabled]);

  const boxShadow = `${tag.shadowOffsetX}px ${tag.shadowOffsetY}px ${tag.shadowBlur}px rgba(0, 0, 0, ${tag.shadowOpacity / 100})`;
  const expandedShadow = `${tag.shadowOffsetX}px ${tag.shadowOffsetY + 8}px ${tag.shadowBlur + 12}px rgba(0, 0, 0, ${(tag.shadowOpacity + 8) / 100})`;

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    onDragStart();
  }, [onDragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onPositionChange(tag.id, {
      x: x.get(),
      y: y.get(),
      rotate: position.rotate,
    });
  }, [onPositionChange, position.rotate, tag.id, x, y]);

  const handleTap = useCallback(() => {
    if (isDragging) return;

    if (canAlignToRow) {
      onAlignToRow();
      return;
    }

    if (expandOnTap && !isExpanded) {
      onExpand();
    }
  }, [canAlignToRow, expandOnTap, isDragging, isExpanded, onAlignToRow, onExpand]);

  const highlightInset = Math.min(tag.borderRadius, tag.paddingX);

  const handleLinkClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (tag.linkEnabled && tag.linkURL) {
        window.open(tag.linkURL, "_blank");
      }
    },
    [tag.linkEnabled, tag.linkURL],
  );

  const spring = {
    type: "spring" as const,
    stiffness: 320,
    damping: 28,
    delay: 0,
  };

  const cardStyle: CSSProperties = {
    backgroundColor: isExpanded ? tag.expandedBackgroundColor : tag.backgroundColor,
    color: tag.textColor,
    borderRadius: isExpanded ? tag.cardBorderRadius : tag.borderRadius,
    fontFamily: FONT_STACK,
    position: "relative",
    boxShadow: isExpanded ? expandedShadow : boxShadow,
    overflow: isExpanded ? "hidden" : "visible",
    display: "inline-flex",
    flexDirection: "column",
    width: "auto",
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      initial={false}
      animate={
        isDragging
          ? undefined
          : { rotate: position.rotate, opacity: 1, scale: 1 }
      }
      transition={{
        rotate: spring,
        opacity: spring,
        scale: { type: "spring", stiffness: 400, damping: 30, delay: 0 },
      }}
      whileDrag={{
        scale: dragScale,
        cursor: "grabbing",
        transition: { duration: 0.08 },
      }}
      style={{
        x,
        y,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: isExpanded ? 9999 : zIndex,
        cursor: "grab",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
      data-tag-id={tag.id}
      data-cursor="interactive"
      tabIndex={0}
    >
      <div ref={cardRef} style={cardStyle}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: highlightInset,
            right: highlightInset,
            height: 2,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
            zIndex: 10,
          }}
        />
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              onClick={(event) => {
                event.stopPropagation();
                onCollapse();
              }}
              aria-label="Close tag"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: tag.textColor,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                lineHeight: 1,
                zIndex: 10,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.35)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            flexShrink: 0,
            paddingTop: tag.paddingY,
            paddingBottom: tag.paddingY,
            paddingLeft: tag.paddingX,
            paddingRight: isExpanded ? 28 : tag.paddingX,
            fontFamily:
              tag.titleFont?.fontFamily ||
              '"Inter", "Inter Placeholder", sans-serif',
          }}
        >
          <span style={{ fontSize: tag.iconSize }}>{tag.icon}</span>
          <span
            style={{
              fontSize: tag.titleFont?.fontSize || "48px",
              fontWeight: tag.fontWeight || 800,
              letterSpacing: tag.titleFont?.letterSpacing || "-0.5px",
              lineHeight: tag.titleFont?.lineHeight || "1em",
              textAlign: (tag.titleFont?.textAlign || "left") as CSSProperties["textAlign"],
              fontStyle: tag.titleFont?.fontStyle || "normal",
              textTransform: "lowercase",
            }}
          >
            {tag.title}
          </span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: expandedHeight }}
              exit={{ height: 0 }}
              transition={expandTransition}
              style={{ overflow: "hidden", position: "relative", width: "100%" }}
            >
              <motion.div
                ref={expandedRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.12, delay: 0.06 } }}
                style={{
                  padding: 16,
                  paddingTop: 0,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    marginBottom: 12,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: tag.descriptionFont?.fontSize || "13px",
                    fontWeight: tag.descriptionFont?.fontWeight || 500,
                    lineHeight: tag.descriptionFont?.lineHeight || "1.5",
                    letterSpacing: tag.descriptionFont?.letterSpacing || "0",
                    opacity: 0.85,
                    color: tag.textColor,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                    textAlign: (tag.descriptionFont?.textAlign ||
                      "left") as CSSProperties["textAlign"],
                    fontStyle: tag.descriptionFont?.fontStyle || "normal",
                    fontFamily: tag.descriptionFont?.fontFamily || FONT_STACK,
                    width: "100%",
                    display: "block",
                  }}
                >
                  {tag.description}
                </p>
                {tag.linkEnabled && (
                  <button
                    type="button"
                    onClick={handleLinkClick}
                    style={{
                      marginTop: 12,
                      padding: "8px 16px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: tag.textColor,
                      border: "none",
                      borderRadius: 20,
                      fontSize: tag.linkFont?.fontSize || "13px",
                      fontWeight: tag.linkFont?.fontWeight || 600,
                      letterSpacing: tag.linkFont?.letterSpacing || "0",
                      lineHeight: tag.linkFont?.lineHeight || "1em",
                      textAlign: (tag.linkFont?.textAlign ||
                        "left") as CSSProperties["textAlign"],
                      fontStyle: tag.linkFont?.fontStyle || "normal",
                      fontFamily: tag.linkFont?.fontFamily || FONT_STACK,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.35)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    {tag.linkText}
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function DraggableTags({
  numberOfTags = 6,
  ambientGlow = true,
  backgroundColor = "#F5F5F5",
  glowOpacity = 0.08,
  dragScale: dragScaleProp,
  animateOnLoad = false,
  animationStyle = "fly in",
  tags = DEFAULT_TAGS,
  className = "",
  expandOnTap = true,
  alignOnTap = false,
  onRowAlignChange,
  stackSize = { width: 400, height: 280 },
}: DraggableTagsProps) {
  const prefersReducedMotion = useReducedMotion();
  const dragScale = dragScaleProp ?? (prefersReducedMotion ? 1 : 1.04);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(!animateOnLoad);

  useEffect(() => {
    if (!animateOnLoad || !containerRef.current) return;

    const node = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10%" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnLoad]);

  const tagItems = useMemo<TagWithId[]>(
    () =>
      tags.slice(0, numberOfTags).map((tag, index) => ({
        ...tag,
        id: `tag-${index}`,
        initialX:
          numberOfTags === 1
            ? 0
            : (TAG_PILE_OFFSETS[index]?.x ?? (index - 2.5) * 12),
        initialY:
          numberOfTags === 1
            ? 0
            : (TAG_PILE_OFFSETS[index]?.y ?? (index - 2.5) * 10),
      })),
    [tags, numberOfTags],
  );

  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    tagItems.forEach((tag, index) => {
      initial[tag.id] =
        TAG_PILE_OFFSETS[index]?.z ?? index + 1;
    });
    return initial;
  });
  const [topZ, setTopZ] = useState(tagItems.length + 1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const initialPositions = useMemo(() => {
    const initial: Record<string, LayoutTarget> = {};
    tagItems.forEach((tag) => {
      initial[tag.id] = {
        x: tag.initialX,
        y: tag.initialY,
        rotate: tag.rotation,
      };
    });
    return initial;
  }, [tagItems]);

  const [positions, setPositions] =
    useState<Record<string, LayoutTarget>>(initialPositions);
  const [hasAligned, setHasAligned] = useState(false);
  const [tagWidths, setTagWidths] = useState<Record<string, number>>({});

  const handleMeasure = useCallback((id: string, width: number) => {
    setTagWidths((prev) => (prev[id] === width ? prev : { ...prev, [id]: width }));
  }, []);

  const rowGap = 12;
  const rowY = 20;

  const rowLayout = useMemo(() => {
    let x = 0;
    return tagItems.map((tag) => {
      const width = tagWidths[tag.id] ?? 180;
      const target = { x, y: rowY, rotate: 0 };
      x += width + rowGap;
      return target;
    });
  }, [tagItems, tagWidths]);

  const rowWidth = useMemo(() => {
    if (tagItems.length === 0) return 0;
    return tagItems.reduce(
      (sum, tag) => sum + (tagWidths[tag.id] ?? 180) + rowGap,
      -rowGap,
    );
  }, [tagItems, tagWidths]);

  const alignToRow = useCallback(() => {
    if (hasAligned) return;

    const next: Record<string, LayoutTarget> = {};
    tagItems.forEach((tag, index) => {
      next[tag.id] = rowLayout[index] ?? { x: 0, y: rowY, rotate: 0 };
    });

    setPositions(next);
    setHasAligned(true);
    onRowAlignChange?.(true);
    setExpandedId(null);
  }, [hasAligned, onRowAlignChange, rowLayout, tagItems]);

  const handlePositionChange = useCallback((id: string, next: LayoutTarget) => {
    setPositions((prev) => ({ ...prev, [id]: next }));
  }, []);

  const bringToFront = useCallback(
    (id: string) => {
      setZIndices((prev) => ({ ...prev, [id]: topZ + 1 }));
      setTopZ((prev) => prev + 1);
    },
    [topZ],
  );

  const handleExpand = useCallback(
    (id: string) => {
      setExpandedId(id);
      bringToFront(id);
    },
    [bringToFront],
  );

  const handleCollapse = useCallback(() => {
    setExpandedId(null);
  }, []);

  useEffect(() => {
    if (!expandedId) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-tag-id]")) {
        handleCollapse();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [expandedId, handleCollapse]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: hasAligned ? Math.max(rowWidth, stackSize.width) : stackSize.width,
        height: hasAligned ? 120 : stackSize.height,
        backgroundColor,
        position: "relative",
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        transition: "width 0.35s ease, height 0.35s ease",
      }}
    >
      {ambientGlow && (
        <div
          style={{
            position: "absolute",
            width: "80%",
            height: "60%",
            background: `radial-gradient(ellipse at center, rgba(255, 180, 120, ${glowOpacity}) 0%, rgba(255, 160, 100, 0) 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      {tagItems.map((tag) => (
        <DraggableTag
          key={tag.id}
          tag={tag}
          position={positions[tag.id] ?? initialPositions[tag.id]!}
          zIndex={zIndices[tag.id] ?? 1}
          dragScale={dragScale}
          isExpanded={expandedId === tag.id}
          expandOnTap={expandOnTap}
          canAlignToRow={alignOnTap && !hasAligned}
          onDragStart={() => bringToFront(tag.id)}
          onExpand={() => handleExpand(tag.id)}
          onCollapse={handleCollapse}
          onAlignToRow={alignToRow}
          onPositionChange={handlePositionChange}
          onMeasure={handleMeasure}
        />
      ))}
    </div>
  );
}
