"use client";

import { KIcon, KumbaAppShell, LiveFigure } from "./LiveKumbaFrame";
import "./live-plan.css";
import "./live-posts.css";
import "./live-iterations.css";

/**
 * The two rejected directions from the Copilot case study, rebuilt in Kumba's
 * design system for the "What changed along the way" cards. They are static:
 * the case study shows them as captured images (public/work/copilot/iterations).
 * Recapture with scripts in the scratchpad if they change.
 */

const EVENTS = [
  { month: "AUG", day: "02", image: "/work/copilot/live/event-friendship.webp", title: "Friendship Day", subtitle: ["Celebrate the people who show up.", "Tag-a-friend posts and giveaways."] },
  { month: "AUG", day: "15", image: "/work/copilot/live/event-independence.webp", title: "Independence Day", subtitle: ["Patriotic retail & celebration.", "Tricolour promos and pride moments."] },
  { month: "AUG", day: "28", image: "/work/copilot/live/event-rakhi.webp", title: "Raksha Bandhan", subtitle: ["Gifting for brothers and sisters.", "Rakhi bundles and family moments."] },
];

const MORE_EVENTS = [
  { date: "Aug 19", title: "World Photography Day" },
  { date: "Aug 29", title: "National Sports Day" },
  { date: "Sep 05", title: "Teachers’ Day" },
  { date: "Sep 14", title: "Ganesh Chaturthi" },
];

/** First Copilot: the occasion is the only way in. */
export function EventLedScreen() {
  return (
    <LiveFigure caption="Event-led Copilot" hint="" url="kumba.ai/copilot">
      <KumbaAppShell>
        <div className="lb-scroll">
          <div className="lb-column">
            <div className="lb-hero">
              <p className="lb-eyebrow">✦ Never miss a moment</p>
              <p className="lb-title">
                <span className="lb-title__brand">Social</span> Media Copilot
              </p>
              <p className="lb-lead">
                Pick an upcoming occasion and get <b>ready-to-post</b> content for it.
              </p>
            </div>

            <div className="li-month">
              <span className="li-month__nav" aria-hidden>
                <KIcon name="arrow-left-01-round" className="lb-icon--20" />
              </span>
              <p>
                <KIcon name="calendar-03" className="lb-icon--20" />
                August 2026
              </p>
              <span className="li-month__nav" aria-hidden>
                <KIcon name="arrow-right-01-round" className="lb-icon--20" />
              </span>
            </div>

            <div className="lb-events">
              {EVENTS.map((event) => (
                <article key={event.day} className="lb-event">
                  <div className="lb-event__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image} alt="" />
                    <span className="lb-event__date">
                      <small>{event.month}</small>
                      {event.day}
                    </span>
                  </div>
                  <div className="lb-event__body">
                    <p className="lb-event__title">{event.title}</p>
                    <p className="lb-event__sub">
                      {event.subtitle[0]}
                      <br />
                      {event.subtitle[1]}
                    </p>
                  </div>
                  <div className="lb-event__foot">
                    <span>▣ 4 posts</span>
                    <span className="lb-build">
                      Generate posts
                      <KIcon name="arrow-up-right-01-round" className="lb-icon--16" />
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="li-list">
              <p className="li-list__label">More this season</p>
              {MORE_EVENTS.map((event) => (
                <div key={event.title} className="li-list__row">
                  <span className="li-list__date">{event.date}</span>
                  <span className="li-list__title">{event.title}</span>
                  <span className="lb-build">
                    Generate
                    <KIcon name="arrow-up-right-01-round" className="lb-icon--16" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </KumbaAppShell>
    </LiveFigure>
  );
}

const POSTS = [
  { day: 1, title: "A familiar hair-fall moment.", date: "Mon, 2 Nov", time: "09:30", video: true },
  { day: 2, title: "Meet your wash-day essentials.", date: "Tue, 3 Nov", time: "11:00", video: false },
  { day: 3, title: "A little care in your everyday routine.", date: "Wed, 4 Nov", time: "18:00", video: true },
  { day: 4, title: "Make room for a little hair care.", date: "Thu, 5 Nov", time: "10:00", video: false },
  { day: 5, title: "Your next wash day starts here.", date: "Fri, 6 Nov", time: "09:30", video: false },
];

/** Generate-first: the brief goes straight to finished posts, no plan to correct. */
export function GenerateFirstScreen() {
  return (
    <LiveFigure caption="Generate-first Copilot" hint="" url="kumba.ai/copilot/posts">
      <KumbaAppShell>
        <div className="lp-body">
          <div className="lb-scroll">
            <div className="lp-column lg-column">
              <p className="lp-eyebrow">Social Media Copilot</p>
              <p className="lp-title">Generated Posts</p>
              <p className="lp-lead">20 posts generated from your brief for Instagram, Facebook, X and LinkedIn.</p>

              <div className="li-brief">
                <KIcon name="file-02" className="lb-icon--20" />
                <p>
                  <b>Brief</b> Launch Mamaearth Onion Hair Fall Control Shampoo: five days, warm wash-day moments.
                </p>
                <span className="li-ghost">
                  <KIcon name="refresh" className="lb-icon--16" />
                  Regenerate all
                </span>
              </div>

              <div className="lg-grid">
                {POSTS.map((post) => (
                  <article key={post.day} className="lg-card">
                    <div className="lg-card__media-button">
                      <div className="lg-card__media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.video ? `/work/copilot/live/posts/day-${post.day}.webp` : `/work/copilot/live/posts/day-${post.day}-instagram.webp`}
                          alt=""
                          className={post.video ? "is-cover" : "is-contain"}
                        />
                        {post.video ? (
                          <span className="lg-card__play" aria-hidden>
                            <KIcon name="play" className="lb-icon--16" />
                          </span>
                        ) : null}
                        <span className="lg-card__aspect">{post.video ? "1:1" : "4:5"}</span>
                      </div>
                    </div>
                    <div className="lg-card__body">
                      <p className="lg-card__title">{post.title}</p>
                      <div className="lg-card__meta">
                        <div>
                          <p className="lg-card__date">
                            {post.date}
                            <span className="lg-dim"> · </span>
                            {post.time}
                          </p>
                          <p className="lg-card__format">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/work/copilot/live/platforms/instagram.svg" alt="" />
                            <KIcon name={post.video ? "video-01" : "image-01"} className="lp-icon-14" />
                            {post.video ? "Video" : "Static"}
                          </p>
                        </div>
                        <span className="lg-edit li-regen">
                          <KIcon name="refresh" className="lb-icon--16" />
                          Regenerate
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <footer className="lp-footer">
            <div className="lp-footer__inner lg-footer__inner">
              <span className="lb-generate lg-cta">
                <KIcon name="calendar-03" className="lb-icon--16" />
                Schedule Campaign
              </span>
            </div>
          </footer>
        </div>
      </KumbaAppShell>
    </LiveFigure>
  );
}
