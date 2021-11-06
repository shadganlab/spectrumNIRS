// Import LCJS
import {
  lightningChart,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  AxisScrollStrategies,
  AxisTickStrategies,
  emptyFill,
  SolidLine,
  synchronizeAxisIntervals,
  translatePoint,
  UIElementBuilders,
  UILayoutBuilders,
  UIOrigins,
  emptyLine,
} from '@arction/lcjs';
// Constants
import { ChartType } from 'utils/constants';

class ChartClass {
  channelCount: number;
  seriesLineColorArr: string[];
  dashboard: any;
  charts: any;
  Series: any;
  // ChartSyncXAxis: any;
  seriesLength: any;
  type: string;
  channels: string[];
  series: any;
  samplingRate: number;

  constructor(
    channels = ['Ch1', 'Ch2', 'Ch3', 'Ch4'],
    type: ChartType.RECORD | ChartType.REVIEW,
    samplingRate: number
  ) {
    this.channels = channels || ['No Channel'];
    this.channelCount = channels.length;
    this.type = type;
    this.samplingRate = samplingRate;
    this.seriesLineColorArr = ['#E3170A', '#ABFF4F', '#00FFFF', '#FFFFFF']; //Colors for each series: ['red','yellow','cyan', 'white']
    this.createChart();
  }

  // Cleanup function when chart is removed from the screen - IMPORTANT
  cleanup() {
    this.dashboard.dispose();
    this.dashboard = null;
    this.charts = null;
    this.series = null;
    window.api.removeChartEventListeners();
  }

  // Create chart
  createChart() {
    // Create the dashboard first
    this.dashboard = this.createDashboard();

    // Create chart per each channel given
    this.charts = this.createChartPerChannel();

    // Create series for each chart created
    this.series = this.createSeriesForEachChart();

    this.uiList();

    // Customize the default behaviour & options
    this.customizeChart();

    // Synchronize X axis of all charts
    this.synchronizeXAxis();

    // Add a custom cursor to show each chart value
    this.customCursor();
  }

  // Listens for data for the record page
  recordData() {
    window.api.onIPCData('data:reader-record', (_, data: any) => {
      // data format = 'TimeStamp,O2Hb,HHb,tHb,TOI' - data should contain 10 reading lines
      requestAnimationFrame(() => {
        for (let i = 0; i < this.series.length; i++) {
          this.series[i].add({ x: data[0], y: data[i + 1] });
        }
      });
    });
  }

  // Listens for events of the review page
  reviewData(data: Array<Object>) {
    console.log(data);
    // Loads all the data
    data.forEach((line: any) => {
      const data = line.value.split(',');
      for (let i = 0; i < this.series.length; i++) {
        this.series[i].add({
          x: parseFloat(data[0]),
          y: parseFloat(data[i + 1]),
        });
      }
    });
  }

  // Chart dashboard
  createDashboard() {
    const dashboard = lightningChart().Dashboard({
      numberOfRows: this.channelCount, //Total number of rows for the dashboard - default 8
      numberOfColumns: 2, //Full width
      container: 'chart', //div id to attach to
      disableAnimations: true,
    });

    dashboard.setColumnWidth(0, 1);
    dashboard.setColumnWidth(1, 11);

    return dashboard;
  }

  // Create chart per each channel
  createChartPerChannel() {
    // Create an array containing all the charts that is being created
    const charts = this.channels.map((_channel, i) => {
      const chart = this.dashboard
        .createChartXY({
          rowIndex: i,
          columnIndex: 1,
        })
        .setPadding({ bottom: 10, top: 10, right: 10 });

      return chart;
    });
    return charts;
  }

  // Create series for each chart
  createSeriesForEachChart() {
    // Create a series array containing all the series created based on each chart
    const series = this.charts.map((chart: any, i: number) => {
      return (
        chart
          .addLineSeries({
            dataPattern: {
              // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
              pattern: 'ProgressiveX',
              // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
              regularProgressiveStep: true,
            },
          })
          .setDataCleaning({ minDataPointCount: 1 })

          //Styling
          .setStrokeStyle(
            new SolidLine({
              thickness: 2,
              fillStyle: new SolidFill({
                color: ColorHEX(this.seriesLineColorArr[i]),
              }),
            })
          )
      );
    });
    return series;
  }

  // Remove unused elements from each chart
  customizeChart() {
    this.charts.forEach((chart: any, index: number) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();
      // Set scrolling strategies
      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.fitting);

      if (this.type === ChartType.RECORD) {
        axisX
          .setInterval(0, 20.0)
          .setScrollStrategy(AxisScrollStrategies.progressive);
      } else {
        axisX
          .setInterval(0, 20.0)
          .setScrollStrategy(AxisScrollStrategies.regressive);
      }

      // Disable animation on both axes
      axisY.disableAnimations();
      axisX.disableAnimations();

      // Remove X Axis on all charts except the last one
      if (index !== this.channelCount - 1) {
        axisX
          .setTickStrategy(AxisTickStrategies.Time, (ticks: any) =>
            ticks
              .setMajorTickStyle((majorTicks: any) =>
                majorTicks
                  .setLabelFillStyle(emptyFill)
                  .setTickStyle(emptyLine)
                  .setTickLength(0)
                  .setTickPadding(0)
              )
              .setMinorTickStyle((minorTicks: any) =>
                minorTicks
                  .setLabelFillStyle(emptyFill)
                  .setTickStyle(emptyLine)
                  .setTickLength(0)
                  .setTickPadding(0)
              )
          )
          .setStrokeStyle(emptyLine)
          .setScrollStrategy(undefined)
          .setTickStrategy(AxisTickStrategies.Empty)
          .setStrokeStyle(emptyLine);
      } else {
        // Add X Axis to the last chart
        if (this.type === ChartType.RECORD) {
          axisX
            .setTickStrategy(AxisTickStrategies.Time)
            .setTitle('Seconds')
            .setScrollStrategy(AxisScrollStrategies.progressive);
        } else {
          axisX
            .setTitle('Seconds')
            .setScrollStrategy(AxisScrollStrategies.regressive);
        }
      }

      // Remove all chart titles
      if (index === 0) {
        chart.setTitle('Sensor Data');
      } else {
        chart.setTitleFillStyle(emptyFill);
      }

      // Align Y axes of stacked charts.
      chart.getDefaultAxisY().setThickness(50);

      // Disable default auto cursor.
      chart.setAutoCursorMode(AutoCursorModes.disabled);
    });
  }

  uiList() {
    this.charts.forEach((chart: any, i: number) => {
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();
      const panel = this.dashboard.createUIPanel({
        columnIndex: 0,
        rowIndex: i,
      });

      const legendLayout = panel
        .addUIElement(UILayoutBuilders.Column)
        .setPosition(
          translatePoint(
            {
              x: 0,
              y: axisY.getInterval().end,
            },
            { x: axisX, y: axisY },
            chart.uiScale
          )
        )
        .setOrigin(UIOrigins.LeftTop)
        .setMouseInteractions(false)
        .setBackground((bg: any) =>
          bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
        );

      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(this.channels[i])
        .setTextFont((font: any) => font.setSize(16));

      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(' ')
        .setMargin({ top: 5 })
        .setBackground((background: any) =>
          background.setFillStyle(
            new SolidFill({
              color: ColorHEX(this.seriesLineColorArr[i]),
            })
          )
        );

      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(this.samplingRate.toString() + ' samples/s')
        .setTextFont((font: any) => font.setSize(9))
        .setMargin({ top: 10 });
    });
    // this.charts.map((chart: any, i: number) => {
    //   const axisX = chart.getDefaultAxisX();
    //   const axisY = chart.getDefaultAxisY();
    //   const channel = this.channels[i];

    //   const ui = chart
    //     .addUIElement(UILayoutBuilders.Column)
    //     .setMouseInteractions(false)
    //     .setBackground((background: any) =>
    //       background.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
    //     )
    //     .dispose();

    //   const channelText = ui
    //     .addElement(UIElementBuilders.TextBox)
    //     .setText(channel)
    //     .setTextFont((font: any) => font.setSize(16))
    //     .dispose();

    //   const channelColor = ui
    //     .addElement(UIElementBuilders.TextBox)
    //     .setText(' ')
    //     .setMargin({ top: 5 })
    //     .setBackground((background: any) =>
    //       background.setFillStyle(
    //         new SolidFill({
    //           color: ColorHEX(this.seriesLineColorArr[i]),
    //         })
    //       )
    //     )
    //     .dispose();

    //   const samplingRate = ui
    //     .addElement(UIElementBuilders.TextBox)
    //     .setText(this.samplingRate.toString() + ' samples/s')
    //     .setTextFont((font: any) => font.setSize(9))
    //     .setMargin({ top: 10 })
    //     .dispose();

    //   requestAnimationFrame(() => {
    //     ui.setPosition(
    //       translatePoint(
    //         {
    //           x: axisX.getInterval().start,
    //           y: axisY.getInterval().end,
    //         },
    //         { x: axisX, y: axisY },
    //         chart.uiScale
    //       )
    //     )
    //       .setOrigin(UIOrigins.LeftTop)
    //       .restore();

    //     channelText.restore();
    //     channelColor.restore();
    //     samplingRate.restore();
    //   });
    // });
  }

  // Synchronizes all X axis to have the same interval/move at the same time
  synchronizeXAxis() {
    const syncedAxes = this.charts.map((chart: any) => chart.getDefaultAxisX());
    synchronizeAxisIntervals(...syncedAxes);
  }

  // Custom cursor logic that is synchronized between all charts
  customCursor() {
    // Create UI elements for custom cursor.
    const resultTable = this.dashboard
      .addUIElement(UILayoutBuilders.Column, this.dashboard.engine.scale)
      .setMouseInteractions(false)
      .setOrigin(UIOrigins.LeftBottom)
      .setMargin(5)
      .setBackground((background: any) =>
        background
          // Style same as Theme result table.
          .setFillStyle(this.dashboard.getTheme().resultTableFillStyle)
          .setStrokeStyle(this.dashboard.getTheme().resultTableStrokeStyle)
      );

    const resultTableTextBuilder = UIElementBuilders.TextBox
      // Style same as Theme result table text.
      .addStyler((textBox) =>
        textBox.setTextFillStyle(
          this.dashboard.getTheme().resultTableTextFillStyle
        )
      );

    const rowX = resultTable
      .addElement(UILayoutBuilders.Row)
      .addElement(resultTableTextBuilder);

    const rowsY = this.series.map(() => {
      return resultTable
        .addElement(UILayoutBuilders.Row)
        .addElement(resultTableTextBuilder);
    });

    const tickX = this.charts[this.channelCount - 1]
      .getDefaultAxisX()
      .addCustomTick();

    const ticksX: any[] = [];
    this.charts.forEach((chart: any, i: any) => {
      if (i !== this.channelCount - 1) {
        ticksX.push(
          chart
            .getDefaultAxisX()
            .addConstantLine()
            .setValue(0)
            .setMouseInteractions(false)
            // Style according to Theme custom tick grid stroke.
            .setStrokeStyle(chart.getTheme().customTickGridStrokeStyle)
        );
      }
    });

    const ticksY = this.series.map((_el: any, i: number) => {
      return this.charts[i].getDefaultAxisY().addCustomTick();
    });

    const setCustomCursorVisible = (visible: any) => {
      if (!visible) {
        resultTable.dispose();
        tickX.dispose();
        ticksY.forEach((el: any) => el.dispose());
        ticksX.forEach((el) => el.dispose());
      } else {
        resultTable.restore();
        tickX.restore();
        ticksY.forEach((el: any) => el.restore());
        ticksX.forEach((el) => el.restore());
      }
    };

    // Hide custom cursor components initially.
    setCustomCursorVisible(false);

    // Implement custom cursor logic with events.
    this.charts.forEach((chart: any, i: number) => {
      const AxisX = chart.getDefaultAxisX();

      // The bottom X Axis, which shows ticks for all stacked charts.
      const axisX = this.charts[this.charts.length - 1].getDefaultAxisX();

      chart.onSeriesBackgroundMouseMove((_: any, event: any) => {
        // mouse location in web page
        const mouseLocationClient = {
          x: event.clientX,
          y: event.clientY,
        };
        // Translate mouse location to LCJS coordinate system for solving data points from series, and translating to Axes.
        const mouseLocationEngine = chart.engine.clientLocation2Engine(
          mouseLocationClient.x,
          mouseLocationClient.y
        );

        // Find the nearest data point to the mouse.
        const nearestDataPoints = this.series.map((el: any) =>
          el.solveNearestFromScreen(mouseLocationEngine)
        );

        // Abort operation if any of solved data points is `undefined`.
        if (nearestDataPoints.includes(undefined)) {
          setCustomCursorVisible(false);
          return;
        }

        // location of nearest point of current chart
        const nearestPointLocation = nearestDataPoints[i].location;

        // Translate mouse location to dashboard scale.
        const mouseLocationAxis = translatePoint(
          nearestPointLocation,
          // Source coordinate system.
          this.series[i].scale,
          // Target coordinate system.
          this.dashboard.engine.scale
        );

        // Set custom cursor location.
        resultTable.setPosition({
          x: mouseLocationAxis.x,
          y: mouseLocationEngine.y,
        });

        // Change origin of result table based on cursor location.
        if (nearestPointLocation.x > AxisX.getInterval().end / 1.5) {
          resultTable.setOrigin(UIOrigins.RightBottom);
        } else {
          resultTable.setOrigin(UIOrigins.LeftBottom);
        }

        // Format result table text.
        rowX.setText(
          `Time: ${axisX.formatValue(nearestDataPoints[i].location.x)}`
        );
        rowsY.forEach((rowY: any, i: number) => {
          rowY.setText(
            `${this.channels[i]}: ${this.charts[i]
              .getDefaultAxisY()
              .formatValue(nearestDataPoints[i].location.y)}`
          );
        });

        // Position custom ticks.
        tickX.setValue(nearestDataPoints[i].location.x);
        ticksX.forEach((tick) => {
          tick.setValue(tickX.getValue());
        });
        ticksY.forEach((tick: any, i: number) => {
          tick.setValue(nearestDataPoints[i].location.y);
        });

        // Display cursor.
        setCustomCursorVisible(true);
      });

      // hide custom cursor and ticks if mouse leaves chart area
      chart.onSeriesBackgroundMouseLeave(() => {
        setCustomCursorVisible(false);
      });

      // hide custom cursor and ticks on Drag
      chart.onSeriesBackgroundMouseDragStart(() => {
        setCustomCursorVisible(false);
      });
    });
  }
}

export default ChartClass;
