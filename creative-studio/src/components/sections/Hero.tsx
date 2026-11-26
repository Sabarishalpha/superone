import Image from "next/image";
import MagneticButton from "../ui/MagneticButton";
import ScrollIndicator from "../ui/ScrollIndicator";
import HeroContent from "./HeroContent";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="hero__ambient" aria-hidden="true" />
      <HeroContent>
        <div className="hero__frame">
          <div className="hero__main">
            <div className="hero__copy" data-hero-copy>
              <p className="hero__eyebrow" data-hero-kicker>
                Independent creative digital studio
              </p>
              <h1 className="hero__heading" id="hero-heading">
                <span className="hero__line-mask">
                  <span className="hero__line" data-hero-title-line>
                    DESIGN.
                  </span>
                </span>
                <span className="hero__line-mask">
                  <span className="hero__line" data-hero-title-line>
                    DISRUPT.
                  </span>
                </span>
                <span className="hero__line-mask">
                  <span
                    className="hero__line hero__line--accent"
                    data-hero-title-line
                  >
                    DOMINATE.
                  </span>
                </span>
              </h1>
            </div>

            <figure className="hero__visual" data-hero-visual>
              <div className="hero__visual-glow" data-hero-glow aria-hidden="true" />
              <div
                className="hero__visual-stage"
                data-hero-pointer
                data-hero-stage
              >
                <div className="hero__logo-float">
                  <Image
                    className="hero__logo"
                    src="/images/logo.png"
                    alt="Original lightning shield logo"
                    width={840}
                    height={768}
                    sizes="(max-width: 767px) 74vw, (max-width: 1100px) 42vw, 560px"
                    preload
                    data-hero-logo
                  />
                </div>
              </div>
            </figure>

            <div className="hero__support">
              <p className="hero__description" data-hero-description>
                We build powerful websites, create high-impact campaigns and
                turn digital attention into business growth.
              </p>
              <div className="hero__actions">
                <MagneticButton
                  href="#contact"
                  className="magnetic-button--hero"
                  data-hero-scroll="true"
                  data-hero-action
                >
                  START A PROJECT
                </MagneticButton>
                <a
                  className="hero__secondary"
                  href="#work"
                  data-hero-scroll="true"
                  data-hero-action
                >
                  <span>EXPLORE OUR WORK</span>
                  <svg
                    aria-hidden="true"
                    className="hero__secondary-arrow"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.5 15.5 15 5m0 0H6m9 0v9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <footer className="hero__footer" data-hero-footer>
            <div className="hero__footer-copy">
              <p>WEB DESIGN / ADS / DIGITAL GROWTH</p>
              <p>BUILT FOR THE NEXT GENERATION.</p>
            </div>
            <ScrollIndicator />
          </footer>
        </div>
      </HeroContent>
    </section>
  );
}
