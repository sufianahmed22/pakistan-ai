import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="section bg-white text-center">
      <div className="container-narrow">
        <h2 className="text-h2">Start exploring Pakistan today</h2>
        <p className="text-body-lg mt-4">Ask a question, browse a region, or dive into the numbers — it's all here.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/ask" className="btn-primary">Ask Pakistan AI</Link>
          <Link to="/explore" className="btn-secondary">Explore Pakistan</Link>
        </div>
      </div>
    </section>
  );
}
