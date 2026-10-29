import asyncio
from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.core.errors import APIError
from app.modules.documents import routes


def test_upload_and_analysis_are_blocked_before_processing():
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(
        settings=SimpleNamespace(documents_processing_enabled=False),
    )))
    for operation in (
        routes.upload(request, None, 1),
        routes.analyze(uuid4(), None, request, None),
    ):
        with pytest.raises(APIError) as error:
            asyncio.run(operation)
        assert error.value.code == "documents_deferred"
