function ReportDashboard({ reports }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">Weekly Teacher Report</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2">Teacher</th>
              <th className="px-3 py-2">Total Classes</th>
              <th className="px-3 py-2">Last-Hour Classes (2:55–3:45)</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.teacher} className="border-b border-slate-100">
                <td className="px-3 py-2">{report.teacher}</td>
                <td className="px-3 py-2">{report.total_classes}</td>
                <td className="px-3 py-2">{report.last_hour_classes}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-slate-500" colSpan={3}>
                  No report data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportDashboard;
