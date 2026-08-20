'use client';
import { useState } from 'react';
import { agendaClass as Styles } from './agenda';
import { agendaData } from './AgendaData';
import AgendaTabs from './AgendaTabs';
import AgendaTable from './AgendaTable';
import { Calendar } from '../_module/components/icons';

function Day1VirtualEvent() {
  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="bg-[#F8D8D8] border-[2px] border-[#1E1E1E] p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-normal text-[#1E1E1E] mb-3">
          DevFest Day 1 (Virtual)
        </h2>
        <p className="text-lg md:text-xl font-normal text-[#1E1E1E]">
          Virtual Panel session with Google Developer Experts
        </p>
      </div>
    </div>
  );
}

export default function Agenda() {
  const [activeDay, setActiveDay] = useState('day1');

  return (
    <div className={Styles.container}>
      <main className={Styles.main}>
        <header className={Styles.header}>
          <h2 className={Styles.headerHeading}>The Promised Agenda</h2>
          <section className={Styles.dateContainer}>
            <Calendar className="md:w-[98px] md:h-[98px] w-[53px] h-[53px]" />
            <p className={Styles.date}>
              November 28th & 29th, 2025, from 9:00 AM to 5:00 PM
            </p>
          </section>
          <p className={Styles.headerText}>
            Mark your calendar for a day filled with{' '}
            <span className={Styles.inspirationText}>inspiration,</span>{' '}
            <span className={Styles.innovationText}>innovation,</span>{' '}
            <span className={Styles.connectionText}>and connection.</span>
          </p>
        </header>

        <AgendaTabs activeDay={activeDay} setActiveDay={setActiveDay} />

        {activeDay === 'day1' ? (
          <Day1VirtualEvent />
        ) : (
          <AgendaTable data={agendaData} />
        )}
      </main>
    </div>
  );
}
