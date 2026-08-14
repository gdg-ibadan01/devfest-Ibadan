interface StatCardProps {
  label: string;
  value: string;
  bgClass: string;
}

export default function StatCard({ label, value, bgClass }: StatCardProps) {
  return (
    <div className={`${bgClass} rounded-2xl px-6 py-6`}>
      <p className="text-[13px] font-medium text-black/70 mb-3 leading-none">
        {label}
      </p>
      <p className="text-[32px] font-bold text-black leading-none">{value}</p>
    </div>
  );
}
