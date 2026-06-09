import { Link } from "react-router-dom";

const About = () => (
  <div>
    <section className="text-center px-4 sm:px-6 py-12 sm:py-16 md:py-24 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-store-fg font-normal leading-tight">
        About ASTIOX
      </h1>
      <p className="mt-4 sm:mt-6 text-sm md:text-[15px] text-store-muted leading-relaxed">
        A gallery for objects of enduring character — where craft, proportion,
        and material honesty define every piece we present.
      </p>
    </section>

    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-store-fg mb-4">
              A Philosophy of Stillness
            </h2>
            <p className="text-sm text-store-muted leading-relaxed">
              We believe the most compelling objects are those that settle into
              a room without announcement. ASTIOX exists to surface furniture,
              lighting, and artifacts that reward sustained attention — pieces
              shaped by artisans who understand restraint as a form of luxury.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-store-fg mb-4">
              Curated, Not Crowded
            </h2>
            <p className="text-sm text-store-muted leading-relaxed">
              Every item in our catalog is selected for its silhouette, material
              integrity, and timeless relevance. We favor fewer objects with
              stronger presence over volume for its own sake.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-store-fg mb-4">
              Inquire With Intention
            </h2>
            <p className="text-sm text-store-muted leading-relaxed">
              ASTIOX operates as a consultative gallery. For availability,
              specifications, and worldwide insured transport, we invite you to
              reach out directly — each inquiry is handled with care.
            </p>
          </div>

          <Link
            to="/"
            className="inline-block text-xs uppercase tracking-[0.15em] text-store-fg underline underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Explore the Catalog
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="aspect-[3/4] bg-store-surface-2" />
          <div className="aspect-[3/4] bg-store-surface mt-8 sm:mt-12" />
          <div className="col-span-2 aspect-[16/9] bg-store-surface-2" />
        </div>
      </div>
    </div>
  </div>
);

export default About;
