import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

function App() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [pointLabel, setPointLabel] = useState({});
  const [arcsData, setArcsData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const globe_ref = useRef();

  const hourRightNow = new Date().getHours();
  const isDay = hourRightNow >= 5 && hourRightNow <= 18;

  const Options = [
    { label: "Lahore", value: { lat: 31.5204, lng: 74.3587 } },
    { label: "Islamabad", value: { lat: 33.738045, lng: 73.084488 } },
    { label: "Kuwait", value: { lat: 29.378586, lng: 47.990341 } },
  ];

  function StartSelected(value) {
    if (value != "") {
      let valued = Options.find((x) => x.label == value);
      setPointLabel({
        label: value,
        lat: valued.value.lat,
        lng: valued.value.lat.lng,
      });
      setArcsData([]);
      globe_ref.current.pointOfView(
        { lat: valued.value.lat, lng: valued.value.lng, altitude: 0.5 },
        800
      );
    } else {
      globe_ref.current.pointOfView({ lat: 0, lng: 0, altitude: 3 }, 800);
    }
  }

  function endSelected(value) {
    if (value != "") {
      let endValue = Options.find((x) => x.label == value).value;
      let startValue = Options.find((x) => x.label == fromLocation).value;

      setArcsData((currArc) => [
        {
          startLat: startValue.lat,
          startLng: startValue.lng,

          endLat: endValue.lat,
          endLng: endValue.lng,
        },
      ]);
      globe_ref.current.pointOfView(
        {
          lat: (startValue.lat + endValue.lat) / 2,
          lng: (startValue.lng + endValue.lng) / 2,
          altitude: 1,
        },
        800
      );
    } else if (fromLocation != "") {
      let startValue = Options.find((x) => x.label == fromLocation).value;
      globe_ref.current.pointOfView(
        { lat: startValue.lat, lng: startValue.lng, altitude: 0.5 },
        800
      );
      setArcsData((currArc) => []);
    } else {
      globe_ref.current.pointOfView({ lat: 0, lng: 0, altitude: 3 }, 800);
      setArcsData((currArc) => []);
    }
  }

  const labelsData = [
    {
      label: "Lahore",
      lat: 31.5204,
      lng: 74.3587,
      labelText: "Lahore",
    },
    {
      label: "Kuwait",
      lat: 29.378586,
      lng: 47.990341,
      labelText: "Kuwait",
    },
    {
      label: "Islamabad",
      lat: 33.738045,
      lng: 73.084488,
      labelText: "Islamabad",
    },
  ];

  const earthImage = isDay
    ? "//unpkg.com/three-globe/example/img/earth-day.jpg"
    : "//unpkg.com/three-globe/example/img/earth-night.jpg";

  return (
    <>
      <div className=" w-screen h-screen flex flex-col">
        <div className="w-full h-max py-10 flex justify-center gap-5 bg-green-400">
          {/*  From Locations */}
          <select
            className=" w-44 border border-black border-opacity-50 rounded-md  px-4 py-2"
            value={fromLocation}
            onChange={(e) => {
              setFromLocation(e.target.value);
              setToLocation("");
              StartSelected(e.target.value);
            }}
          >
            <option value="">From</option>
            {Options.map((item, index) => (
              <option value={item.label}>{item.label}</option>
            ))}
          </select>

          {/*  To Locations */}
          <select
            className=" w-44 border border-black border-opacity-50 rounded-md  px-4 py-2"
            disabled={fromLocation == ""}
            value={toLocation}
            onChange={(e) => {
              setToLocation(e.target.value);
              endSelected(e.target.value);
            }}
          >
            <option value="">To</option>
            {Options.map((item, index) => (
              <>
                {fromLocation != item.label && (
                  <option value={item.label}>{item.label}</option>
                )}
              </>
            ))}
          </select>

          <div>{/* <button onClick={StartSelected}> click me</button> */}</div>
        </div>

        <Globe
          ref={globe_ref}
          backgroundColor="rgba(0,0,0,255)"
          width={width}
          height={height}
          globeImageUrl={earthImage}
          showAtmosphere
          labelsData={labelsData}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.label}
          labelResolution={8}
          labelColor={() => (isDay ? "black" : "white")}
          arcsData={arcsData}
          arcDashLength={1}
          arcStroke={0.5}
          arcDashGap={0.5}
          arcDashInitialGap={1}
          arcsTransitionDuration={0}
          arcDashAnimateTime={() => Math.random() * 2500}
          arcColor={() => "red"}
        />
      </div>
    </>
  );
}

export default App;
