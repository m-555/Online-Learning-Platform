"""Adaptive placement-test scoring.

A faithful port of the original 1PL Rasch (item-response-theory) engine: a learner's
ability ``theta`` is estimated by Newton-Raphson MLE from the answered items, then mapped
to a CEFR level. Difficulties ``b`` come from the calibrated question bank.
"""

from __future__ import annotations

import json
import math
from functools import lru_cache
from pathlib import Path

_QUESTIONS_PATH = Path(__file__).resolve().parent.parent / "data" / "placement_questions.json"


@lru_cache
def load_questions() -> list[dict]:
    with _QUESTIONS_PATH.open(encoding="utf-8") as fh:
        raw = json.load(fh)
    # Assign a stable id (1-based) and order easiest → hardest so the test ramps up.
    questions = sorted(raw, key=lambda q: q["difficulty"])
    for index, question in enumerate(questions, start=1):
        question["id"] = index
    return questions


def p_correct(theta: float, b: float) -> float:
    """1PL Rasch probability of a correct answer."""
    return 1.0 / (1.0 + math.exp(-(theta - b)))


def estimate_theta(responses: list[tuple[float, bool]]) -> float:
    """Estimate ability from (difficulty, was_correct) pairs via Newton-Raphson MLE."""
    if not responses:
        return 0.0
    # All-correct / all-wrong have no finite MLE; clamp to the bank's range.
    correct = sum(1 for _, ok in responses if ok)
    if correct == 0:
        return -2.5
    if correct == len(responses):
        return 2.5

    theta = 0.0
    for _ in range(20):
        gradient = 0.0
        hessian = 0.0
        for b, ok in responses:
            p = p_correct(theta, b)
            gradient += (1.0 if ok else 0.0) - p
            hessian += -p * (1 - p)
        if abs(hessian) < 1e-6:
            break
        step = gradient / hessian
        theta -= step
        if abs(step) < 1e-4:
            break
    return max(-3.0, min(3.0, theta))


def theta_to_cefr(theta: float) -> str:
    if theta < -1.5:
        return "A1"
    if theta < -0.5:
        return "A2"
    if theta < 0.5:
        return "B1"
    if theta < 1.5:
        return "B2"
    if theta < 2.5:
        return "C1"
    return "C2"
