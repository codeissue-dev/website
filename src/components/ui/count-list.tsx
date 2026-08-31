/** One label with one number, repeated: status counts, role counts, content counts. */
export type CountRow = {
  readonly label: string;
  readonly value: number | string;
};

export function CountList({ rows }: { rows: readonly CountRow[] }) {
  return (
    <dl className="divide-y divide-line">
      {rows.map((row) => (
        <div key={row.label} className="data-row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
