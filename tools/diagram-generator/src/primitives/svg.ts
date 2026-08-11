import { formatSvgNumber } from "../geometry/canvas";

export const SVG_TAGS = [
  "circle",
  "desc",
  "g",
  "image",
  "line",
  "path",
  "rect",
  "svg",
  "text",
  "title",
] as const;

export type SvgTag = (typeof SVG_TAGS)[number];
export type SvgAttributeValue = number | string;

export interface SvgNode {
  tag: SvgTag;
  attributes: Readonly<Record<string, SvgAttributeValue>>;
  children?: readonly SvgNode[];
  text?: string;
}

const attributeNamePattern = /^[A-Za-z_:][A-Za-z0-9_.:-]*$/;

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function svgNode(
  tag: SvgTag,
  attributes: Readonly<Record<string, SvgAttributeValue>>,
  options: { children?: readonly SvgNode[]; text?: string } = {},
): SvgNode {
  if (options.children && options.text !== undefined) {
    throw new TypeError("An SVG node cannot contain both child nodes and text");
  }

  return {
    tag,
    attributes: { ...attributes },
    ...(options.children ? { children: [...options.children] } : {}),
    ...(options.text !== undefined ? { text: options.text } : {}),
  };
}

export function serializeSvgNode(node: SvgNode): string {
  const attributes = Object.entries(node.attributes)
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([name, value]) => {
      if (!attributeNamePattern.test(name)) {
        throw new TypeError(`Invalid SVG attribute name: ${name}`);
      }
      const normalized =
        typeof value === "number" ? formatSvgNumber(value) : value;
      return `${name}="${escapeXml(normalized)}"`;
    });
  const opening = attributes.length
    ? `<${node.tag} ${attributes.join(" ")}`
    : `<${node.tag}`;

  if (!node.children?.length && node.text === undefined) {
    return `${opening}/>`;
  }

  const content = node.children
    ? node.children.map(serializeSvgNode).join("")
    : escapeXml(node.text ?? "");
  return `${opening}>${content}</${node.tag}>`;
}

export function serializeSvgNodes(nodes: readonly SvgNode[]): string {
  return nodes.map(serializeSvgNode).join("");
}
