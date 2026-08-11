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
    Selection(1, "Image26.png", "traffic-light-green-right-arrow.png", 365, 196),
    Selection(2, "Image34.jpg", "traffic-light-flashing-red.jpg", 383, 121),
    Selection(2, "Image36.jpg", "traffic-light-flashing-yellow.jpg", 368, 124),
)


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract exact NPA signal assets for reviewed diagram candidates.")
    parser.add_argument("source_pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    if digest(args.source_pdf.read_bytes()) != EXPECTED_DOCUMENT_SHA256:
        raise ValueError("Unexpected NPA source document hash")
    reader = PdfReader(args.source_pdf)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for selection in SELECTIONS:
        image = next(
            (candidate for candidate in reader.pages[selection.page - 1].images if candidate.name == selection.image_name),
            None,
        )
        if image is None or image.image.size != (selection.width, selection.height):
            raise ValueError(f"Missing or changed {selection.image_name} on page {selection.page}")
        path = args.output_dir / selection.output_name
        path.write_bytes(image.data)
        print(f"{path.name} {selection.width}x{selection.height} sha256:{digest(image.data)}")


if __name__ == "__main__":
    main()
