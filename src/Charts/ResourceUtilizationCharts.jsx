import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const normalizePercentages = (data, minRange = 70, maxRange = 95) => {
  const minData = Math.min(...data);
  const maxData = Math.max(...data);

  // Normalize data to range [0, 1]
  const normalizedData = data.map(
    (value) => (value - minData) / (maxData - minData)
  );

  // Scale normalized data to range [minRange, maxRange]
  return normalizedData.map(
    (value) => minRange + value * (maxRange - minRange)
  );
};

const ResourceUtilizationCharts = ({
  selectedSectors,
  tentage,
  sanitization,
  wastes,
}) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const sector1 = { Tentage: 400, Sanitization: 500, Wastes: 800 };
    const sector2 = { Tentage: 270, Sanitization: 350, Wastes: 300 };
    const sector3 = { Tentage: 330, Sanitization: 250, Wastes: 400 };

    const sectors = [];

    if (selectedSectors.includes("Sector 1")) {
      sectors.push(sector1);
    }

    if (selectedSectors.includes("Sector 2")) {
      sectors.push(sector2);
    }
    if (selectedSectors.includes("Sector 3")) {
      sectors.push(sector3);
    }

    const dailyUtilization = [
      { day: "Mon", Tentage: 70, Sanitization: 100, Wastes: 160 },
      {
        day: "Tue",
        Tentage: 50,
        Sanitization: 120,
        Wastes: 130,
      },
      {
        day: "Wed",
        Tentage: 120,
        Sanitization: 150,
        Wastes: 310,
      },
      {
        day: "Thur",
        Tentage: 300,
        Sanitization: 180,
        Wastes: 420,
      },
      { day: "Fri", Tentage: 210, Sanitization: 200, Wastes: 240 },
      {
        day: "Sat",
        Tentage: 220,
        Sanitization: 220,
        Wastes: 260,
      },
      { day: "Sun", Tentage: 230, Sanitization: 250, Wastes: 280 },
    ];

    const sector12 = [
      {
        day: "Mon",
        Tentage: 120 + 140,
        Sanitization: 10 + 110,
        Wastes: 160 + 450,
      },
      {
        day: "Tue",
        Tentage: 100 + 70,
        Sanitization: 100 + 130,
        Wastes: 180 + 170,
      },
      {
        day: "Wed",
        Tentage: 120 + 100,
        Sanitization: 150 + 160,
        Wastes: 200 + 190,
      },
      {
        day: "Thur",
        Tentage: 300 + 200,
        Sanitization: 180 + 190,
        Wastes: 220 + 210,
      },
      {
        day: "Fri",
        Tentage: 210 + 100,
        Sanitization: 200 + 210,
        Wastes: 240 + 330,
      },
      {
        day: "Sat",
        Tentage: 220 + 180,
        Sanitization: 220 + 240,
        Wastes: 260 + 250,
      },
      {
        day: "Sun",
        Tentage: 230 + 240,
        Sanitization: 260 + 270,
        Wastes: 280 + 190,
      },
    ];
    const sector13 = [
      {
        day: "Mon",
        Tentage: 120 + 110,
        Sanitization: 90 + 120,
        Wastes: 160 + 70,
      },
      {
        day: "Tue",
        Tentage: 100 + 160,
        Sanitization: 120 + 140,
        Wastes: 180 + 160,
      },
      {
        day: "Wed",
        Tentage: 120 + 170,
        Sanitization: 150 + 170,
        Wastes: 200 + 180,
      },
      {
        day: "Thur",
        Tentage: 300 + 210,
        Sanitization: 130 + 200,
        Wastes: 220 + 220,
      },
      {
        day: "Fri",
        Tentage: 210 + 230,
        Sanitization: 100 + 230,
        Wastes: 240 + 260,
      },
      {
        day: "Sat",
        Tentage: 220 + 250,
        Sanitization: 180 + 250,
        Wastes: 260 + 240,
      },
      {
        day: "Sun",
        Tentage: 230 + 270,
        Sanitization: 250 + 280,
        Wastes: 280 + 100,
      },
    ];

    const sector23 = [
      {
        day: "Mon",
        Tentage: 140 + 150,
        Sanitization: 200 + 120,
        Wastes: 150 + 140,
      },
      {
        day: "Tue",
        Tentage: 160 + 150,
        Sanitization: 130 + 140,
        Wastes: 170 + 160,
      },
      {
        day: "Wed",
        Tentage: 180 + 200,
        Sanitization: 250 + 170,
        Wastes: 190 + 180,
      },
      {
        day: "Thur",
        Tentage: 220 + 210,
        Sanitization: 140 + 200,
        Wastes: 210 + 220,
      },
      {
        day: "Fri",
        Tentage: 200 + 230,
        Sanitization: 250 + 230,
        Wastes: 230 + 260,
      },
      {
        day: "Sat",
        Tentage: 210 + 250,
        Sanitization: 240 + 250,
        Wastes: 250 + 280,
      },
      {
        day: "Sun",
        Tentage: 240 + 270,
        Sanitization: 270 + 280,
        Wastes: 290 + 300,
      },
    ];

    const dailyUtilization2 = [
      { day: "Mon", Tentage: 170, Sanitization: 240, Wastes: 170 },
      { day: "Tue", Tentage: 120, Sanitization: 300, Wastes: 150 },
      { day: "Wed", Tentage: 172, Sanitization: 3500, Wastes: 170 },
      { day: "Thur", Tentage: 170, Sanitization: 450, Wastes: 900 },
      { day: "Fri", Tentage: 180, Sanitization: 670, Wastes: 280 },
      { day: "Sat", Tentage: 190, Sanitization: 820, Wastes: 530 },
      { day: "Sun", Tentage: 200, Sanitization: 960, Wastes: 530 },
    ];
    const dailyUtilization3 = [
      { day: "Mon", Tentage: 340, Sanitization: 190, Wastes: 140 },
      { day: "Tue", Tentage: 130, Sanitization: 140, Wastes: 160 },
      { day: "Wed", Tentage: 190, Sanitization: 100, Wastes: 120 },
      { day: "Thur", Tentage: 210, Sanitization: 300, Wastes: 220 },
      { day: "Fri", Tentage: 230, Sanitization: 130, Wastes: 260 },
      { day: "Sat", Tentage: 250, Sanitization: 350, Wastes: 280 },
      { day: "Sun", Tentage: 470, Sanitization: 280, Wastes: 300 },
    ];

    const totalResources = sectors.reduce(
      (acc, sector) => ({
        Tentage: acc.Tentage + sector.Tentage,
        Sanitization: acc.Sanitization + sector.Sanitization,
        Wastes: acc.Wastes + sector.Wastes,
      }),
      { Tentage: 0, Sanitization: 0, Wastes: 0 }
    );

    const weeklyData = {
      Tentage: [],
      Sanitization: [],
      Wastes: [],
    };

    let final;

    if (
      selectedSectors.includes("Sector 1") &&
      selectedSectors.includes("Sector 2") &&
      selectedSectors.includes("Sector 3")
    ) {
      final = dailyUtilization;
    } else if (
      selectedSectors.includes("Sector 1") &&
      selectedSectors.includes("Sector 2")
    ) {
      final = sector12;
    } else if (
      selectedSectors.includes("Sector 1") &&
      selectedSectors.includes("Sector 3")
    ) {
      final = sector13;
    } else if (
      selectedSectors.includes("Sector 2") &&
      selectedSectors.includes("Sector 3")
    ) {
      final = sector23;
    } else if (selectedSectors.includes("Sector 1")) {
      final = dailyUtilization2;
    } else if (selectedSectors.includes("Sector 2")) {
      final = dailyUtilization3;
    } else {
      final = [
        { day: "Mon", Tentage: 140, Sanitization: 1340, Wastes: 1270 },
        { day: "Tue", Tentage: 150, Sanitization: 350, Wastes: 1340 },
        { day: "Wed", Tentage: 160, Sanitization: 650, Wastes: 190 },
        { day: "Thur", Tentage: 170, Sanitization: 460, Wastes: 300 },
        { day: "Fri", Tentage: 180, Sanitization: 270, Wastes: 610 },
        { day: "Sat", Tentage: 190, Sanitization: 480, Wastes: 820 },
        { day: "Sun", Tentage: 200, Sanitization: 350, Wastes: 530 },
      ];
    }

    final.forEach((dayUtilization) => {
      weeklyData.Tentage.push(
        (dayUtilization.Tentage / totalResources.Tentage) * 100
      );
      weeklyData.Sanitization.push(
        (dayUtilization.Sanitization / totalResources.Sanitization) * 100
      );
      weeklyData.Wastes.push(
        (dayUtilization.Wastes / totalResources.Wastes) * 100
      );
    });

    // Normalize percentages to be within 85% to 95%
    const finalData = [];

    if (tentage) {
      finalData.push({
        name: "Tentage",
        data: normalizePercentages(weeklyData.Tentage),
      });
    }

    if (sanitization) {
      finalData.push({
        name: "Sanitization",
        data: normalizePercentages(weeklyData.Sanitization),
      });
    }

    if (wastes) {
      finalData.push({
        name: "Vehicle",
        data: normalizePercentages(weeklyData.Wastes),
      });
    }

    setData(() => finalData);
    setCategories(() => dailyUtilization.map((day) => day.day));
  }, [selectedSectors, tentage, wastes, sanitization]);

  const series = data;

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      min: 0, // Y-axis starts at 85%
      max: 100, // Y-axis ends at 95%
      title: {
        text: "Percentage (%)",
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + "%"; // Format Y-axis labels without decimals
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
    },
    markers: {
      size: 0,
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="">
      <div className="text-xl font-semibold text-center -mb-2 mt-1 ">
        Weekly Resource Utilization
        <div className="w-10/12 m-auto">
          <Divider className="m-1 w-10/12 bg-orange-700"></Divider>
        </div>
      </div>

      <div className="w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={330}
        />
      </div>
    </div>
  );
};

export default ResourceUtilizationCharts;
