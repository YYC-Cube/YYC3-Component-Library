'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  Settings,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Trash2,
  Edit
} from 'lucide-react';

interface DataManagementProps {
  language: 'zh' | 'en';
}

export function DataManagement({ language }: DataManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const content = {
    zh: {
      title: '数据管理',
      subtitle: '管理和监控您的数据源',
      tabs: {
        sources: '数据源',
        import: '数据导入',
        export: '数据导出',
        history: '历史记录'
      },
      stats: {
        totalSources: '数据源总数',
        activeConnections: '活跃连接',
        dataVolume: '数据量',
        lastUpdate: '最后更新'
      },
      sources: {
        title: '数据源管理',
        add: '添加数据源',
        refresh: '刷新',
        status: '状态',
        name: '名称',
        type: '类型',
        lastSync: '最后同步',
        actions: '操作'
      },
      import: {
        title: '数据导入',
        selectFile: '选择文件',
        selectSource: '选择数据源',
        startImport: '开始导入',
        importProgress: '导入进度',
        supportedFormats: '支持的格式：CSV, JSON, Excel, Parquet'
      },
      export: {
        title: '数据导出',
        selectData: '选择数据',
        selectFormat: '选择格式',
        dateRange: '日期范围',
        startExport: '开始导出',
        exportHistory: '导出历史'
      },
      history: {
        title: '操作历史',
        operation: '操作',
        timestamp: '时间',
        user: '用户',
        result: '结果',
        details: '详情'
      },
      sourceTypes: [
        { value: 'all', label: '全部' },
        { value: 'exchange', label: '交易所' },
        { value: 'database', label: '数据库' },
        { value: 'api', label: 'API' },
        { value: 'file', label: '文件' },
        { value: 'stream', label: '数据流' }
      ],
      mockSources: [
        {
          id: 1,
          name: 'Binance API',
          type: 'exchange',
          status: 'active',
          lastSync: '2024-01-15 10:30:00',
          records: 1245678
        },
        {
          id: 2,
          name: 'PostgreSQL DB',
          type: 'database',
          status: 'active',
          lastSync: '2024-01-15 10:25:00',
          records: 892345
        },
        {
          id: 3,
          name: 'Yahoo Finance',
          type: 'api',
          status: 'error',
          lastSync: '2024-01-15 09:15:00',
          records: 567890
        },
        {
          id: 4,
          name: 'CSV Files',
          type: 'file',
          status: 'syncing',
          lastSync: '2024-01-15 10:00:00',
          records: 234567
        }
      ],
      mockHistory: [
        {
          id: 1,
          operation: '数据导入',
          timestamp: '2024-01-15 10:30:00',
          user: 'admin',
          result: 'success',
          details: '成功导入 10,000 条记录'
        },
        {
          id: 2,
          operation: '数据导出',
          timestamp: '2024-01-15 10:15:00',
          user: 'admin',
          result: 'success',
          details: '导出交易数据 CSV 文件'
        },
        {
          id: 3,
          operation: '数据源同步',
          timestamp: '2024-01-15 10:00:00',
          user: 'system',
          result: 'failed',
          details: 'API 连接超时'
        }
      ]
    },
    en: {
      title: 'Data Management',
      subtitle: 'Manage and monitor your data sources',
      tabs: {
        sources: 'Data Sources',
        import: 'Data Import',
        export: 'Data Export',
        history: 'History'
      },
      stats: {
        totalSources: 'Total Sources',
        activeConnections: 'Active Connections',
        dataVolume: 'Data Volume',
        lastUpdate: 'Last Update'
      },
      sources: {
        title: 'Data Source Management',
        add: 'Add Data Source',
        refresh: 'Refresh',
        status: 'Status',
        name: 'Name',
        type: 'Type',
        lastSync: 'Last Sync',
        actions: 'Actions'
      },
      import: {
        title: 'Data Import',
        selectFile: 'Select File',
        selectSource: 'Select Data Source',
        startImport: 'Start Import',
        importProgress: 'Import Progress',
        supportedFormats: 'Supported formats: CSV, JSON, Excel, Parquet'
      },
      export: {
        title: 'Data Export',
        selectData: 'Select Data',
        selectFormat: 'Select Format',
        dateRange: 'Date Range',
        startExport: 'Start Export',
        exportHistory: 'Export History'
      },
      history: {
        title: 'Operation History',
        operation: 'Operation',
        timestamp: 'Timestamp',
        user: 'User',
        result: 'Result',
        details: 'Details'
      },
      sourceTypes: [
        { value: 'all', label: 'All' },
        { value: 'exchange', label: 'Exchange' },
        { value: 'database', label: 'Database' },
        { value: 'api', label: 'API' },
        { value: 'file', label: 'File' },
        { value: 'stream', label: 'Data Stream' }
      ],
      mockSources: [
        {
          id: 1,
          name: 'Binance API',
          type: 'exchange',
          status: 'active',
          lastSync: '2024-01-15 10:30:00',
          records: 1245678
        },
        {
          id: 2,
          name: 'PostgreSQL DB',
          type: 'database',
          status: 'active',
          lastSync: '2024-01-15 10:25:00',
          records: 892345
        },
        {
          id: 3,
          name: 'Yahoo Finance',
          type: 'api',
          status: 'error',
          lastSync: '2024-01-15 09:15:00',
          records: 567890
        },
        {
          id: 4,
          name: 'CSV Files',
          type: 'file',
          status: 'syncing',
          lastSync: '2024-01-15 10:00:00',
          records: 234567
        }
      ],
      mockHistory: [
        {
          id: 1,
          operation: 'Data Import',
          timestamp: '2024-01-15 10:30:00',
          user: 'admin',
          result: 'success',
          details: 'Successfully imported 10,000 records'
        },
        {
          id: 2,
          operation: 'Data Export',
          timestamp: '2024-01-15 10:15:00',
          user: 'admin',
          result: 'success',
          details: 'Exported trading data CSV file'
        },
        {
          id: 3,
          operation: 'Data Source Sync',
          timestamp: '2024-01-15 10:00:00',
          user: 'system',
          result: 'failed',
          details: 'API connection timeout'
        }
      ]
    }
  };

  const t = content[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'error': return 'bg-red-500/20 text-red-300';
      case 'syncing': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const handleImport = () => {
    setIsImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const filteredSources = t.mockSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedSource === 'all' || source.type === selectedSource;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.sources.refresh}
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            {t.sources.add}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.totalSources}</p>
                <p className="text-2xl text-white">24</p>
              </div>
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.activeConnections}</p>
                <p className="text-2xl text-white">18</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.dataVolume}</p>
                <p className="text-2xl text-white">2.8TB</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t.stats.lastUpdate}</p>
                <p className="text-2xl text-white">2分钟前</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="sources" className="data-[state=active]:bg-blue-600">
            {t.tabs.sources}
          </TabsTrigger>
          <TabsTrigger value="import" className="data-[state=active]:bg-green-600">
            {t.tabs.import}
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-purple-600">
            {t.tabs.export}
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-orange-600">
            {t.tabs.history}
          </TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="搜索数据源..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.sourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sources Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                {t.sources.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">{t.sources.name}</TableHead>
                    <TableHead className="text-slate-400">{t.sources.type}</TableHead>
                    <TableHead className="text-slate-400">{t.sources.status}</TableHead>
                    <TableHead className="text-slate-400">{t.sources.lastSync}</TableHead>
                    <TableHead className="text-slate-400">记录数</TableHead>
                    <TableHead className="text-slate-400">{t.sources.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSources.map((source) => (
                    <TableRow key={source.id} className="border-slate-700">
                      <TableCell className="text-white">{source.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {source.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(source.status)}>
                          {getStatusIcon(source.status)}
                          <span className="ml-1">{source.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{source.lastSync}</TableCell>
                      <TableCell className="text-slate-300">{source.records.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2 text-green-400" />
                {t.import.title}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.import.supportedFormats}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">{t.import.selectFile}</label>
                  <Input
                    type="file"
                    className="bg-slate-700 border-slate-600 text-white"
                    accept=".csv,.json,.xlsx,.parquet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">{t.import.selectSource}</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择目标数据源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binance">Binance API</SelectItem>
                      <SelectItem value="database">PostgreSQL DB</SelectItem>
                      <SelectItem value="local">本地存储</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">{t.import.importProgress}</span>
                    <span className="text-blue-400">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2 bg-slate-700" />
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.import.startImport}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="w-5 h-5 mr-2 text-purple-400" />
                {t.export.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">{t.export.selectData}</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择数据表" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trades">交易记录</SelectItem>
                      <SelectItem value="prices">价格数据</SelectItem>
                      <SelectItem value="factors">因子数据</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">{t.export.selectFormat}</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择格式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="parquet">Parquet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">{t.export.dateRange}</label>
                  <Input
                    type="date"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                {t.export.startExport}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-400" />
                {t.history.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">{t.history.operation}</TableHead>
                    <TableHead className="text-slate-400">{t.history.timestamp}</TableHead>
                    <TableHead className="text-slate-400">{t.history.user}</TableHead>
                    <TableHead className="text-slate-400">{t.history.result}</TableHead>
                    <TableHead className="text-slate-400">{t.history.details}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {t.mockHistory.map((record) => (
                    <TableRow key={record.id} className="border-slate-700">
                      <TableCell className="text-white">{record.operation}</TableCell>
                      <TableCell className="text-slate-300">{record.timestamp}</TableCell>
                      <TableCell className="text-slate-300">{record.user}</TableCell>
                      <TableCell className={getResultColor(record.result)}>
                        {record.result}
                      </TableCell>
                      <TableCell className="text-slate-300">{record.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}