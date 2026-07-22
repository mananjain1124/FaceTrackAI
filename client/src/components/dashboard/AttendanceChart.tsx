import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", attendance: 280 },
  { day: "Tue", attendance: 295 },
  { day: "Wed", attendance: 310 },
  { day: "Thu", attendance: 300 },
  { day: "Fri", attendance: 325 },
  { day: "Sat", attendance: 260 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <h2 className="text-xl font-semibold mb-6">
        Weekly Attendance
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <Tooltip />

          <Line
            dataKey="attendance"
            stroke="#2563EB"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}