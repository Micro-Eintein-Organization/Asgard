"""Container entry point with a validated platform port and graceful shutdown."""

import os


def runtime_arguments(port: str):
    if not port.isascii() or not port.isdecimal() or not 1024 <= int(port) <= 65535:
        raise ValueError("PORT must be an unprivileged TCP port.")
    return [
        "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", port,
        "--no-access-log", "--timeout-graceful-shutdown", "40",
    ]


if __name__ == "__main__":
    arguments = runtime_arguments(os.environ.get("PORT", "8000"))
    os.execvp(arguments[0], arguments)
