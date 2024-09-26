/**
 * Defines the granularity levels used for specifying time intervals in data aggregation or reporting.
 * Each property represents a different granularity level.
 */

export const widgetDetails = {
  dbaas: {
    clusterName: 'mysql-cluster',
    dashboardName: 'Dbaas Dashboard',
    engine: 'MySQL',
    id: 1,
    metrics: [
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_disk_OPS_total',
        title: 'Disk I/O',
        unit: 'OPS',
        yLabel: 'system_disk_operations_total',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min'],
        expectedGranularity: '1 hr',
        name: 'system_cpu_utilization_percent',
        title: 'CPU Utilization',
        unit: '%',
        yLabel: 'system_cpu_utilization_ratio',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_memory_usage_by_resource',
        title: 'Memory Usage',
        unit: 'Bytes',
        yLabel: 'system_memory_usage_bytes',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_network_io_by_resource',
        title: 'Network Traffic',
        unit: 'Bytes',
        yLabel: 'system_network_io_bytes_total',
      },
    ],
    nodeType: 'Secondary',
    region: 'US, Chicago, IL (us-ord)',
    resource: 'Dbaas-resource',
    serviceType: 'dbaas',
  },
  linode: {
    dashboardName: 'Linode Dashboard',
    id: 1,
    metrics: [
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min'],
        expectedGranularity: '1 hr',
        name: 'system_cpu_utilization_percent',
        title: 'CPU Utilization',
        unit: '%',
        yLabel: 'system_cpu_utilization_ratio',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_memory_usage_by_resource',
        title: 'Memory Usage',
        unit: 'Bytes',
        yLabel: 'system_memory_usage_bytes',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_network_io_by_resource',
        title: 'Network Traffic',
        unit: 'Bytes',
        yLabel: 'system_network_io_bytes_total',
      },
      {
        expectedAggregation: 'max',
        expectedAggregationArray: ['avg', 'max', 'min', 'sum'],
        expectedGranularity: '1 hr',
        name: 'system_disk_OPS_total',
        title: 'Disk I/O',
        unit: 'OPS',
        yLabel: 'system_disk_operations_total',
      },
    ],
    region: 'US, Chicago, IL (us-ord)',
    resource: 'linode-resource',
    serviceType: 'linode',
  },
};
