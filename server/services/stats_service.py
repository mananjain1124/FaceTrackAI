"""Dashboard stats service: aggregates real data for the Dashboard page."""

from datetime import datetime, timedelta

import database


def _date_str(days_ago=0):
    return (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")


def dashboard_stats():
    today = _date_str(0)

    total_employees = database.employees.count_documents({})

    present_today_records = list(
        database.attendance.find({"date": today})
    )
    present_today = len(present_today_records)
    distinct_present_today = len({
        record.get("employee_id")
        for record in present_today_records
    })

    not_marked_today = max(total_employees - distinct_present_today, 0)

    present_rate = round(
        (distinct_present_today / total_employees) * 100, 1
    ) if total_employees else 0.0

    # Last 7 days trend.
    weekly_trend = []
    for days_ago in range(6, -1, -1):
        date = _date_str(days_ago)
        count = database.attendance.count_documents({"date": date})
        weekly_trend.append({
            "date": date,
            "present": count,
        })

    # Department distribution for today (falls back to all-time counts).
    department_counts = {}
    for record in present_today_records:
        department = record.get("department", "Unknown")
        department_counts[department] = (
            department_counts.get(department, 0) + 1
        )

    if not department_counts:
        pipeline = database.attendance.aggregate([
            {"$group": {
                "_id": "$department",
                "present": {"$sum": 1},
            }},
            {"$sort": {"present": -1}},
        ])
        department_counts = {
            item["_id"] or "Unknown": item["present"]
            for item in pipeline
        }

    recent_attendance = list(
        database.attendance.find().sort(
            [("date", -1), ("time", -1)]
        ).limit(5)
    )
    for record in recent_attendance:
        record["_id"] = str(record["_id"])

    return {
        "success": True,
        "today": today,
        "total_employees": total_employees,
        "present_today": present_today,
        "distinct_present_today": distinct_present_today,
        "not_marked_today": not_marked_today,
        "present_rate": present_rate,
        "weekly_trend": weekly_trend,
        "department_distribution": [
            {"department": key, "present": value}
            for key, value in sorted(
                department_counts.items(),
                key=lambda item: item[1],
                reverse=True,
            )
        ],
        "recent_attendance": recent_attendance,
    }
