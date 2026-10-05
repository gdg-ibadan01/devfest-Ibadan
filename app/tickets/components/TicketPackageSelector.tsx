import TicketPackageRow, { type TicketPackage } from './TicketPackageRow';

export interface TicketPackageSelectorProps {
  selectedPackageId: string;
  setSelectedPackageId: (val: string) => void;
  packages: TicketPackage[];
}

export default function TicketPackageSelector({
  selectedPackageId,
  setSelectedPackageId,
  packages,
}: Readonly<TicketPackageSelectorProps>) {
  return (
    <div className="w-full flex flex-col gap-3 mt-2">
      <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium">
        Kindly Select your Ticket Package
      </p>

      <div className="bg-[#FAF8F5] p-3 md:p-5 rounded-[12px] flex flex-col gap-3">
        {packages.map((pkg) => (
          <TicketPackageRow
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onSelect={setSelectedPackageId}
          />
        ))}
      </div>
    </div>
  );
}
