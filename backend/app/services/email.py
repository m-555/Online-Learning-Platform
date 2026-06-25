import logging

from app.core.config import settings

logger = logging.getLogger("aula.email")


def send_verification_email(email: str, token: str) -> None:
    """Development email backend: log the verification link to the console.

    In production this is replaced by a real transactional email provider.
    """
    link = f"{settings.frontend_url}/verify?token={token}"
    logger.info("Email verification link for %s: %s", email, link)
