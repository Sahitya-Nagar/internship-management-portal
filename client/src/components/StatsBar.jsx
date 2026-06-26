export default function StatsBar({ count, paidCount, volunteerCount, employersCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Positions</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Positions</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{paidCount}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{volunteerCount}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employers</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{employersCount}</p>
      </div>
    </div>
  );
}
