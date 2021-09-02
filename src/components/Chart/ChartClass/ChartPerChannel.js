/**
 * Create chart for each channel
 */
import lcjs from '@arction/lcjs';

const {
  emptyFill,
  emptyLine,
  AxisTickStrategies,
  AutoCursorModes,
  SolidFill,
  ColorRGBA,
  UIElementBuilders,
  Themes,
  AxisScrollStrategies,
  ColorHEX,
} = lcjs;

class ChartPerChannel {
  constructor(dashboard, channelCount) {
    this.dashboard = dashboard;
    this.channelCount = channelCount;
    this.chartRowSize = 2; //Change it later to dynamicly adjust.

    this.charts = []; //An array containing each chart object.

    this.createChartforEachChannel();

    return this.charts;
  }

  createChartforEachChannel() {
    //Create chart for each channel
    for (let i = 0; i < this.channelCount; i++) {
      const chart = this.dashboard.createChartXY({
        theme: Themes.dark,
        columnIndex: 0,
        rowIndex: i === 0 ? 0 : this.chartRowSize,
        columnSpan: 1,
        rowSpan: 2,
      });

      chart.setBackgroundFillStyle(
        new SolidFill({
          color: ColorHEX('#1E1E1E'),
        }),
      );

      //Customizations
      chart.setMouseInteractionRectangleFit(false).setMouseInteractionRectangleZoom(false);

      //Disable X and Y axis animations.
      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.fitting);
      chart.getDefaultAxisY().disableAnimations();
      chart.getDefaultAxisY().getAxisInteractionReleaseByDoubleClicking();

      // Disable default auto cursor.
      chart.setAutoCursorMode(AutoCursorModes.disabled);

      if (i === 0) {
        chart.setTitle('Sensor Data');
      } else {
        chart.setTitleFillStyle(emptyFill);
        //Add to chartRowIndex for channels other than 1 so that they all be the same size
        this.chartRowSize += 2;
      }

      chart.getDefaultAxisX().setInterval(0, 20.0).setScrollStrategy(AxisScrollStrategies.progressive);

      // Only display X ticks for bottom chart.
      if (i !== this.channelCount - 1) {
        chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty);
      } else {
        chart.getDefaultAxisX().setTitle('Seconds').setScrollStrategy(AxisScrollStrategies.progressive);
      }

      // Sync X axes of stacked charts by adding an invisible tick to each Y axis with preset length.
      chart
        .getDefaultAxisY()
        .addCustomTick(UIElementBuilders.AxisTick)
        // Preset length is configured with tick length property.
        .setTickLength(50)
        // Following code makes the tick invisible.
        .setTextFormatter(() => '')
        .setGridStrokeStyle(emptyLine)
        .setMarker(marker =>
          marker.setTickStyle(
            new SolidFill({
              color: ColorRGBA(0, 0, 0, 0),
            }),
          ),
        );
      this.charts.push(chart); //Add the final chart to charts array
    }
  }
}

export default ChartPerChannel;
