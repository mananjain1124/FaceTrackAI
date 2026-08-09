"""Settings service.

Settings are stored as a single document (`_id: "app"`) in the `settings`
collection. Missing keys fall back to defaults. The current values are kept
in an in-memory cache so the recognition hot path does not hit MongoDB on
every scan; `update()` refreshes the cache.
"""

import threading

import database
from config import Config
from errors import AppError

DEFAULTS = {
    "recognition_threshold": Config.RECOGNITION_THRESHOLD,
    "duplicate_window_seconds": 0,
    "organization_name": Config.ORG_NAME,
    "work_start_hour": Config.WORK_START_HOUR,
    "work_end_hour": Config.WORK_END_HOUR,
}

# Value validators keyed by setting name: (validator, coerce)
_VALIDATORS = {
    "recognition_threshold": (
        lambda v: isinstance(v, (int, float)) and 0 < v <= 1,
        float,
    ),
    "duplicate_window_seconds": (
        lambda v: isinstance(v, (int, float)) and v >= 0,
        int,
    ),
    "organization_name": (
        lambda v: isinstance(v, str) and 0 < len(v.strip()) <= 120,
        lambda v: v.strip(),
    ),
    "work_start_hour": (
        lambda v: isinstance(v, (int, float)) and 0 <= v <= 23,
        int,
    ),
    "work_end_hour": (
        lambda v: isinstance(v, (int, float)) and 0 <= v <= 23,
        int,
    ),
}

_cache = None
_lock = threading.Lock()


def _load_from_db():
    doc = database.settings.find_one({"_id": "app"})
    values = dict(DEFAULTS)
    if doc:
        values.update({
            key: value
            for key, value in doc.get("settings", {}).items()
            if key in DEFAULTS
        })
    return values


def get_all():
    global _cache
    with _lock:
        if _cache is None:
            _cache = _load_from_db()
        return dict(_cache)


def get(key, default=None):
    return get_all().get(key, default)


def update(partial):
    """Validate and persist a partial settings update.

    Returns the full merged settings object.
    """
    if not isinstance(partial, dict):
        raise AppError("Settings payload must be an object", 400)

    unknown = set(partial) - set(DEFAULTS)
    if unknown:
        raise AppError(
            f"Unknown settings key(s): {', '.join(sorted(unknown))}",
            400,
        )

    normalized = {}
    for key, raw_value in partial.items():
        valid, coerce = _VALIDATORS[key]
        if not valid(raw_value):
            raise AppError(f"Invalid value for setting '{key}'", 400)
        normalized[key] = coerce(raw_value)

    current = _load_from_db()
    current.update(normalized)

    database.settings.update_one(
        {"_id": "app"},
        {"$set": {"settings": current}},
        upsert=True,
    )

    global _cache
    with _lock:
        _cache = current

    return dict(current)
