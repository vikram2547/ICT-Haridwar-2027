import { Divider } from "antd";
import { getMergedStatus } from "antd/es/_util/statusUtils";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const getFinalSLA = (
  tentage,
  sanitization,
  wastes,
  bins,
  selectedSector,
  sectorVendors
) => {
  let finalObj = {};

  // data = [];
  // categories = ["vendor 1", "vendor 3"];

  //  {
  //       sector: "Sector 1",
  //       ven: "vendor 1",
  //       sections: {
  //         tentage: 75,
  //         sanitization: 65,
  //         wastes: 80,
  //       },
  //     },

  const stats = {
    "vendor 1": 0,
    "vendor 2": 0,
    "vendor 3": 0,
    "vendor 4": 0,
    "vendor 5": 0,
  };

  for (const el of sectorVendors) {
    if (selectedSector.includes(el.sector)) {
      for (const element of el.vens) {
        if (tentage) {
          stats[element.ven] = stats[element.ven] + element.sections.tentage;
        }
        if (sanitization) {
          stats[element.ven] =
            stats[element.ven] + element.sections.sanitization;
        }
        if (wastes) {
          stats[element.ven] = stats[element.ven] + element.sections.wastes;
        }
        if (bins) {
          stats[element.ven] = stats[element.ven] + element.sections.bins;
        }
      }
    }
  }

  let totalSections = 0;

  if (tentage) {
    totalSections++;
  }
  if (sanitization) {
    totalSections++;
  }
  if (wastes) {
    totalSections++;
  }

  if (bins) {
    totalSections++;
  }

  let data = [];
  let cats = Object.keys(stats);

  for (const key in stats) {
    data.push(Math.floor(stats[key] / totalSections));
  }

  return { data, cats };
};

const DistributedColumnChart = ({
  tentage,
  sanitization,
  wastes,
  bins,
  selectedSector,
}) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const sectorVendors = [
      {
        sector: "Sector 1",
        vens: [
          {
            ven: "vendor 1",
            sections: {
              tentage: 75,
              sanitization: 65,
              wastes: 80,
              bins: 60,
            },
          },
          {
            ven: "vendor 3",
            sections: {
              tentage: 65,
              sanitization: 85,
              wastes: 90,
              bins: 85,
            },
          },
        ],
      },
      {
        sector: "Sector 2",
        vens: [
          {
            ven: "vendor 2",
            sections: {
              tentage: 85,
              sanitization: 75,
              wastes: 80,
              bins: 77,
            },
          },
          {
            ven: "vendor 5",
            sections: {
              tentage: 50,
              sanitization: 65,
              wastes: 95,
              bins: 87,
            },
          },
        ],
      },

      {
        sector: "Sector 3",
        vens: [
          {
            ven: "vendor 4",
            sections: {
              tentage: 75,
              sanitization: 95,
              wastes: 40,
              bins: 67,
            },
          },
        ],
      },
    ];

    const finalObj = getFinalSLA(
      tentage,
      sanitization,
      wastes,
      bins,
      selectedSector,
      sectorVendors
    );

    setData(() => finalObj.data);
    setCategories(() => finalObj.cats);
  }, [tentage, sanitization, wastes, selectedSector, bins]);

  const series = [
    {
      name: "Performance",
      data,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        distributed: true, // Distribute each column
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false, // Hide legend if not needed
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: [
            "#008FFB",
            "#00E396",
            "#FEB019",
            "#FF4560",
            "#775DD0",
            // "#546E7A",
            // "#26A69A",
          ],
          fontSize: "12px",
        },
      },
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      // "#546E7A",
      // "#26A69A",
    ],
    yaxis: {
      min: 0, // Set the minimum value to 0%
      max: 100, // Set the maximum value to 100%
      forceNiceScale: true, // Ensure y-axis shows full 0 to 100 range
      labels: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <div className="">
      <div className="text-xl font-semibold text-center -mb-3 mt-1 ">
        Vendor SLA Compliance
        <div className="w-10/12 m-auto">
          <Divider className="m-1 w-10/12 bg-orange-700"></Divider>
        </div>
      </div>

      <div className="w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={330}
        />
      </div>
    </div>
  );
};

export default DistributedColumnChart;
