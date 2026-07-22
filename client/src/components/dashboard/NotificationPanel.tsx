import {
  Bell,
  UserPlus,
  Camera,
  TriangleAlert,
} from "lucide-react";

const notifications = [
  {
    icon: UserPlus,
    color: "text-blue-600",
    title: "New Employee Registered",
    time: "5 min ago",
  },
  {
    icon: Camera,
    color: "text-green-600",
    title: "Attendance Recorded",
    time: "10 min ago",
  },
  {
    icon: TriangleAlert,
    color: "text-red-500",
    title: "Unknown Face Detected",
    time: "18 min ago",
  },
];

export default function NotificationPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <div className="flex items-center gap-2 mb-6">

        <Bell className="text-yellow-500" />

        <h2 className="text-xl font-semibold">
          Notifications
        </h2>

      </div>

      <div className="space-y-5">

        {notifications.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex gap-4"
            >
              <Icon
                className={item.color}
                size={22}
              />

              <div>
                <h3 className="font-medium">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}