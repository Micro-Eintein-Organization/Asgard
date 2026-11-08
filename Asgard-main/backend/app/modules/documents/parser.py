"""Run with isolated Python in the Linux backend container; stdin/stdout are private."""

import io
import json
import resource
import socket
import sys


def extract(data):
    from pypdf import PdfReader

    if not data.startswith(b"%PDF-") or len(data) > 10_000_000:
        raise ValueError("invalid_pdf")
    reader = PdfReader(io.BytesIO(data), strict=True)
    if reader.is_encrypted:
        raise ValueError("encrypted_pdf")
    if len(reader.pages) > 50:
        raise ValueError("too_many_pages")
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
        if sum(map(len, pages)) > 100_000:
            raise ValueError("too_much_text")
    if not any(text.strip() for text in pages):
        raise ValueError("no_selectable_text")
    return pages


if __name__ == "__main__":
    resource.setrlimit(resource.RLIMIT_AS, (384 * 1024**2, 384 * 1024**2))
    resource.setrlimit(resource.RLIMIT_CPU, (12, 12))
    resource.setrlimit(resource.RLIMIT_FSIZE, (0, 0))
    socket.socket = lambda *args, **kwargs: (_ for _ in ()).throw(PermissionError())
    try:
        print(json.dumps({"pages": extract(sys.stdin.buffer.read(10_000_001))}))
    except ValueError as error:
        allowed = {
            "invalid_pdf",
            "encrypted_pdf",
            "too_many_pages",
            "too_much_text",
            "no_selectable_text",
        }
        print(json.dumps({"error": str(error) if str(error) in allowed else "invalid_pdf"}))
    except Exception:
        print(json.dumps({"error": "invalid_pdf"}))
