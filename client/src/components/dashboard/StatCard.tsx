interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>

          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${color}`}
        >
          {Icon && <Icon size={28} />}
        </div>
      </div>
    </div>
  );
}