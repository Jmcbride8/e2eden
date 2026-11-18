import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const COLUMNS = [
  {
    tag: "Established",
    title: "Evaporative cooling works",
    body: "Evaporative cooling is well-understood physics, and Seawater Greenhouse deployments have demonstrated saltwater cooling inside enclosed, high-humidity structures across a range of arid climates. Those results come from covered greenhouses, not open fields.",
  },
  {
    tag: "Our hypothesis",
    title: "It may extend to open fields",
    body: "Saline-water cooling walls may lower net freshwater requirements in open-field and semi-open desert agriculture by reducing evaporative demand downwind of the wall. This has not yet been demonstrated at field scale.",
  },
  {
    tag: "Proposed research",
    title: "Measured, not asserted",
    body: "Instrumented field trials will quantify cooling reach, net freshwater savings, crop stress and yield, salt and soil impacts, and economics under real desert conditions, with results published as measured.",
  },
];

const QUESTIONS = [
  "How much cooling can saline-water walls produce, and how far downwind does it persist?",
  "Can microclimate modification reduce net freshwater irrigation requirements?",
  "How does cooling influence crop stress, yield, and quality?",
  "What are the risks of salt deposition, corrosion, scaling, and soil salinization?",
  "Can sensor-driven optimization improve water and energy efficiency?",
  "Under what conditions can the system be economically viable?",
];

export default function ScienceFrontier({ withQuestions = true, embedded = false }) {
  return (
    <section className={embedded ? "mb-24" : "py-24 px-6 sm:px-12 bg-black"}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Scientific Rigor</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
            The Science Is Established. The Next Frontier Must Be Proven.
          </h2>
          <p className="text-xl text-white/70 leading-relaxed max-w-4xl mb-14">
            Decades of evaporative-cooling research demonstrate that saline water can be used to create cooler, more humid growing environments. E2Eden's next challenge is determining whether these benefits can extend beyond enclosed greenhouses into commercially viable open-field agriculture. Our research will measure cooling persistence, crop response, net freshwater savings, environmental impacts, and economic performance under real desert conditions.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {COLUMNS.map((column, idx) => (
              <motion.div
                key={column.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col"
              >
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.16em] mb-3">{column.tag}</p>
                <h3 className="text-xl font-bold text-white mb-3">{column.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{column.body}</p>
              </motion.div>
            ))}
          </div>

          {withQuestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-white">The questions we are testing</h3>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <ol className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                {QUESTIONS.map((question, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="text-amber-400/70 font-mono text-sm pt-0.5">{String(idx + 1).padStart(2, "0")}</span>
                    <p className="text-white/70 leading-relaxed">{question}</p>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-white/40 text-sm max-w-2xl">
              Where a claim cannot be substantiated, it is stated as a hypothesis or left out. Results will be published as measured, including where the hypothesis does not hold.
            </p>
            <Link
              to={createPageUrl("Innovators")}
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold whitespace-nowrap transition-colors"
            >
              Research library →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}