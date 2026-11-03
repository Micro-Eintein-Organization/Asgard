"""Count model input locally using the verified tokenizer bundled in the image."""

import hashlib
import os
from functools import lru_cache
from pathlib import Path

import tiktoken

TOKEN_LIMIT = 12000
FRAMING_ALLOWANCE = 256
VOCAB_URL = "https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken"
VOCAB_HASH = "446a9538cb6c348e3516120d7c08b09f57c36495e2acfffe59a5bf8b0cfb1a2d"


@lru_cache(maxsize=1)
def tokenizer():
    cache = os.environ.get("TIKTOKEN_CACHE_DIR")
    if not cache:
        raise ValueError("tokenizer_not_bundled")
    path = Path(cache) / hashlib.sha1(VOCAB_URL.encode()).hexdigest()
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != VOCAB_HASH:
        raise ValueError("tokenizer_not_bundled")
    return tiktoken.get_encoding("o200k_harmony")


def input_tokens(serialized_request):
    # Count the complete local envelope as well as extra provider framing. This
    # is an application budget, not a claim of exact Groq prompt billing.
    return len(tokenizer().encode_ordinary(serialized_request)) + FRAMING_ALLOWANCE
