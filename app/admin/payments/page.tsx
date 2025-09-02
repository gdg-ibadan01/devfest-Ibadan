'use client';

import React, { Fragment } from 'react';
import { AdminClass as styles } from '../styles/admin.classes';
import AttendeesList from '../components/AttendeesList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import CheckCircleIcon from '@/app/_module/components/icons/CheckCircleIcon';
import ExportIcon from '@/app/_module/components/icons/ExportIcon';
import AddAttendeesModal from '../components/AddAttendeesModal';

const Page = () => {
  const [day, setDay] = React.useState('Day');
  const [status, setStatus] = React.useState('All');

  const days = ['Day', 'Sat + Fri', 'Sat', 'Fri'];
  const statuses = ['All', 'Successful', 'Pending', 'Failed'];
  const exports = ['CSV', 'PDF', 'Excel'];
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h3 className={styles.title}>all attendees</h3>
          <div className={styles.searchInputContainer}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Search by name/email/code"
                className={styles.searchInput}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild className={styles.dropdown}>
                  <button className="flex items-center justify-between">
                    {day} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  {days.map((d) => (
                    <DropdownMenuItem
                      key={d}
                      onClick={() => setDay(d)}
                      className="flex items-center text-[#474C52] text-[14px] font-normal justify-between"
                    >
                      {d}
                      {day === d && <CheckCircleIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className={styles.dropdown}>
                  <button className="flex items-center justify-between">
                    {status} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  {statuses.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setStatus(s)}
                      className="flex items-center text-[#474C52] text-[14px] font-normal justify-between"
                    >
                      {s}
                      {status === s && <CheckCircleIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={styles.actionBtnsContainer}>
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={styles.exportBtn}>
                    <ExportIcon /> <span>Export</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {exports.map((e) => (
                    <DropdownMenuItem
                      key={e}
                      onClick={() => alert(`Exporting as ${e}`)}
                      className="text-[#474C52] text-[14px] font-normal"
                    >
                      {e}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button className={styles.addBtn} onClick={() => setOpen(true)}>
                Add attendee
              </button>
            </div>
          </div>
          <AttendeesList />
        </div>
      </div>
      <AddAttendeesModal open={open} onOpenChange={setOpen} />
    </Fragment>
  );
};

export default Page;
