export default function ScrollIndicator() {
  return (
    <div
      className="hero__scroll"
      data-hero-scroll-cue
      data-in-view="false"
      role="img"
      aria-label="Scroll to explore"
    >
      <span>SCROLL TO EXPLORE</span>
      <svg
        aria-hidden="true"
        className="hero__scroll-arrow"
        viewBox="0 0 18 28"
        fill="none"
      >
        <path
          d="M9 2v23m-7-7 7 7 7-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}
