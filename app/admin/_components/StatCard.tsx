interface StatCardProps {
  label: string;
  value: string;
  bgClass: string;
}

export default function StatCard({ label, value, bgClass }: StatCardProps) {
  return (
    <div className={`${bgClass} rounded-xl px-5 py-4`}>
      <p className="text-[11px] font-medium text-black/60 mb-2 leading-none">
        {label}
      </p>
      <p className="text-[26px] font-bold text-black leading-none">{value}</p>
    </div>
  );
}
