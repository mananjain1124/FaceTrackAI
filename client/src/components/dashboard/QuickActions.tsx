import { Download, Camera, UserPlus, FileText } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <button className="p-5 rounded-xl bg-blue-600 text-white flex flex-col items-center gap-2 hover:bg-blue-700">
          <UserPlus />
          Add User
        </button>

        <button className="p-5 rounded-xl bg-green-600 text-white flex flex-col items-center gap-2 hover:bg-green-700">
          <Camera />
          Start Camera
        </button>

        <button className="p-5 rounded-xl bg-purple-600 text-white flex flex-col items-center gap-2 hover:bg-purple-700">
          <Download />
          Export
        </button>

        <button className="p-5 rounded-xl bg-orange-600 text-white flex flex-col items-center gap-2 hover:bg-orange-700">
          <FileText />
          Reports
        </button>

      </div>

    </div>
  );
}