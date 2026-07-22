export default function RecentAttendance() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <h2 className="text-xl font-bold mb-5">
        Recent Attendance
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">Employee</th>

            <th>Time</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          <tr className="border-b">

            <td className="py-4">John Smith</td>

            <td>09:02 AM</td>

            <td>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Present
              </span>
            </td>

          </tr>

          <tr className="border-b">

            <td className="py-4">Sarah Wilson</td>

            <td>09:15 AM</td>

            <td>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Present
              </span>
            </td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}