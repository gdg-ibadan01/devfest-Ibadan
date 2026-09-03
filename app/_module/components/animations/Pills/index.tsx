import { FC, useEffect, useState, CSSProperties } from 'react';
import Styles from './styles.module.scss';

interface iPills {
  text: string;
  bgColor?: string;
  padding?: string;
  randomAngle: number;
  handleRoute?: () => void;
}

const Pills: FC<iPills> = ({
  text,
  bgColor,
  padding,
  handleRoute,
  randomAngle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    const currentElement = document.getElementById(text);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [text]);

  return (
    <div
      id={text}
      className={`${Styles.animationWrapper} ${isVisible ? Styles.fallIn : ''} mb-[2rem] md:mb-[0rem]`}
      style={
        {
          '--rotate-angle': `${randomAngle}deg`,
        } as CSSProperties & Record<string, any>
      }
    >
      <div
        className={Styles.pillContainer}
        style={{
          background: bgColor,
          padding: padding,
        }}
        onClick={handleRoute}
      >
        <p>{text || 'NFT ARTIST'}</p>
      </div>
    </div>
  );
};

export default Pills;
