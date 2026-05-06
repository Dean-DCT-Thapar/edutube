'use client';

import { useEffect, useState } from 'react';
import frontendApi from '@/utils/frontendApiClient';
import AdminLayout from '../../component/AdminLayout';

export default function AdminMonitoringPage() {
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    frontendApi
      .get('/api/verify-auth')
      .then((data) => {
        if (data?.status === 200 && data?.name) {
          setUserName(data.name);
        }
      })
      .catch(() => {
        // Best-effort lookup; layout/page auth checks handle unauthorized cases.
      });
  }, []);

  return (
    <AdminLayout title="Monitoring" userName={userName}>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900">Starter Monitoring Dashboard</h2>
          <p className="text-sm text-gray-600 mt-2">
            Use the Grafana starter dashboard for request rate, latency, error ratio, replica health,
            container resource usage, and recent error logs.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="http://localhost:3001/d/edutube-starter/edutube-starter-monitoring"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Open Starter Dashboard
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Open Grafana Home
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Default Grafana credentials: <span className="font-mono">admin/admin</span> (change in production).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-md font-semibold text-gray-900">Other Monitoring Endpoints</h3>
          <ul className="mt-3 text-sm text-gray-700 space-y-1">
            <li>
              Prometheus: <a className="text-blue-600 hover:underline" href="http://localhost:9090" target="_blank" rel="noreferrer">http://localhost:9090</a>
            </li>
            <li>
              Loki: <a className="text-blue-600 hover:underline" href="http://localhost:3100" target="_blank" rel="noreferrer">http://localhost:3100</a>
            </li>
            <li>
              Alertmanager: <a className="text-blue-600 hover:underline" href="http://localhost:9093" target="_blank" rel="noreferrer">http://localhost:9093</a>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
