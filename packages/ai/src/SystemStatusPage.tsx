"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, CheckCircle, AlertTriangle, XCircle, Clock, Globe,
  Server, Database, Cloud, Network, Monitor, Zap, Calendar,
  TrendingUp, BarChart3, Wifi, Shield, RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface SystemStatusPageProps {
  navigate: (page: string) => void;
}

const services = [
  { name: "API Gateway", status: "operational", uptime: "99.99%", responseTime: "45ms" },
  { name: "AI Models", status: "operational", uptime: "99.97%", responseTime: "120ms" },
  { name: "Database", status: "operational", uptime: "99.95%", responseTime: "12ms" },
  { name: "Authentication", status: "operational", uptime: "99.98%", responseTime: "35ms" },
  { name: "File Storage", status: "degraded", uptime: "99.85%", responseTime: "180ms" },
  { name: "Dashboard", status: "operational", uptime: "99.96%", responseTime: "250ms" }
];

const incidents = [
  {
    title: "API Gateway Latency",
    status: "resolved",
    severity: "minor",
    started: "2024-01-15 14:30 UTC",
    resolved: "2024-01-15 15:45 UTC",
    description: "Increased response times due to traffic spike"
  },
  {
    title: "Database Maintenance",
    status: "scheduled",
    severity: "maintenance",
    started: "2024-01-20 02:00 UTC",
    resolved: "2024-01-20 04:00 UTC",
    description: "Scheduled maintenance for performance optimization"
  }
];

export function SystemStatusPage({ navigate }: SystemStatusPageProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'down': return XCircle;
      default: return Clock;
    }
  };

  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'major': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'minor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'maintenance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-300">All Systems Operational</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              System <span className="gradient-text-blue">Status</span>
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto text-foreground-muted">
              Real-time status and performance metrics for all Delibix AI services.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleString()}</span>
              <Button variant="ghost" size="sm" onClick={() => setLastUpdated(new Date())}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Overall Status */}
        <Card className="glass p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2>Current Status</h2>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              All Systems Operational
            </Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.97%</div>
              <div className="text-sm text-foreground-muted">30-day uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-blue mb-2">65ms</div>
              <div className="text-sm text-foreground-muted">Avg response time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-blue mb-2">0</div>
              <div className="text-sm text-foreground-muted">Active incidents</div>
            </div>
          </div>
        </Card>

        {/* Services Status */}
        <Card className="glass p-8 mb-12">
          <h2 className="mb-6">Service Status</h2>
          <div className="space-y-4">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-foreground-muted capitalize">{service.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{service.uptime}</div>
                    <div className="text-xs text-foreground-muted">{service.responseTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Incidents */}
        <Card className="glass p-8 mb-12">
          <h2 className="mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3>{incident.title}</h3>
                  <Badge className={getIncidentColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-foreground-muted mb-4">{incident.description}</p>
                <div className="flex gap-6 text-sm text-foreground-muted">
                  <span>Started: {incident.started}</span>
                  <span>Resolved: {incident.resolved}</span>
                  <Badge variant="outline" className="text-xs">
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subscribe to Updates */}
        <Card className="glass p-8 text-center">
          <h2 className="mb-4">Stay Updated</h2>
          <p className="text-foreground-muted mb-6">
            Get notified about service updates and maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-bg-blue text-white">
              Subscribe to Updates
            </Button>
            <Button variant="outline" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Maintenance Schedule
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}