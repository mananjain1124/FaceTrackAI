interface Props {
  current: number;
  total: number;
}

export default function CaptureProgress({
  current,
  total,
}: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="rounded-2xl border bg-white shadow-lg p-5">

      <div className="flex items-center justify-between mb-3">

        <div>

          <h3 className="text-lg font-bold">
            Face Capture Progress
          </h3>

          <p className="text-sm text-slate-500">
            Auto capturing face images
          </p>

        </div>

        <div className="text-right">

          <p className="text-2xl font-bold text-blue-600">
            {percent}%
          </p>

          <p className="text-sm text-slate-500">
            {current} / {total}
          </p>

        </div>

      </div>

      {/* Progress Bar */}

      <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 transition-all duration-500"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

      <div className="mt-4 flex justify-between text-sm text-slate-500">

        <span>0</span>

        <span>Capture Started</span>

        <span>{total}</span>

      </div>

      {current === total && (
        <div className="mt-4 rounded-xl bg-green-100 p-3">

          <p className="font-semibold text-green-700">
            ✅ All images captured successfully
          </p>

        </div>
      )}

    </div>
  );
}