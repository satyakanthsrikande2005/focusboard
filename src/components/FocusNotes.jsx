import { useState } from "react";
import { ChevronLeft, ChevronRight, Coffee, Sparkles, Target } from "lucide-react";

const NOTES = [
  {
    id: "priorities",
    icon: Target,
    heading: "Start with what matters",
    message:
      "Pick your three most important tasks before opening email. Small wins early build momentum for the day.",
  },
  {
    id: "deep-work",
    icon: Sparkles,
    heading: "Protect deep work",
    message:
      "Block 90 minutes for one task, silence notifications and work on a single thing until the timer ends.",
  },
  {
    id: "breaks",
    icon: Coffee,
    heading: "Rest is productive",
    message:
      "Step away for five minutes every hour. A short walk or stretch keeps your focus sharp all afternoon.",
  },
];

function FocusNotes() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index) => setActiveIndex((index + NOTES.length) % NOTES.length);
  const goPrevious = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <section
      className="focus-notes"
      aria-roledescription="carousel"
      aria-labelledby="focus-notes-title"
      onKeyDown={handleKeyDown}
    >
      <div className="focus-notes__top">
        <h2 id="focus-notes-title" className="focus-notes__label">
          Focus Notes
        </h2>
        <span className="focus-notes__counter" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(NOTES.length).padStart(2, "0")}
        </span>
      </div>

      <div className="focus-notes__viewport">
        <div
          className="focus-notes__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {NOTES.map(({ id, icon: Icon, heading, message }, index) => {
            const isActive = index === activeIndex;
            return (
              <article
                key={id}
                className="focus-notes__slide"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${NOTES.length}`}
                aria-hidden={!isActive}
                inert={isActive ? undefined : true}
              >
                <span className="focus-notes__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3 className="focus-notes__heading">{heading}</h3>
                <p className="focus-notes__message">{message}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="focus-notes__controls">
        <div className="focus-notes__dots">
          {NOTES.map(({ id }, index) => (
            <button
              key={id}
              type="button"
              className={`focus-notes__dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Go to note ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <div className="focus-notes__arrows">
          <button
            type="button"
            className="focus-notes__arrow"
            aria-label="Previous note"
            onClick={goPrevious}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="focus-notes__arrow"
            aria-label="Next note"
            onClick={goNext}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="visually-hidden" aria-live="polite">
        Note {activeIndex + 1} of {NOTES.length}: {NOTES[activeIndex].heading}
      </p>
    </section>
  );
}

export default FocusNotes;
