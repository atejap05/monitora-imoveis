"""Clerk JWT verification (RS256 via JWKS)."""

from __future__ import annotations

import os
from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException
from jwt import PyJWKClient

_jwks_client: PyJWKClient | None = None
_jwks_url: str | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client, _jwks_url
    issuer = os.environ.get("CLERK_ISSUER", "").strip().rstrip("/")
    if not issuer:
        raise HTTPException(
            status_code=500,
            detail="CLERK_ISSUER não configurado no servidor.",
        )
    jwks_url = f"{issuer}/.well-known/jwks.json"
    if _jwks_client is None or _jwks_url != jwks_url:
        _jwks_url = jwks_url
        _jwks_client = PyJWKClient(
            jwks_url,
            cache_keys=True,
            lifespan=3600,
            max_cached_keys=16,
        )
    return _jwks_client


def verify_clerk_token(token: str) -> str:
    """Validate JWT and return Clerk user id (`sub`)."""
    issuer = os.environ.get("CLERK_ISSUER", "").strip().rstrip("/")
    if not issuer:
        raise HTTPException(
            status_code=500,
            detail="CLERK_ISSUER não configurado no servidor.",
        )
    jwks_client = _get_jwks_client()
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=issuer,
            options={"verify_aud": False},
        )
    except jwt.exceptions.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado.",
        ) from e

    sub = payload.get("sub")
    if not isinstance(sub, str) or not sub.strip():
        raise HTTPException(status_code=401, detail="Token sem identificação de usuário.")
    return sub


def get_current_user_id(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail="Cabeçalho Authorization Bearer ausente.",
        )
    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token ausente.")
    return verify_clerk_token(token)
