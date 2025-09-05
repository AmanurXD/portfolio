import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const IMAGES = [
  "https://assets.codepen.io/16327/portrait-number-1.png",
  "https://assets.codepen.io/16327/portrait-number-2.png",
  "https://assets.codepen.io/16327/portrait-number-3.png",
  "https://assets.codepen.io/16327/portrait-number-4.png",
  "https://assets.codepen.io/16327/portrait-number-5.png",
];

// duplicate for the ferris-wheel feel
const DATA = [...IMAGES, ...IMAGES];

const Projects = () => {
  const rootRef = useRef(null);
  const galleryRef = useRef(null);
  const cardsRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const gallery = galleryRef.current;
      const list = cardsRef.current;
      const cards = gsap.utils.toArray(list.querySelectorAll("li"));
      if (!cards.length) return;

      const spacing = 0.12; // same as CodePen stagger
      const snap = gsap.utils.snap(spacing);

      // fade-in like the pen
      gsap.to(gallery.querySelectorAll("img"), { opacity: 1, delay: 0.1, duration: 0.5 });

      // ----- Build the CodePen raw sequence & seamless loop -----
      function buildSeamlessLoop(items, spacing) {
        const overlap = Math.ceil(1 / spacing);
        const startTime = items.length * spacing + 0.5;
        const loopTime = (items.length + overlap) * spacing + 1;

        const raw = gsap.timeline({ paused: true });
        const loop = gsap.timeline({
          paused: true,
          repeat: -1, // infinite
          onRepeat() {
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          },
        });

        const l = items.length + overlap * 2;
        for (let i = 0; i < l; i++) {
          const index = i % items.length;
          const item = items[index];
          const time = i * spacing;

          raw
            .fromTo(
              item,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                zIndex: 100,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: "power1.in",
                immediateRender: false,
              },
              time
            )
            .fromTo(
              item,
              { xPercent: 400 },
              { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
              time
            );
        }

        raw.time(startTime);
        loop
          .to(raw, {
            time: loopTime,
            duration: loopTime - startTime,
            ease: "none",
          })
          .fromTo(
            raw,
            { time: overlap * spacing + 1 },
            {
              time: startTime,
              duration: startTime - (overlap * spacing + 1),
              immediateRender: false,
              ease: "none",
            }
          );

        return loop;
      }

      const loopTL = buildSeamlessLoop(cards, spacing);

      // Reusable tween we update on demand to move the loop playhead
      const scrub = gsap.to(loopTL, {
        totalTime: 0,
        duration: 0.5,
        ease: "power3",
        paused: true,
      });

      // Smoothly move to a desired totalTime
      const scrubTo = (totalTime) => {
        // Because loopTL has repeat:-1, totalTime can grow forever – no reversal/bounce.
        scrub.vars.totalTime = totalTime;
        scrub.invalidate().restart();
      };

      // ------------- Input limited to the slider area only -------------
      // Hover gating (optional, but nice UX)
      let hovering = false;
      const onEnter = () => (hovering = true);
      const onLeave = () => (hovering = false);
      gallery.addEventListener("mouseenter", onEnter);
      gallery.addEventListener("mouseleave", onLeave);

      // Wheel on the UL only (prevents page scroll while over cards)
      const onWheel = (e) => {
        if (!hovering) return; // outside = let page scroll normally
        e.preventDefault();
        const delta = (e.deltaY || e.wheelDelta || -e.detail) * 0.0008; // tune speed
        scrubTo(scrub.vars.totalTime + delta);
      };
      list.addEventListener("wheel", onWheel, { passive: false });

      // Touch drag (basic vertical drag → horizontal scrub)
      let lastY = null;
      const onTouchStart = (e) => {
        if (!hovering) return;
        lastY = e.touches[0].clientY;
      };
      const onTouchMove = (e) => {
        if (!hovering || lastY == null) return;
        e.preventDefault();
        const y = e.touches[0].clientY;
        const dy = lastY - y;
        lastY = y;
        scrubTo(scrub.vars.totalTime + dy * 0.0012);
      };
      const onTouchEnd = () => (lastY = null);
      list.addEventListener("touchstart", onTouchStart, { passive: true });
      list.addEventListener("touchmove", onTouchMove, { passive: false });
      list.addEventListener("touchend", onTouchEnd, { passive: true });

      // Prev/Next buttons step exactly one "card"
      const onPrev = () => scrubTo(scrub.vars.totalTime - spacing);
      const onNext = () => scrubTo(scrub.vars.totalTime + spacing);
      prevRef.current.addEventListener("click", onPrev);
      nextRef.current.addEventListener("click", onNext);

      // Optional: click a card to center it (snap to its slot)
      const clickHandlers = cards.map((card, i) => {
        const fn = () => {
          const target = snap(i * spacing + 0.5);
          gsap.to(scrub, { totalTime: target, duration: 0.8, ease: "power3.inOut" });
        };
        card.addEventListener("click", fn);
        return fn;
      });

      // cleanup
      return () => {
        gallery.removeEventListener("mouseenter", onEnter);
        gallery.removeEventListener("mouseleave", onLeave);
        list.removeEventListener("wheel", onWheel);
        list.removeEventListener("touchstart", onTouchStart);
        list.removeEventListener("touchmove", onTouchMove);
        list.removeEventListener("touchend", onTouchEnd);
        prevRef.current?.removeEventListener("click", onPrev);
        nextRef.current?.removeEventListener("click", onNext);
        clickHandlers.forEach((fn, i) => cards[i].removeEventListener("click", fn));
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={rootRef} className="relative z-10 py-20">
      <h2 className="text-5xl font-bold text-center text-white mb-10">My Projects</h2>

      {/* same DOM structure as the pen */}
      <div className="gallery" ref={galleryRef}>
        <ul className="cards" ref={cardsRef}>
          {DATA.map((src, i) => (
            <li key={i}>
              <img src={src} alt="" />
            </li>
          ))}
        </ul>

        <div className="actions">
          <button className="prev" ref={prevRef}>Prev</button>
          <button className="next" ref={nextRef}>Next</button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
