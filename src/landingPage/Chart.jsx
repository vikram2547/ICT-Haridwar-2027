import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useOutletContext } from "react-router";
import { max } from "moment";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = (dict, lang) => ["Tentage", "Sanitation", "Waste", "Bins"];

const Chart = () => {
  const [dict, lang] = useOutletContext();

  // Update data with real values
  const data = {
    labels: labels(dict, lang),
    datasets: [
      {
        label: "Current Metrics",
        backgroundColor: [
          "rgba(75, 192, 192, 1)", // Tentage
          "rgba(255, 99, 132, 1)", // Sanitation
          "rgba(54, 162, 235, 1)", // Waste
          "rgba(255, 206, 86, 1)", // Vehicle
        ],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        data: [94, 85, 90, 50], // Replace these with actual values
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
          text: "Categories",
        },
      },
      y: {
        max: 100,
        beginAtZero: true,
        title: {
          display: true,
          text: "Values",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = labels(dict, lang)[context.dataIndex] || "";
            if (label) {
              label += ": ";
            }
            label += context.raw;
            return label + "%";
          },
        },
      },
      legend: {
        display: false, // Optionally show legend
      },
    },
  };

  return (
    <div className="mx-auto">
      <div className="relative h-full flex items-center justify-center w-60">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
