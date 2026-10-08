# components/charts

Substitution notice: the spec calls for "Bklit-style chart usage", but no such package
exists on the public npm registry (`npm view bklit` → 404). **Recharts** is used as the
concrete charting engine implementing every chart type the spec lists (line, bar,
horizontal bar, sankey, pie/donut, scatter, area). Each component below exposes a small,
clean, domain-specific API (`PopulationChart`, `ProvincePopulationChart`, etc.) so callers
never touch Recharts primitives directly — that keeps the "Bklit-style" call-site contract
described in the spec while Recharts does the rendering underneath.
