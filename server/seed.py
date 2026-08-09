"""DEV-ONLY demo seed for FaceTrackAI.

Creates sample employees (with synthetic embeddings) and synthetic
attendance records for the last 14 days so Dashboard / Reports /
Analytics render real-looking data without completing a 15-image face
capture.

Usage (from the server/ directory, venv activated):

    python seed.py

The script is idempotent: existing employees are skipped, and attendance
is only generated for employees that have no records yet.
"""

import os
import random
from datetime import datetime, timedelta

import numpy as np

from config import Config
from errors import AppError
import database
from ai.face_recognition import invalidate_embedding_cache

SAMPLE_EMPLOYEES = [
    {"employee_id": "EMP1001", "name": "Aarav Sharma",   "department": "IT",          "position": "Backend Engineer"},
    {"employee_id": "EMP1002", "name": "Priya Patel",    "department": "HR",          "position": "HR Executive"},
    {"employee_id": "EMP1003", "name": "Rahul Verma",    "department": "Finance",     "position": "Accountant"},
    {"employee_id": "EMP1004", "name": "Sneha Iyer",     "department": "IT",          "position": "Frontend Engineer"},
    {"employee_id": "EMP1005", "name": "Arjun Nair",     "department": "Security",    "position": "Security Officer"},
    {"employee_id": "EMP1006", "name": "Kavya Reddy",    "department": "Finance",     "position": "Financial Analyst"},
    {"employee_id": "EMP1007", "name": "Vikram Singh",   "department": "IT",          "position": "DevOps Engineer"},
    {"employee_id": "EMP1008", "name": "Ananya Das",     "department": "HR",          "position": "Recruiter"},
]

# insightface buffalo_l embeddings are 512-dimensional.
EMBEDDING_DIM = 512
SEED_DAYS = 14


def seed_employees():
    created = 0
    for emp in SAMPLE_EMPLOYEES:
        if database.employees.find_one({"employee_id": emp["employee_id"]}):
            continue

        employee_id = emp["employee_id"]
        folder = os.path.join(Config.UPLOAD_FOLDER, employee_id)
        os.makedirs(folder, exist_ok=True)

        embedding_path = os.path.join(
            Config.EMBEDDING_FOLDER,
            f"{employee_id}.npy",
        )
        os.makedirs(Config.EMBEDDING_FOLDER, exist_ok=True)
        np.save(embedding_path, np.random.rand(EMBEDDING_DIM).astype(np.float32))

        database.employees.insert_one({
            "employee_id": employee_id,
            "name": emp["name"],
            "email": f"{employee_id.lower()}@example.com",
            "phone": f"9{random.randint(100000000, 999999999)}",
            "department": emp["department"],
            "position": emp["position"],
            "image_folder": folder,
            "images": [],
            "embedding_path": embedding_path,
            "created_at": datetime.utcnow(),
        })
        created += 1

    print(f"Seeded {created} new employee(s).")
    invalidate_embedding_cache()
    return created


def seed_attendance():
    inserted = 0
    sample_ids = {emp["employee_id"] for emp in SAMPLE_EMPLOYEES}
    employees = [
        emp for emp in database.employees.find()
        if emp["employee_id"] in sample_ids
    ]

    if not employees:
        print("No seeded employees to add attendance for.")
        return 0

    for employee in employees:
        employee_id = employee["employee_id"]
        name = employee["name"]
        department = employee["department"]
        position = employee.get("position")

        for days_ago in range(SEED_DAYS, -1, -1):
            date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

            if database.attendance.find_one({"employee_id": employee_id, "date": date}):
                continue

            # ~15% chance of being absent on a given day.
            if random.random() < 0.15:
                continue

            hour = random.randint(8, 11)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            time_str = f"{hour:02d}:{minute:02d}:{second:02d}"

            database.attendance.insert_one({
                "employee_id": employee_id,
                "name": name,
                "department": department,
                "position": position,
                "date": date,
                "time": time_str,
                "status": "Present",
            })
            inserted += 1

    print(f"Seeded {inserted} attendance record(s).")
    return inserted


if __name__ == "__main__":
    database.init_db()
    database.create_indexes()
    try:
        e = seed_employees()
        a = seed_attendance()
        print(f"Done: {e} employees, {a} attendance records.")
    except AppError as exc:
        print(f"Error: {exc.message}")
