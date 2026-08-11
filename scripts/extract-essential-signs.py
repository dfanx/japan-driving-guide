from __future__ import annotations

import argparse
import hashlib
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader


EXPECTED_DOCUMENT_SHA256 = "004715cfb1f52955d0397264a2e662e698b82c47063fabaafca5de11b226a064"


@dataclass(frozen=True)
class Selection:
    page: int
    image_name: str
    output_name: str
    width: int
    height: int


SELECTIONS = (
    Selection(2, "Image33.jpg", "npa-no-entry.jpg", 267, 237),
    Selection(5, "Image56.png", "npa-no-u-turn.png", 241, 243),
    Selection(6, "Image66.png", "npa-no-stopping-or-parking.png", 294, 293),
    Selection(6, "Image67.png", "npa-no-parking.png", 289, 288),
    Selection(7, "Image78.jpg", "npa-maximum-speed-50.jpg", 321, 318),
    Selection(9, "Image93.png", "npa-one-way-straight.png", 134, 201),
    Selection(13, "Image125.jpg", "npa-slow-bilingual.jpg", 254, 214),
    Selection(13, "Image127.jpg", "npa-stop-bilingual.jpg", 260, 228),
    Selection(15, "Image145.jpg", "npa-pedestrian-crossing.jpg", 286, 313),
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract exact NPA road-sign image objects without visual modification."
    )
    parser.add_argument("source_pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()

    source_bytes = args.source_pdf.read_bytes()
    source_hash = sha256(source_bytes)
    if source_hash != EXPECTED_DOCUMENT_SHA256:
        raise ValueError(
            f"Unexpected NPA PDF SHA-256: {source_hash}; expected {EXPECTED_DOCUMENT_SHA256}"
        )

    reader = PdfReader(args.source_pdf)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for selection in SELECTIONS:
        matches = [
            image
            for image in reader.pages[selection.page - 1].images
            if image.name == selection.image_name
        ]
        if len(matches) != 1:
            raise ValueError(
                f"Expected one {selection.image_name} on page {selection.page}; got {len(matches)}"
            )
        image = matches[0]
        if image.image.size != (selection.width, selection.height):
            raise ValueError(
                f"Unexpected dimensions for {selection.image_name}: {image.image.size}"
            )
        output_path = args.output_dir / selection.output_name
        output_path.write_bytes(image.data)
        print(
            f"{selection.output_name}: page {selection.page} /{selection.image_name.removesuffix(Path(selection.image_name).suffix)} "
            f"{selection.width}x{selection.height} sha256:{sha256(image.data)}"
        )


if __name__ == "__main__":
    main()
