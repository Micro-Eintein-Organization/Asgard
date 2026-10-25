from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorBody(BaseModel):
    code: str
    message: str
    request_id: str


class APIError(Exception):
    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message


async def api_error(request: Request, error: APIError) -> JSONResponse:
    return JSONResponse(
        status_code=error.status,
        content=ErrorBody(
            code=error.code,
            message=error.message,
            request_id=request.state.request_id,
        ).model_dump(),
        headers={"WWW-Authenticate": "Bearer"} if error.status == 401 else {},
    )
