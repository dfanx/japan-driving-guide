import { CANONICAL_CANVAS } from "./geometry/canvas";
import { serializeSvgNode, svgNode, type SvgNode } from "./primitives/svg";

const diagramIdPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;

export function renderSvgDocument(input: {
  id: string;
  title: string;
  description: string;
  nodes: readonly SvgNode[];
}): string {
  if (!diagramIdPattern.test(input.id)) {
    throw new TypeError(`Invalid diagram document ID: ${input.id}`);
  }
  if (!input.title.trim() || !input.description.trim()) {
    throw new TypeError("Diagram title and description cannot be empty");
  }
  if (input.nodes.length === 0) {
    throw new TypeError("A diagram document requires at least one visual node");
  }

  const titleId = `${input.id}-title`;
  const descriptionId = `${input.id}-description`;
  const document = svgNode(
    "svg",
    {
      "aria-labelledby": `${titleId} ${descriptionId}`,
      "data-diagram-id": input.id,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      viewBox: `0 0 ${CANONICAL_CANVAS.width} ${CANONICAL_CANVAS.height}`,
      xmlns: "http://www.w3.org/2000/svg",
    },
    {
      children: [
        svgNode("title", { id: titleId }, { text: input.title.trim() }),
        svgNode(
          "desc",
          { id: descriptionId },
          { text: input.description.trim() },
        ),
        ...input.nodes,
      ],
    },
  );

  return `${serializeSvgNode(document)}\n`;
}
