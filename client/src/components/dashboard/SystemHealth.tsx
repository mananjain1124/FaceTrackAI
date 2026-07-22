export default function SystemHealth() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6 h-[320px]">

      <h2 className="text-xl font-bold mb-6">
        System Health
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span>GPU</span>
          <span className="text-green-600 font-semibold">
            Active
          </span>
        </div>

        <div className="flex justify-between">
          <span>CPU</span>
          <span>27%</span>
        </div>

        <div className="flex justify-between">
          <span>RAM</span>
          <span>43%</span>
        </div>

        <div className="flex justify-between">
          <span>Recognition Accuracy</span>
          <span>98.7%</span>
        </div>

        <div className="flex justify-between">
          <span>MongoDB</span>
          <span className="text-green-600">
            Connected
          </span>
        </div>

      </div>

    </div>
  );
}