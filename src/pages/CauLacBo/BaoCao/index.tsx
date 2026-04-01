import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const ReportDashboard = () => {
  const { clubs, fetchClubs } = useModel('club');
  const { registrations, fetchRegistrations } = useModel('registration');

  useEffect(() => {
    fetchClubs();
    fetchRegistrations();
  }, [fetchClubs, fetchRegistrations]);

  const stats = useMemo(() => {
    const totalClubs = clubs.length;
    let pending = 0, approved = 0, rejected = 0;
    
    registrations.forEach(r => {
      if (r.status === 'Pending') pending++;
      else if (r.status === 'Approved') approved++;
      else if (r.status === 'Rejected') rejected++;
    });

    return { totalClubs, pending, approved, rejected };
  }, [clubs, registrations]);

  // Aggregation for ColumnChart
  const chartData = useMemo(() => {
    const categories = clubs.map(c => c.name);
    
    const pendingData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Pending').length);
    const approvedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Approved').length);
    const rejectedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Rejected').length);

    return {
      categories,
      series: [
        { name: 'Pending', data: pendingData },
        { name: 'Approved', data: approvedData },
        { name: 'Rejected', data: rejectedData }
      ]
    };
  }, [clubs, registrations]);

  return (
    <div style={{ display: 'none' }}>
      {stats.totalClubs} {chartData.categories.length}
    </div>
  );
};

export default ReportDashboard;
