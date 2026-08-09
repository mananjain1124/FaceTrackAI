from pymongo import MongoClient

from config import Config

# ---------------------------------------------------------------------
# Lazy database handle.
#
# `init_db()` must be called before the app serves requests (see
# `app.create_app`). Services always access collections through this
# module (`database.employees`) so tests can re-initialize against an
# in-memory MongoDB between cases.
# ---------------------------------------------------------------------

client = None
db = None

admins = None
employees = None
attendance = None
settings = None


def init_db(uri=None, db_name=None):
    global client, db, admins, employees, attendance, settings

    client = MongoClient(uri or Config.MONGO_URI)
    db = client[db_name or Config.DATABASE_NAME]

    admins = db["admins"]
    employees = db["employees"]
    attendance = db["attendance"]
    settings = db["settings"]


def create_indexes():
    if employees is not None:
        employees.create_index("employee_id", unique=True)
        employees.create_index("name")

    if admins is not None:
        admins.create_index("email", unique=True)

    if attendance is not None:
        attendance.create_index([
            ("employee_id", 1),
            ("date", 1)
        ])
        attendance.create_index("date")
