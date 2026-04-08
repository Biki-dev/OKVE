type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

type PropsTableProps = {
  rows: PropRow[]
}

export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td>
                <code>{row.defaultValue ?? '-'}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
