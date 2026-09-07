import rawTags from "./tagData.json";

export type TagFont = {
  fontSize?: string;
  variant?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
};

export type TagData = {
  title: string;
  description: string;
  icon: string;
  linkText: string;
  linkURL: string;
  linkEnabled: boolean;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  rotation: number;
  paddingX: number;
  paddingY: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowOpacity: number;
  size: "small" | "medium" | "large";
  iconSize: number;
  expandedBackgroundColor: string;
  cardBorderRadius: number;
  titleFont?: TagFont;
  descriptionFont?: TagFont;
  linkFont?: TagFont;
};

export const DEFAULT_TAGS = rawTags as TagData[];

const PRODUCT_DESIGNER_TAG = DEFAULT_TAGS[0]!;
const SAAS_TAG = DEFAULT_TAGS[3]!;

/** Single hero badge — original folder pill specs, orange saas palette. */
export const HERO_ROLE_TAG: TagData = {
  ...PRODUCT_DESIGNER_TAG,
  backgroundColor: SAAS_TAG.backgroundColor,
  textColor: SAAS_TAG.textColor,
  icon: SAAS_TAG.icon,
  expandedBackgroundColor: SAAS_TAG.expandedBackgroundColor,
};

/** Stack offsets tuned for short pill tags — matches the reference pile. */
export const TAG_PILE_OFFSETS = [
  { x: -48, y: -12, z: 1 },
  { x: 52, y: 28, z: 2 },
  { x: -18, y: 38, z: 3 },
  { x: -62, y: 52, z: 4 },
  { x: 38, y: -22, z: 5 },
  { x: 8, y: 8, z: 6 },
];
