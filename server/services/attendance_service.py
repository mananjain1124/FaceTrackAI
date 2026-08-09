"""Attendance service: query and aggregation helpers used by the
attendance list, Reports, and Analytics pages.
"""

from datetime import datetime, timedelta

import database
from errors import AppError


def _validate_date_range(from_date, to_date):
    try:
        start = datetime.strptime(from_date, "%Y-%m-%d")
        end = datetime.strptime(to_date, "%Y-%m-%d")
    except (ValueError, TypeError):
        raise AppError(
            "Invalid date format; expected YYYY-MM-DD",
            400,
        )

    if start > end:
        raise AppError("'from' date must be before 'to' date", 400)

    return start, end


def get_today(date_str=None):
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")

    try:
        datetime.strptime(date_str, "%Y-%m-%d")
    except (ValueError, TypeError):
        raise AppError(
            "Invalid date format; expected YYYY-MM-DD",
            400,
        )

    records = list(
        database.attendance.find({"date": date_str}).sort("time", -1)
    )
    for record in records:
        record["_id"] = str(record["_id"])

    return {
        "success": True,
        "date": date_str,
        "count": len(records),
        "records": records,
    }


def _match_filter(start, end, department):
    match = {
        "date": {
            "$gte": start.strftime("%Y-%m-%d"),
            "$lte": end.strftime("%Y-%m-%d"),
        }
    }
    if department and department != "All":
        match["department"] = department
    return match


def summary(from_date, to_date, department=None):
    if not from_date or not to_date:
        raise AppError("'from' and 'to' dates are required", 400)

    start, end = _validate_date_range(from_date, to_date)
    match = _match_filter(start, end, department)

    records = list(database.attendance.find(match))
    if not records:
        return {
            "success": True,
            "from": from_date,
            "to": to_date,
            "department": department or "All",
            "total_present": 0,
            "distinct_employees": 0,
            "per_day": [],
            "per_department": [],
            "per_hour": [],
            "per_employee": [],
        }

    per_day = {}
    per_department = {}
    per_hour = {}
    per_employee = {}

    for record in records:
        date = record["date"]
        department_name = record.get("department", "Unknown")
        hour = int(record.get("time", "00:00:00").split(":")[0])
        employee_id = record.get("employee_id", "unknown")
        name = record.get("name", employee_id)

        per_day[date] = per_day.get(date, 0) + 1
        per_department[department_name] = (
            per_department.get(department_name, 0) + 1
        )
        per_hour[hour] = per_hour.get(hour, 0) + 1

        emp = per_employee.setdefault(employee_id, {
            "employee_id": employee_id,
            "name": name,
            "present": 0,
        })
        emp["present"] += 1

    # Fill every day in the range so charts have continuous series.
    full_range = []
    current = start
    while current <= end:
        date = current.strftime("%Y-%m-%d")
        full_range.append({
            "date": date,
            "present": per_day.get(date, 0),
        })
        current += timedelta(days=1)

    return {
        "success": True,
        "from": from_date,
        "to": to_date,
        "department": department or "All",
        "total_present": len(records),
        "distinct_employees": len(per_employee),
        "per_day": full_range,
        "per_department": [
            {"department": key, "present": value}
            for key, value in sorted(
                per_department.items(),
                key=lambda item: item[1],
                reverse=True,
            )
        ],
        "per_hour": [
            {"hour": key, "present": per_hour.get(key, 0)}
            for key in range(0, 24)
            if per_hour.get(key, 0) > 0
        ],
        "per_employee": sorted(
            per_employee.values(),
            key=lambda item: item["present"],
            reverse=True,
        ),
    }
