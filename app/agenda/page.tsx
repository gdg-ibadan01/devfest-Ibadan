'use client';
import { useState } from 'react';
import { agendaClass as Styles } from './agenda';
import { agendaData } from './AgendaData';
import AgendaTabs from './AgendaTabs';
import AgendaTable from './AgendaTable';
import { Calendar } from '../_module/components/icons';

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
              December 3rd & 4th, 2025, from 9:00 AM to 5:00 PM
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

        <AgendaTable
          data={activeDay === 'day1' ? agendaData.day1 : agendaData.day2}
        />
      </main>
    </div>
  );
}
