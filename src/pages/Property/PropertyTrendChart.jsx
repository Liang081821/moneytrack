import { useGlobalContext } from "@/context/GlobalContext";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function PropertyTrendChart() {
  const { historyData } = useGlobalContext();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (historyData && historyData.length > 0) {
      const sortedData = [...historyData].sort(
        (a, b) => a.time.toDate() - b.time.toDate(),
      );

      const labels = sortedData.map((data) =>
        data.time.toDate().toLocaleString("zh-TW", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      );

      const expenseData = sortedData.map((data) => data.expense);
      const investmentData = sortedData.map((data) => data.investment);
      const savingData = sortedData.map((data) => data.saving);
      const totalAssetsData = sortedData.map((data) => data.totalAssets);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "消費帳 (NT$)",
            data: expenseData,
            fill: true,
            borderColor: "#9dbebb",
            backgroundColor: "rgba(157, 190, 187, 0.3)",
            tension: 0.4,
          },
          {
            label: "投資帳 (NT$)",
            data: investmentData,
            fill: true,
            borderColor: "#babfd1",
            backgroundColor: "rgba(186, 191, 209, 0.3)",
            tension: 0.4,
          },
          {
            label: "儲蓄 (NT$)",
            data: savingData,
            fill: true,
            borderColor: "#82A0BC",
            backgroundColor: "rgba(130, 160, 188, 0.3)",
            tension: 0.4,
          },
          {
            label: "總資產 (NT$)",
            data: totalAssetsData,
            fill: false,
            borderColor: "#4BC0C0",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });
    }
  }, [historyData]);

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          enabled: true,
          mode: "x",
          speed: 0.1,
        },
      },
      tooltip: {
        titleFont: {
          size: 18,
        },
        bodyFont: {
          size: 16,
        },
      },
      legend: {
        display: true,
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "時間",
          font: {
            size: 18,
          },
        },
        ticks: {
          font: {
            size: 16,
          },
          padding: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "資產 (NT$)",
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="relative w-full rounded-lg px-4 py-7">
      <div className="h-[600px]">
        <Line
          data={chartData}
          options={options}
          plugins={[zoomPlugin, ChartDataLabels]}
        />
      </div>
    </div>
  );
}
