import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Calendar } from '../_module/components/icons';
import { agendaClass as Styles } from './agenda';
import Day1AgendaView from './Day1AgendaView';

export default function Agenda() {
  return (
    <div className={Styles.container}>
      <main className={Styles.main}>
        <header className={Styles.header}>
          <h2 className={Styles.headerHeading}>The Promised Agenda</h2>
          <section className={Styles.dateContainer}>
            <Calendar className="md:w-[98px] md:h-[98px] w-[53px] h-[53px]" />
            <p className={Styles.date}>
              Saturday, November 21st, 2026, from 8:30 AM to 5:30 PM
            </p>
          </section>
          <p className={Styles.headerText}>
            Mark your calendar for a day filled with{' '}
            <span className={Styles.inspirationText}>inspiration,</span>{' '}
            <span className={Styles.innovationText}>innovation,</span>{' '}
            <span className={Styles.connectionText}>and connection.</span>
          </p>
          <Link
            href="/schedule"
            className="mt-6 inline-block text-center rounded-[100px] bg-white text-[#1E1E1E] border-2 border-[#1E1E1E] font-medium text-sm md:text-base px-5 py-2.5 transition-colors hover:bg-[#FFE7A5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-core-blue"
          >
            Not sure where to start? Get personalized picks
            <ArrowRight
              size={16}
              aria-hidden
              className="inline ml-1.5 align-[-3px]"
            />
          </Link>
        </header>

        <Day1AgendaView />
      </main>
    </div>
  );
}
