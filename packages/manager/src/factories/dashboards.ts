import Factory from 'src/factories/factoryProxy';

import type { AvailableMetrics, Dashboard, Widgets } from '@linode/api-v4';

const color = ['blue', 'red', 'green', 'yellow'];
const chart_type = ['area', 'area', 'area', 'line'];
const scrape_interval = ['2m', '30s', '30s', '30s'];

/**
 * Factory function to create instances of the `Dashboard` model with predefined properties and values.
 *
 * @param {string} dashboardLabel - The label to assign to the dashboard instance.
 * @param {string[]} widgetLabels - An array of labels for widgets to be included in the dashboard.
 * @param {string[]} metricsLabels - An array of labels for metrics associated with the widgets.
 * @param {string[]} y_labels - An array of Y-axis labels for the metrics.
 * @param {string} service - The type of service to be assigned to the dashboard.
 *
 * @returns {Factory<Dashboard>} A Factory instance for creating `Dashboard` objects with the specified properties.
 *
 * @description
 * This function uses the `Factory.Sync.makeFactory` method to create a factory for generating `Dashboard` objects.
 * The created `Dashboard` object includes:
 * - `created`: A timestamp for when the dashboard was created, in ISO string format.
 * - `id`: A unique identifier for the dashboard, generated sequentially based on the factory's index.
 * - `label`: The label provided via the `dashboardLabel` parameter.
 * - `service_type`: The service type provided via the `service` parameter.
 * - `time_duration`: An object with a unit of 'min' and a value of 30 minutes, indicating the time duration.
 * - `updated`: A timestamp for when the dashboard was last updated, in ISO string format.
 * - `widgets`: A list of widgets generated by the `widgetFactory` function. The number of widgets created is equal to the length of the `widgetLabels` array.
 *
 * Usage Example:
 * ```typescript
 * const myDashboardFactory = dashboardFactory('Main Dashboard', ['Widget1', 'Widget2'], ['Metric1', 'Metric2'], ['Y1', 'Y2'], 'ServiceA');
 * const myDashboard = myDashboardFactory.build(); // Creates a Dashboard instance with the specified properties.
 * ```
 */

export const dashboardFactory = Factory.Sync.makeFactory<Dashboard>({
  created: new Date().toISOString(),
  id: Factory.each((i) => i),
  label: Factory.each((i) => `Factory Dashboard-${i}`),
  service_type: 'linode',
  time_duration: {
    unit: 'min',
    value: 30,
  },
  updated: new Date().toISOString(),
  widgets: [],
});
/**
 * Factory function to create instances of the `Widgets` model with predefined properties and values.
 *
 * @param {string[]} widgetLabels - An array of labels for widgets to be created.
 * @param {string[]} metricsLabels - An array of metrics labels associated with each widget.
 * @param {string[]} y_labels - An array of Y-axis labels for the metrics.
 *
 * @returns {Factory<Widgets>} A Factory instance for creating `Widgets` objects with the specified properties.
 *
 * @description
 * This function uses the `Factory.Sync.makeFactory` method to create a factory for generating `Widgets` objects.
 * The created `Widgets` object includes:
 * - `aggregate_function`: Set to 'avg' for averaging metric values.
 * - `chart_type`: The type of chart for the widget, chosen from a predefined list (`chart_type`).
 * - `color`: The color of the widget, chosen from a predefined list (`color`).
 * - `filters`: An empty array of filters for the widget.
 * - `group_by`: Set to 'region', indicating the grouping criterion for the widget data.
 * - `label`: The label for the widget, chosen from the `widgetLabels` array.
 * - `metric`: The metric associated with the widget, chosen from the `metricsLabels` array.
 * - `namespace_id`: An identifier for the namespace, generated as the modulus of the index with 10.
 * - `region_id`: An identifier for the region, generated as the modulus of the index with 5.
 * - `resource_id`: A unique resource identifier formatted as `resource-{index}`.
 * - `service_type`: Set to 'default', indicating the service type.
 * - `serviceType`: Also set to 'default', similar to `service_type`.
 * - `size`: Fixed size value of 12 for the widget.
 * - `time_duration`: An object with a unit of 'min' and a value of 30 minutes, representing the time duration.
 * - `time_granularity`: An object with a unit of 'hour' and a value of 1 hour, representing the granularity of time.
 * - `unit`: The unit of measurement, chosen from a predefined list (`units`).
 * - `y_label`: The Y-axis label for the widget, chosen from the `y_labels` array.
 *
 * Usage Example:
 * ```typescript
 * const myWidgetFactory = widgetFactory(['Widget1', 'Widget2'], ['Metric1', 'Metric2'], ['Y1', 'Y2']);
 * const myWidget = myWidgetFactory.build(); // Creates a Widget instance with the specified properties.
 * ```
 */
export const widgetFactory = Factory.Sync.makeFactory<Widgets>({
  aggregate_function: 'avg',
  chart_type: Factory.each((i) => chart_type[i % chart_type.length]),
  color: Factory.each((i) => color[i % color.length]),
  filters: [],
  group_by: 'region',
  label: Factory.each((i) => 'widget_label_' + i),
  metric: Factory.each((i) => 'widget_metric_' + i),
  namespace_id: Factory.each((i) => i % 10),
  region_id: Factory.each((i) => i % 5),
  resource_id: Factory.each((i) => [`resource-${i}`]),
  service_type: 'default',
  serviceType: 'default',
  size: 12,
  time_duration: {
    unit: 'min',
    value: 30,
  },
  time_granularity: {
    unit: 'hour',
    value: 1,
  },
  unit: 'defaultUnit',
  y_label: Factory.each((i) => 'y_label_' + i),
});
/**
 * Factory function to create instances of the `AvailableMetrics` model with predefined properties and values.
 *
 * @param {string[]} widgetLabels - An array of labels for widgets that will be associated with the metrics.
 * @param {string[]} metricsLabels - An array of labels for metrics to be used in the `AvailableMetrics` instances.
 *
 * @returns {Factory<AvailableMetrics>} A Factory instance for creating `AvailableMetrics` objects with the specified properties.
 *
 * @description
 * This function uses the `Factory.Sync.makeFactory` method to create a factory for generating `AvailableMetrics` objects.
 * The created `AvailableMetrics` object includes:
 * - `available_aggregate_functions`: A fixed array of aggregate functions that can be applied to the metrics: `'min'`, `'max'`, `'avg'`, and `'sum'`.
 * - `dimensions`: An empty array of dimensions for the metric. This property can be expanded if needed.
 * - `label`: A label for the metric, chosen from the `widgetLabels` array. The label is selected based on the index modulo the length of `widgetLabels`, allowing for cycling through the provided labels. This property might be overridden if specified differently.
 * - `metric`: A metric label chosen from the `metricsLabels` array. The metric is selected based on the index modulo the length of `metricsLabels`, allowing for cycling through the provided labels. This property might be overridden if specified differently.
 * - `metric_type`: Set to `'gauge'`, indicating the type of metric.
 * - `scrape_interval`: The interval at which metrics are scraped, chosen from a predefined list (`scrape_interval`). The value is selected based on the index modulo the length of `scrape_interval`.
 * - `unit`: The unit of measurement for the metric, chosen from a predefined list (`units_interval`). The unit is selected based on the index modulo the length of `units_interval`.
 *
 * Usage Example:
 * ```typescript
 * const myDashboardMetricFactory = dashboardMetricFactory(['Widget1', 'Widget2'], ['Metric1', 'Metric2']);
 * const myMetric = myDashboardMetricFactory.build(); // Creates an AvailableMetrics instance with the specified properties.
 * ```
 */

export const dashboardMetricFactory = Factory.Sync.makeFactory<AvailableMetrics>(
  {
    available_aggregate_functions: ['min', 'max', 'avg', 'sum'],
    dimensions: [],
    label: Factory.each((i) => 'widget_label_' + i), // This might be overridden
    metric: Factory.each((i) => 'widget_metric_' + i), // This might be overridden
    metric_type: 'gauge',
    scrape_interval: Factory.each(
      (i) => scrape_interval[i % scrape_interval.length]
    ),
    unit: 'defaultUnit',
  }
);
