import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  ActiveElement,
  BarControllerChartOptions,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartEvent,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LinearScale,
  PluginChartOptions,
  ScaleChartOptions,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { getConvertedHoursAndMinutesText } from '../../utils/js/getConvertedHoursAndMinutesText';

interface StatisticsChartProps {
  weekChartData: number[];
  activeDayIndex: number;
  pomodoroTime: number;
  handleDayChangeClick: (index: number) => void;
}

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function StatisticsChart({
  weekChartData,
  activeDayIndex,
  pomodoroTime,
  handleDayChangeClick,
}: StatisticsChartProps) {
  const options: _DeepPartialObject<
    CoreChartOptions<'bar'> &
      ElementChartOptions<'bar'> &
      PluginChartOptions<'bar'> &
      DatasetChartOptions<'bar'> &
      ScaleChartOptions<'bar'> &
      BarControllerChartOptions
  > = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(tooltipItem: TooltipItem<'bar'>): string | string[] | void {
            return getConvertedHoursAndMinutesText({
              totalSeconds: Number(tooltipItem.raw),
              hoursFormat: 'short',
              minutesFormat: 'middle',
              displayZeroHours: false,
            });
          },
        },
      },
    },
    scales: {
      y: {
        position: 'right',
        grid: {
          color: '#d6d6d6',
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          stepSize: pomodoroTime,
          callback: (tickValue) =>
            getConvertedHoursAndMinutesText({
              totalSeconds: +tickValue,
              hoursFormat: 'short',
              minutesFormat: 'middle',
              displayZeroHours: false,
            }),
          color: '#333333',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 24,
          },
          color: (ctx) => {
            return ctx.index === activeDayIndex ? '#DC3E22' : '#999999';
          },
        },
      },
    },
    elements: {
      bar: {
        hoverBackgroundColor: '#EE735D',
      },
    },
    onClick: (event: ChartEvent, activeElements: ActiveElement[]) => {
      if (activeElements.length > 0) {
        handleDayChangeClick(activeElements[0].index);
      }
    },
  };

  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const data: ChartData<'bar', number[], string> = {
    labels,
    datasets: [
      {
        data: weekChartData,
        backgroundColor: (ctx) => {
          return ctx.dataIndex === activeDayIndex ? '#DC3E22' : '#999999';
        },
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
