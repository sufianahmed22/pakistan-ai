import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export default function Tabs({ tabs, value, defaultTab, onChange, className }) {
  const [localActive, setLocalActive] = useState(value ?? defaultTab ?? tabs?.[0]?.value);

  useEffect(() => {
    if (value !== undefined) {
      setLocalActive(value);
    }
  }, [value]);

  const active = value !== undefined ? value : localActive;

  const select = (val) => {
    setLocalActive(val);
    onChange?.(val);
  };

  return (
    <div className={cn('flex flex-wrap gap-2 border-b border-charcoal-100', className)} role="tablist">
      {tabs.map((tab) => {
        const isSelected = active === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => select(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2',
              isSelected
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
