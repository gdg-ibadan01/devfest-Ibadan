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
        </header>

        <Day1AgendaView />
      </main>
    </div>
  );
}
