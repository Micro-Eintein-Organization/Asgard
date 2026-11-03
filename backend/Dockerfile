FROM python:3.13.17-slim-bookworm@sha256:e32be0e55814a08977501ca863271d9bd02443710db8f2afaf8372e2c4508530 AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_DISABLE_PIP_VERSION_CHECK=1 PYTHONPATH=/workspace
WORKDIR /workspace
COPY requirements.lock .
RUN pip install --no-cache-dir --require-hashes -r requirements.lock
ENV TIKTOKEN_CACHE_DIR=/opt/asgard-tokenizer
RUN python -c "import tiktoken; tiktoken.get_encoding('o200k_harmony')" && chmod -R a+rX /opt/asgard-tokenizer
RUN useradd --create-home --uid 10001 asgard && chown asgard:asgard /workspace
COPY app ./app
USER asgard
EXPOSE 8000
CMD ["python", "-m", "app.start"]

FROM runtime AS development
USER root
COPY requirements-dev.lock .
RUN pip install --no-cache-dir --require-hashes -r requirements-dev.lock
COPY pyproject.toml .
COPY tests ./tests
COPY scripts ./scripts
COPY --chown=asgard:asgard openapi.json .
USER asgard
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--no-access-log"]

FROM runtime AS production
