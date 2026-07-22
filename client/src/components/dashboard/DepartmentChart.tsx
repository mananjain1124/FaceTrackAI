export default function DepartmentChart() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6 h-[320px]">

      <h2 className="text-xl font-bold mb-6">
        Department Distribution
      </h2>

      <div className="flex flex-col gap-5">

        <div>
          IT
          <div className="bg-slate-200 h-3 rounded-full mt-2">
            <div className="bg-blue-600 h-3 rounded-full w-[45%]"></div>
          </div>
        </div>

        <div>
          HR
          <div className="bg-slate-200 h-3 rounded-full mt-2">
            <div className="bg-green-600 h-3 rounded-full w-[20%]"></div>
          </div>
        </div>

        <div>
          Finance
          <div className="bg-slate-200 h-3 rounded-full mt-2">
            <div className="bg-yellow-500 h-3 rounded-full w-[35%]"></div>
          </div>
        </div>

      </div>

    </div>
  );
}