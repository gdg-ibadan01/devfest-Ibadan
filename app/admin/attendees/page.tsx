'use client';

import React, { Fragment } from 'react';
import { AdminClass as styles } from '../styles/admin.classes';
import AttendeesList from '../components/AttendeesList';
import ExportIcon from '../../_module/components/icons/ExportIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import CheckCircleIcon from '../../_module/components/icons/CheckCircleIcon';
import AddAttendeesModal from '../components/AddAttendeesModal';

const AttendeesPage = () => {
  const [day, setDay] = React.useState('Day');
  const [status, setStatus] = React.useState('All');
  const [open, setOpen] = React.useState<boolean>(false);

  const days = ['Day', 'Sat + Fri', 'Sat', 'Fri'];
  const statuses = ['All', 'Successful', 'Pending', 'Failed'];
  const exports = ['CSV', 'PDF', 'Excel'];

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
                    {day} <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  {days.map((d) => (
                    <DropdownMenuItem
                      key={d}
                      onClick={() => setDay(d)}
                      className="flex items-center justify-between text-[14px] font-normal text-[#474C52]"
                    >
                      {d}
                      {day === d && <CheckCircleIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className={styles.dropdown}>
                  <button className="flex items-center justify-between">
                    {status} <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  {statuses.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setStatus(s)}
                      className="flex items-center justify-between text-[14px] font-normal text-[#474C52]"
                    >
                      {s}
                      {status === s && <CheckCircleIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={styles.actionBtnsContainer}>
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
                      className="text-[14px] font-normal text-[#474C52]"
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

export default AttendeesPage;
