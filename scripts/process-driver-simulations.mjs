import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const sourceDirectory = process.env.DRIVER_SIM_SOURCE_DIR;

if (!sourceDirectory) {
  throw new Error("DRIVER_SIM_SOURCE_DIR is required");
}

const outputDirectory = path.resolve("public/assets/driver-simulations");
const sourceByDiagramId = {
  D001: "exec-4c5164f9-ddab-4fc7-9b49-68093e0e911f.png",
  D002: "exec-cd9e76f2-5df9-4046-bf2a-37808f8add74.png",
  D003: "exec-e5d0698a-1c4b-49e6-8273-f6ba2eb6afa8.png",
  D004: "exec-959e0104-6818-4225-b5c8-d6111d719f14.png",
  D005: "exec-352d1c86-91a1-4a31-ac7f-b302ec2cd27e.png",
  D006: "exec-7148d6d6-8c7c-4ad7-ba26-206c90e305bc.png",
  D007: "exec-b2e38513-fdfc-44a9-a7e6-1e1da189b401.png",
  D008: "exec-9d00f705-7d9f-4677-8394-7b6e414bfe9d.png",
  D009: "exec-f870f9a4-643e-4eeb-a0ed-3c55ed954a7c.png",
  D010: "exec-ead6bca0-c1cf-4838-bbb3-038071bdc02b.png",
  D011: "exec-9c2536d1-1899-4820-8fa9-e8df8731444f.png",
  D012: "exec-1c015de5-bb2f-4854-8cff-4d7c9585710f.png",
  D013: "exec-a2c192d3-6ca4-4194-8f44-d404c2648d09.png",
  D014: "exec-0ccaded7-bc9c-402f-8a1e-0554c3301230.png",
  D015: "exec-8a41b506-42b6-46e6-9a6d-45f56332b0a2.png",
  D016: "exec-0b26d84a-d329-4fe2-9692-74a8e4a596db.png",
  D017: "exec-c367caef-0fa7-40eb-aab0-75fdc908e80c.png",
  D018: "exec-d802aa54-9dd8-4a94-b954-ea739e71cda0.png",
  D019: "exec-9d8c24b9-4dc1-4894-ad13-e68833468ba4.png",
  D020: "exec-9fe24674-c1d0-4a5f-94f2-a77a56160290.png",
  D021: "exec-7ff2cb23-c395-495f-8a9a-5004d2ca75a2.png",
  D022: "exec-56cd64b2-600f-4180-b367-56a778edb9f1.png",
  D023: "exec-354ceb6e-15c9-4154-ad8c-330b440b2ae9.png",
  D024: "exec-9f34b3ad-5273-4239-b10b-8d144f49307b.png",
};

await mkdir(outputDirectory, { recursive: true });

for (const [diagramId, sourceName] of Object.entries(sourceByDiagramId)) {
  const outputName = `${diagramId.toLowerCase()}-driver-view.webp`;
  await sharp(path.join(sourceDirectory, sourceName))
    .resize(1200, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(outputDirectory, outputName));
  console.log(`${diagramId}: ${outputName}`);
}
