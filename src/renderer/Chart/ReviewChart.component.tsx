import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import ReviewChartClass from 'renderer/Chart/ChartClass/ReviewChart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType } from 'utils/constants';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  recordState: any;
  setLoading?: any;
  children?: JSX.Element | JSX.Element[];
};

// Prepares and enders the chart
const ReviewChart = ({
  type,
  recordState,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);

  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const currentTimeStamp = useAppSelector(
    (state) => state.chartState.currentEventTimeStamp
  );
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const windowResized = useAppSelector((state) => state.appState.windowResized);
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerId = 'reviewChart';
  const chartRef = useRef<ReviewChartClass | null>(null);

  let chart: ReviewChartClass | undefined;

  useEffect(() => {
    requestAnimationFrame(() => {
      // Create chart, series and any other static components.
      console.log('create chart');
      // Store references to chart components.
      chart = new ReviewChartClass(
        channels || ['No Channels Found'],
        type,
        samplingRate,
        containerId
      );

      chart.createReviewChart();

      // Keep a ref to the chart
      chartRef.current = chart as any;

      setChartLoaded(true);
      setLoading(false);
    });
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      chart?.cleanup();
      setChartLoaded(false);
      chart = undefined;
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth, offsetHeight } = container;
      //@ts-ignore
      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      chartRef.current && chartRef.current?.dashboard?.setHeight(offsetHeight);

      container.style.overflowX = 'hidden';
      container.style.overflowY = 'hidden';
    });
  }, [reviewSidebar, windowResized]);

  useEffect(() => {
    chartLoaded && chartRef.current && chartRef.current.loadInitialData();
  }, [chartLoaded]);

  useEffect(() => {
    console.log(currentTimeStamp);
    chartRef.current?.setInterval(currentTimeStamp);
  }, [currentTimeStamp]);

  useEffect(() => {
    chartRef.current?.clearCharts();
    chartRef.current?.loadInitialData();
  }, [recordState]);

  return (
    <>
      {chartLoaded && chartRef.current?.chartOptions && (
        <ChartToolbar
          chartOptions={chartRef.current.chartOptions}
          type={type}
        />
      )}

      <div
        key={containerId}
        className="absolute top-0 left-0 w-full h-[calc(100%-50px)]"
        id={containerId}
      />
      {children}
    </>
  );
};

export default withLoading(ReviewChart, 'Loading Data...');
