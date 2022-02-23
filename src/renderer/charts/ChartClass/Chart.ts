// Import LCJS
import {
  synchronizeAxisIntervals,
  translatePoint,
  Dashboard,
  ChartXY,
  PointMarker,
  UIBackground,
  LineSeries,
  UIPanel,
  Axis,
  Point,
  SolidLine,
  SolidFill,
  ColorHEX,
  UIButtonPicture,
  UICheckBox,
} from '@arction/lcjs';

// Methods
import dashboard from './methods/Dashboard';
import createChartPerChannel from './methods/Charts';
import createSeriesForEachChart from './methods/Series';
import xAxisChart from './methods/XAxisChart';
import customCursor from './methods/CustomCursor';
import SeriesToggle from './methods/SeriesToggles';

// Constants
import { ChartType } from 'utils/constants';

class ChartClass {
  channelCount: number;
  seriesLineColorArr: string[];
  charts!: ChartXY<PointMarker, UIBackground>[];
  dashboard!: Dashboard;
  // ChartSyncXAxis: any;
  type: string;
  channels: string[];
  series!: LineSeries[];
  samplingRate: number;
  TOILegend: any;
  containerId: string;
  ChartOptions: any;
  UIPanel: null | UIPanel;
  xAxisChart!: ChartXY<PointMarker, UIBackground>;
  seriesToggles!: UICheckBox<
    UIBackground,
    UIButtonPicture,
    UIButtonPicture
  >[][];

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number,
    containerId: string
  ) {
    this.channels = channels || ['No Channel'];
    this.channelCount = channels.length;
    this.type = type;
    this.samplingRate = samplingRate;
    this.containerId = containerId;
    this.seriesLineColorArr = ['#E3170A', '#00FFFF', '#ABFF4F', '#FFFFFF']; //Colors for each series: ['red','yellow','cyan', 'white']
    this.TOILegend = null;
    this.ChartOptions = null;
    this.UIPanel = null;
  }

  createDashboard(numOfRows: number, container: string): Dashboard {
    this.dashboard = dashboard(numOfRows, container);
    this.charts = createChartPerChannel.bind(this)();
    this.series = createSeriesForEachChart.bind(this)();
    this.seriesToggles = SeriesToggle.bind(this)();
    this.xAxisChart = xAxisChart.bind(this)();
    customCursor.bind(this)();
    return this.dashboard;
  }

  /**
   * Gets the all the dashboard's chart channel positions.
   * @returns - Array of chart channel positions
   */
  getChartPositions = (charts: ChartXY<PointMarker, UIBackground>[]) => {
    const chartPos = new Array(charts.length).fill({});
    charts.forEach((chart, i) => {
      // Get each chart position needed for aligning the ChannelUI elements
      // Get the top left corner
      const posEngine = translatePoint(
        { x: 0, y: 0 },
        chart.uiScale,
        chart.engine.scale
      );
      const posDocument = chart.engine.engineLocation2Client(
        posEngine.x,
        posEngine.y
      );

      const posEngine2 = translatePoint(
        { x: 100, y: 100 },
        chart.uiScale,
        chart.engine.scale
      );
      const posDocument2 = chart.engine.engineLocation2Client(
        posEngine2.x,
        posEngine2.y
      );

      const height = Math.abs(posDocument2.y - posDocument.y) + 3;
      const width = Math.abs(posDocument2.x - posDocument.x);
      chartPos[i] = { x: posDocument.x, y: posDocument2.y, height, width };
    });
    return chartPos;
  };

  translateXAxisPixelToAxisCoordinates(x: number, y: number) {
    const xAxisChart = this.xAxisChart as ChartXY<PointMarker, UIBackground>;
    const mouseLocationEngine = this.xAxisChart?.engine.clientLocation2Engine(
      x,
      y
    ) as Point;
    const point = translatePoint(mouseLocationEngine, xAxisChart.engine.scale, {
      x: xAxisChart.getDefaultAxisX(),
      y: xAxisChart.getDefaultAxisY(),
    });
    return point;
  }

  // Synchronizes all X axis to have the same interval/move at the same time
  synchronizeXAxis(charts: ChartXY<PointMarker, UIBackground>[]) {
    const syncedAxes = charts.map((chart) => chart.getDefaultAxisX());
    const xAxis = (this.xAxisChart &&
      this.xAxisChart.getDefaultAxisX()) as Axis;
    syncedAxes.unshift(xAxis);
    synchronizeAxisIntervals(...syncedAxes);
  }

  changeSeriesColor(series: LineSeries | undefined, color: string) {
    series?.setStrokeStyle(
      new SolidLine({
        thickness: 1.25,
        fillStyle: new SolidFill({ color: ColorHEX(color) }),
      })
    );
  }

  clearCharts() {
    this.series.forEach((series) => {
      series.clear();
      series.dispose();
      requestAnimationFrame(() => series.restore());
    });
    this.charts.forEach((chart) => {
      chart.getDefaultAxisX().setInterval(0, 30000);
      chart.getDefaultAxisY().setInterval(0, 50);
    });
  }

  memoryCleanup() {
    this.series.forEach((series) => {
      series.clear();
      series.dispose();
    });
    this.dashboard.forEachChart((chart) => {
      chart.dispose();
    });
    this.charts.forEach((chart) => chart.dispose());
    this.xAxisChart.dispose();
    // this.UIPanel?.dispose();
    this.dashboard.dispose();

    //@ts-ignore
    this.charts = undefined;
    //@ts-ignore
    this.series = undefined;
    //@ts-ignore
    this.xAxisChart = undefined;
    //@ts-ignore
    this.dashboard = undefined;
    //@ts-ignore
    this.charts = undefined;
  }
}

export default ChartClass;
