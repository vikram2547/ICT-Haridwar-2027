import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import toilet from "../assets/MonitoringImages/Dashboard/requireCliningToilet.png";
import cleanedIcon from "../assets/MonitoringImages/Dashboard/ClinedToilets.png";
import UnderMaintenanceIcon from "../assets/MonitoringImages/Dashboard/UnderMaintenanceToilet.png";
// ---

import requireCleaning from "../assets/Dashboard/WasteBins Require Cleaning.png";
import cleanedBin from "../assets/Dashboard/WasteBins Cleaned.png";
import tippers from "../assets/Dashboard/Tippers.png";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const MapData = (props) => {
  return (
    <div className="rounded-md">
      <MapComponent {...props}></MapComponent>
    </div>
  );
};

export default MapData;

// Built-in Leaflet icon for markers
const defaultIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535137.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const tipperIcon = L.icon({
  iconUrl: tippers,
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const tipperData = [
  {
    id: "COM12459",
    currentLocation: "Sector 5",
    route: 2,
    status: "5 collected, 2 remaining",
    vehicleInfo: "UP 70 ST 5896 (#ST5896)",
    avgCollectionTime: "15 min",
    workingStatus: "Working",
    lat: 25.4314,
    lng: 81.8785,
  },
  {
    id: "COM12460",
    currentLocation: "Sector 7",
    route: 3,
    status: "4 collected, 3 remaining",
    vehicleInfo: "UP 70 ST 1234 (#ST1234)",
    avgCollectionTime: "12 min",
    workingStatus: "Working",
    lat: 25.4368,
    lng: 81.8862,
  },
  {
    id: "COM12461",
    currentLocation: "Sector 3",
    route: 4,
    status: "6 collected, 1 remaining",
    vehicleInfo: "UP 70 ST 4859 (#ST4859)",
    avgCollectionTime: "10 min",
    workingStatus: "Working",
    lat: 25.4514,
    lng: 81.8645,
  },
  {
    id: "COM12462",
    currentLocation: "Sector 8",
    route: 5,
    status: "3 collected, 4 remaining",
    vehicleInfo: "UP 70 ST 1289 (#ST1289)",
    avgCollectionTime: "18 min",
    workingStatus: "Working",
    lat: 25.4212,
    lng: 81.8548,
  },
  {
    id: "COM12463",
    currentLocation: "Sector 4",
    route: 1,
    status: "7 collected, 0 remaining",
    vehicleInfo: "UP 70 ST 5897 (#ST5897)",
    avgCollectionTime: "9 min",
    workingStatus: "Working",
    lat: 25.4618,
    lng: 81.8765,
  },
  {
    id: "COM12464",
    currentLocation: "Sector 6",
    route: 2,
    status: "2 collected, 5 remaining",
    vehicleInfo: "UP 70 ST 1596 (#ST1596)",
    avgCollectionTime: "20 min",
    workingStatus: "Inactive",
    lat: 25.4414,
    lng: 81.8668,
  },
];

const toiletIconsMap = L.icon({
  iconUrl: cleanedBin,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const toiletIconCleaningRequire = L.icon({
  iconUrl: requireCleaning,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const tippersIconsMap = L.icon({
  iconUrl: tippers,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Sample data to display in tooltip and popup
const toiletLatLong = [
  {
    id: 1,
    name: "Bin 1",
    lat: 25.4314,
    lng: 81.8785,
    lastCollection: "10:37 AM",
    nextCollection: "12:37 PM",
    responseTime: "15 min",
    status: "Unknown",
  },
  {
    id: 2,
    name: "Bin 2",
    lat: 25.4268,
    lng: 81.8862,
    lastCollection: "11:00 AM",
    nextCollection: "01:00 PM",
    responseTime: "20 min",
    status: "Active",
  },
  {
    id: 3,
    name: "Bin 3",
    lat: 25.4268,
    lng: 81.8162,
    lastCollection: "09:45 AM",
    nextCollection: "11:45 AM",
    responseTime: "18 min",
    status: "Active",
  },
  {
    id: 4,
    name: "Bin 4",
    lat: 25.4614,
    lng: 81.8758,
    lastCollection: "08:30 AM",
    nextCollection: "10:30 AM",
    responseTime: "12 min",
    status: "Unknown",
  },
  {
    id: 5,
    name: "Bin 5",
    lat: 25.4714,
    lng: 81.8648,
    lastCollection: "12:15 PM",
    nextCollection: "02:15 PM",
    responseTime: "22 min",
    status: "Active",
  },
  {
    id: 6,
    name: "Bin 6",
    lat: 25.4068,
    lng: 81.8229,
    lastCollection: "07:45 AM",
    nextCollection: "09:45 AM",
    responseTime: "14 min",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Bin 7",
    lat: 25.4468,
    lng: 81.8169,
    lastCollection: "09:00 AM",
    nextCollection: "11:00 AM",
    responseTime: "19 min",
    status: "Pending",
  },
  {
    id: 8,
    name: "Bin 8",
    lat: 25.4214,
    lng: 81.8465,
    lastCollection: "10:15 AM",
    nextCollection: "12:15 PM",
    responseTime: "17 min",
    status: "Active",
  },
  {
    id: 9,
    name: "Bin 9",
    lat: 25.4358,
    lng: 81.8463,
    lastCollection: "09:30 AM",
    nextCollection: "11:30 AM",
    responseTime: "16 min",
    status: "Active",
  },
  {
    id: 10,
    name: "Bin 10",
    lat: 25.4212,
    lng: 81.8447,
    lastCollection: "11:30 AM",
    nextCollection: "01:30 PM",
    responseTime: "21 min",
    status: "Unknown",
  },
];

const toiletLatLongRequire = [
  {
    id: 11,
    name: "Bin 11",
    lat: 25.4314,
    lng: 81.8548,
    lastCollection: "08:30 AM",
    nextCollection: "10:30 AM",
    responseTime: "15 min",
    status: "Pending",
  },
  {
    id: 12,
    name: "Bin 12",
    lat: 25.4314,
    lng: 81.8548,
    lastCollection: "07:15 AM",
    nextCollection: "09:15 AM",
    responseTime: "14 min",
    status: "Pending",
  },
  {
    id: 13,
    name: "Bin 13",
    lat: 25.4368,
    lng: 81.8729,
    lastCollection: "09:45 AM",
    nextCollection: "11:45 AM",
    responseTime: "16 min",
    status: "Inactive",
  },
  {
    id: 14,
    name: "Bin 14",
    lat: 25.4268,
    lng: 81.8269,
    lastCollection: "11:00 AM",
    nextCollection: "01:00 PM",
    responseTime: "20 min",
    status: "Pending",
  },
  {
    id: 15,
    name: "Bin 15",
    lat: 25.4298,
    lng: 81.8629,
    lastCollection: "12:00 PM",
    nextCollection: "02:00 PM",
    responseTime: "22 min",
    status: "Pending",
  },
  {
    id: 16,
    name: "Bin 16",
    lat: 25.4394,
    lng: 81.8523,
    lastCollection: "07:30 AM",
    nextCollection: "09:30 AM",
    responseTime: "12 min",
    status: "Pending",
  },
  {
    id: 17,
    name: "Bin 17",
    lat: 25.4258,
    lng: 81.8347,
    lastCollection: "09:00 AM",
    nextCollection: "11:00 AM",
    responseTime: "18 min",
    status: "Inactive",
  },
  {
    id: 18,
    name: "Bin 18",
    lat: 25.4324,
    lng: 81.8498,
    lastCollection: "06:45 AM",
    nextCollection: "08:45 AM",
    responseTime: "13 min",
    status: "Pending",
  },
  {
    id: 19,
    name: "Bin 19",
    lat: 25.4438,
    lng: 81.8663,
    lastCollection: "11:15 AM",
    nextCollection: "01:15 PM",
    responseTime: "19 min",
    status: "Pending",
  },
  {
    id: 20,
    name: "Bin 20",
    lat: 25.4522,
    lng: 81.8764,
    lastCollection: "10:45 AM",
    nextCollection: "12:45 PM",
    responseTime: "17 min",
    status: "Inactive",
  },
];

const MapComponent = ({ tentage = true }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    lat: 25.435,
    lng: 81.8807,
  });

  const [routeControl, setRouteControl] = useState(null);

  const handleMarkerClick = (lat, lng) => {
    if (!mapRef.current) {
      console.error("Map is not available yet.");
      return;
    }

    const map = mapRef.current;

    const newRouteControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(lat, lng),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
    });

    newRouteControl.addTo(map);
    setRouteControl(newRouteControl);
  };

  return (
    <div>
      <MapContainer
        center={[25.4358, 81.8463]}
        zoom={13}
        minZoom={10}
        maxZoom={18}
        style={{ height: "400px", width: "100%", zIndex: 1 }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {toiletLatLong.map((place, index) => (
          <Marker
            key={index + place}
            position={[place.lat, place.lng]}
            icon={toiletIconsMap}
            eventHandlers={{
              click: () => handleMarkerClick(place.lat, place.lng),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div>
                <strong>{place.name}</strong>
                <br />
                <span>Last Collection: {place.lastCollection}</span>
                <br />
                <span>Next Collection: {place.nextCollection}</span>
                <br />
                <span>Avg Response Time: {place.responseTime}</span>
                <br />
                Status:{" "}
                <Button size="small" className="bg-lime-300 text-black">
                  {place.status}
                </Button>
              </div>
            </Tooltip>
          </Marker>
        ))}
        {toiletLatLongRequire.map((place, index) => (
          <Marker
            key={index + place}
            position={[place.lat, place.lng]}
            icon={toiletIconCleaningRequire}
            eventHandlers={{
              click: () => handleMarkerClick(place.lat, place.lng),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div>
                <strong>{place.name}</strong>
                <br />
                <span>Last Collection: {place.lastCollection}</span>
                <br />
                <span>Next Collection: {place.nextCollection}</span>
                <br />
                <span>Avg Response Time: {place.responseTime}</span>
                <br />
                <span>
                  Status:{" "}
                  <Button size="small" className="bg-lime-300 text-black">
                    {place.status}
                  </Button>
                </span>
              </div>
            </Tooltip>
          </Marker>
        ))}
        {tipperData.map((tipper, index) => (
          <Marker
            key={index}
            position={[tipper.lat, tipper.lng]}
            icon={tipperIcon}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div>
                <strong>#{tipper.id}</strong>
                <br />
                <span>Current Location: {tipper.currentLocation}</span>
                <br />
                <span>Route: {tipper.route}</span>
                <br />
                <span>Status: {tipper.status}</span>
                <br />
                <span>{tipper.vehicleInfo}</span>
                <br />
                <span>Avg Collection time: {tipper.avgCollectionTime}</span>
                <br />
                <span
                  style={{
                    backgroundColor:
                      tipper.workingStatus === "Working" ? "green" : "red",
                    color: "white",
                    padding: "2px 5px",
                    borderRadius: "5px",
                  }}
                >
                  Working Status: {tipper.workingStatus}
                </span>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
