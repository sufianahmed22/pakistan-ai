export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Pakistan AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
