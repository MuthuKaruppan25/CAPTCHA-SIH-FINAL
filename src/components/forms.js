import React, { useEffect, useState } from "react";
import image from "../Assets/image.png";
import aadhar from "../Assets/aadhar.png";
import WindowIcon from "@mui/icons-material/Window";
import TranslateIcon from "@mui/icons-material/Translate";

const Forms = () => {
  const [startTime, setStartTime] = useState(0);
  const [clickData, setClickData] = useState([]);
  const [pageViews, setPageViews] = useState(0);
  const [referrer, setReferrer] = useState("");
  const [bounceDetected, setBounceDetected] = useState(false);
  const [focusData, setFocusData] = useState([]);
  const [validationErrors, setValidationErrors] = useState(0);
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [mouseMovement, setMouseMovement] = useState([]);
  const [honeypotFilled, setHoneypotFilled] = useState(false);
  const [dynamicInteractions, setDynamicInteractions] = useState([]);
  const [scrollData, setScrollData] = useState([]);
  const [scrollStartTime, setScrollStartTime] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime1, setStartTime1] = useState(null);
  const [fieldData, setFieldData] = useState([]);
  const [pageTimeInterval, setpageTimeInterval] = useState([]);
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    const getBrowserPlugins = () => {
      const pluginList = [];
      if (navigator.plugins.length > 0) {
        for (let i = 0; i < navigator.plugins.length; i++) {
          pluginList.push(navigator.plugins[i].name);
        }
      } else {
        pluginList.push("No plugins detected or plugins are blocked.");
      }
      return pluginList;
    };

    setPlugins(getBrowserPlugins());
  }, []);
  useEffect(() => {
    const handleFocus = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        setStartTime1(Date.now());
        setKeystrokes(0);
      }
    };

    const handleInput = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        setKeystrokes((prev) => prev + 1);
      }
    };

    const handleBlur = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000; // time in seconds

        setFieldData((prevData) => [
          ...prevData,
          {
            fieldName: event.target.name,
            keystrokes,
            timeSpent,
          },
        ]);

        console.log(`Field: ${event.target.name}`);
        console.log(`Keystrokes: ${keystrokes}`);
        console.log(`Time Spent: ${timeSpent} seconds`);
      }
    };

    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("input", handleInput, true);
    document.addEventListener("blur", handleBlur, true);

    return () => {
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("blur", handleBlur, true);
    };
  }, [keystrokes, startTime1]);

  useEffect(() => {
    const screenResolution = {
      width: window.screen.width,
      height: window.screen.height,
    };

    console.log(
      `Screen resolution: ${screenResolution.width}x${screenResolution.height}`
    );

    localStorage.setItem("screenResolution", JSON.stringify(screenResolution));
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    console.log(`User Agent: ${userAgent}`);

    localStorage.setItem("userAgent", userAgent);
  }, []);
  const handleHoneypot = (event) => {
    if (event.target.name === "honeypot" && event.target.value) {
      setHoneypotFilled(true);
    }
  };
  useEffect(() => {
    const referrerURL = document.referrer;
    setReferrer(referrerURL);

    let pageViewCount = sessionStorage.getItem("pageViewCount") || 0;
    pageViewCount = parseInt(pageViewCount) + 1;
    sessionStorage.setItem("pageViewCount", pageViewCount);
    setPageViews(pageViewCount);

    const bounceTimer = setTimeout(() => {
      if (pageViewCount === 1) {
        setBounceDetected(true);
        console.log(
          "Bounce detected: User exited after viewing only one page."
        );
      }
    }, 3000);

    return () => clearTimeout(bounceTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem("referrerInfo", referrer);
    localStorage.setItem("depthOfNavigation", pageViews);

    if (bounceDetected) {
      localStorage.setItem("bounceDetected", "true");
    }
  }, [referrer, pageViews, bounceDetected]);
  useEffect(() => {
    const handlePageView = () => {
      const currentTime = Date.now();
      let pageViewTimes =
        JSON.parse(localStorage.getItem("pageViewTimes")) || [];

      if (pageViewTimes.length > 0) {
        const lastViewTime = pageViewTimes[pageViewTimes.length - 1];
        const timeInterval = (currentTime - lastViewTime) / 1000;

        console.log(
          `Time interval between consecutive page views: ${timeInterval} seconds`
        );

        if (timeInterval < 3) {
          console.log(
            "Consistent, short time interval detected - Potential bot activity."
          );
        }
        pageTimeInterval.push(timeInterval);
      }

      pageViewTimes.push(currentTime);

      localStorage.setItem("pageViewTimes", JSON.stringify(pageViewTimes));
    };

    handlePageView();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const timestamp = Date.now();
      const documentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      const scrollDepth = Math.min(
        (currentScrollPosition / (documentHeight - viewportHeight)) * 100,
        100
      );

      const scrollInfo = {
        timestamp: timestamp,
        scrollPosition: currentScrollPosition,
        scrollDepth: scrollDepth,
        scrollSpeed: 0,
        scrollDirection: "none",
      };

      if (scrollData.length > 0) {
        const lastScroll = scrollData[scrollData.length - 1];
        const timeElapsed = (timestamp - lastScroll.timestamp) / 1000;
        const distanceScrolled = Math.abs(
          currentScrollPosition - lastScroll.scrollPosition
        );
        scrollInfo.scrollSpeed = distanceScrolled / timeElapsed;

        if (currentScrollPosition > lastScroll.scrollPosition) {
          scrollInfo.scrollDirection = "down";
        } else if (currentScrollPosition < lastScroll.scrollPosition) {
          scrollInfo.scrollDirection = "up";
        } else {
          scrollInfo.scrollDirection = "none";
        }
      }

      setScrollData((prevData) => [...prevData, scrollInfo]);
    };

    setScrollStartTime(Date.now());
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollData]);

  useEffect(() => {
    const analyzeScrollBehavior = () => {
      if (scrollData.length < 2) return;

      const suspiciousPattern = scrollData.every((data, index) => {
        if (index === 0) return true;
        const prevData = scrollData[index - 1];
        const speedDifference = Math.abs(
          data.scrollSpeed - prevData.scrollSpeed
        );

        const consistentSpeed = speedDifference < 10;

        const directionPattern = scrollData.map((data) => data.scrollDirection);
        const directionChanges = new Set(directionPattern).size;

        return consistentSpeed && directionChanges <= 1;
      });

      const maxScrollDepth = Math.max(
        ...scrollData.map((data) => data.scrollDepth)
      );
      const timeSpentScrolling = (Date.now() - scrollStartTime) / 1000;

      const fastScrollToBottom = maxScrollDepth > 90 && timeSpentScrolling < 5;

      if (suspiciousPattern || fastScrollToBottom) {
        localStorage.setItem("ScrollData", JSON.stringify(scrollData));
        console.log(
          "Suspicious scrolling behavior detected, possible bot activity."
        );
      }
    };

    const scrollBehaviorInterval = setInterval(analyzeScrollBehavior, 5000);

    return () => clearInterval(scrollBehaviorInterval);
  }, [scrollData, scrollStartTime]);

  useEffect(() => {
    const entryTime = performance.now();
    setStartTime(entryTime);

    const currentTime = new Date();
    const accessTimeData =
      JSON.parse(localStorage.getItem("accessTimeData")) || [];
    accessTimeData.push(currentTime.toISOString());
    localStorage.setItem("accessTimeData", JSON.stringify(accessTimeData));

    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", Date.now());
    }

    const handleSessionEnd = () => {
      const sessionStartTime = sessionStorage.getItem("sessionStartTime");
      const sessionEndTime = Date.now();
      const sessionDuration = (sessionEndTime - sessionStartTime) / 1000;

      let sessionData =
        JSON.parse(localStorage.getItem("totalSessionLengthData")) || [];
      sessionData.push(sessionDuration);
      localStorage.setItem(
        "totalSessionLengthData",
        JSON.stringify(sessionData)
      );

      console.log(`Total session duration: ${sessionDuration} seconds`);
    };

    window.addEventListener("beforeunload", handleSessionEnd);

    return () => {
      const exitTime = performance.now();
      const timeSpent = (exitTime - entryTime) / 1000;

      let timeData = JSON.parse(localStorage.getItem("pageTimeData")) || {};
      timeData["Forms"] = (timeData["Forms"] || 0) + timeSpent;
      localStorage.setItem("pageTimeData", JSON.stringify(timeData));

      console.log(`Time spent on the page: ${timeSpent} seconds`);
      console.log(
        "Total time spent on this page:",
        timeData["Forms"],
        "seconds"
      );

      window.removeEventListener("beforeunload", handleSessionEnd);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const clickInfo = {
        timestamp: Date.now(),
        x: event.clientX,
        y: event.clientY,
        element: event.target.tagName,
      };

      setClickData((prevClickData) => [...prevClickData, clickInfo]);
    };

    const handleInput = (event) => {
      const currentTime = Date.now();
      const timeSinceLastInput = currentTime - lastInputTime;
      setLastInputTime(currentTime);

      if (timeSinceLastInput < 100) {
        console.log("Suspiciously fast input detected.");
      }
    };

    const handleFocus = (event) => {
      setFocusData((prev) => [
        ...prev,
        { field: event.target.name, timestamp: Date.now() },
      ]);
    };

    const handleBlur = (event) => {
      setFocusData((prev) => [
        ...prev,
        { field: event.target.name, timestamp: Date.now(), type: "blur" },
      ]);
    };

    const handleValidation = (event) => {
      if (!event.target.checkValidity()) {
        setValidationErrors((prev) => prev + 1);
      }
    };

    const handleMouseMove = (event) => {
      setMouseMovement((prev) => [
        ...prev,
        { x: event.clientX, y: event.clientY, timestamp: Date.now() },
      ]);
    };

    const monitorDynamicContent = () => {
      const dynamicInfo = {
        timestamp: Date.now(),
        event: "Dynamic content interaction",
        details: "User interacted with dynamic content",
      };
      setDynamicInteractions((prev) => [...prev, dynamicInfo]);
    };

    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      monitorDynamicContent();
      return originalFetch(...args);
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
      monitorDynamicContent();
      return originalXhrOpen.apply(this, args);
    };

    document.addEventListener("click", handleClick);
    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
      input.addEventListener("invalid", handleValidation);
    });
    document.addEventListener("mousemove", handleMouseMove);
    document.querySelector("form").addEventListener("submit", handleHoneypot);

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("clickPatterns", JSON.stringify(clickData));
      localStorage.setItem("mouseMovements", JSON.stringify(mouseMovement));
      localStorage.setItem("focusData", JSON.stringify(focusData));
      localStorage.setItem(
        "validationErrors",
        JSON.stringify(validationErrors)
      );
      localStorage.setItem("honeypotFilled", JSON.stringify(honeypotFilled));
      localStorage.setItem(
        "dynamicInteractions",
        JSON.stringify(dynamicInteractions)
      );
    });

    return () => {
      document.removeEventListener("click", handleClick);
      document
        .querySelectorAll("input")
        .forEach((input) => input.removeEventListener("input", handleInput));
      document
        .querySelectorAll("input")
        .forEach((input) => input.removeEventListener("focus", handleFocus));
      document
        .querySelectorAll("input")
        .forEach((input) => input.removeEventListener("blur", handleBlur));
      document
        .querySelectorAll("input")
        .forEach((input) =>
          input.removeEventListener("invalid", handleValidation)
        );
      document.removeEventListener("mousemove", handleMouseMove);
      document
        .querySelector("form")
        .removeEventListener("submit", handleHoneypot);
    };
  }, [
    clickData,
    lastInputTime,
    focusData,
    validationErrors,
    mouseMovement,
    honeypotFilled,
    dynamicInteractions,
  ]);
  const calculateMouseSpeedStd = (mouseData) => {
    const speeds = [];

    for (let i = 1; i < mouseData.length; i++) {
      const dx = mouseData[i].x - mouseData[i - 1].x;
      const dy = mouseData[i].y - mouseData[i - 1].y;
      const dt = (mouseData[i].time - mouseData[i - 1].time) / 1000; // convert ms to seconds

      if (dt > 0) {
        const speed = Math.sqrt(dx ** 2 + dy ** 2) / dt;
        speeds.push(speed);
      }
    }

    const meanSpeed =
      speeds.reduce((acc, speed) => acc + speed, 0) / speeds.length;
    const variance =
      speeds.reduce((acc, speed) => acc + (speed - meanSpeed) ** 2, 0) /
      speeds.length;

    return Math.sqrt(variance);
  };
  const calculateClickIntervalAvg = (clickData) => {
    const intervals = [];
    for (let i = 1; i < clickData.length; i++) {
      const interval = clickData[i].timestamp - clickData[i - 1].timestamp;
      intervals.push(interval);
    }
    return intervals.length > 0
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 0;
  };
  const calculateScrollSpeedAvg = (scrollData) => {
    const speeds = [];
    for (let i = 1; i < scrollData.length; i++) {
      const distance = scrollData[i].position - scrollData[i - 1].position;
      const dt = scrollData[i].timestamp - scrollData[i - 1].timestamp;

      if (dt > 0) {
        const speed = distance / dt;
        speeds.push(speed);
      }
    }
    return speeds.length > 0
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length
      : 0;
  };
  const calculateTypingSpeed = (fieldData) => {
    return fieldData.map((data) => ({
      ...data,
      typingSpeed: data.keystrokes / data.timeSpent, // keystrokes per second
    }));
  };
  const calculateAverageTypingSpeed = (typingSpeeds) => {
    const totalSpeed = typingSpeeds.reduce(
      (sum, field) => sum + field.typingSpeed,
      0
    );
    return typingSpeeds.length > 0 ? totalSpeed / typingSpeeds.length : 0;
  };
  const calculateAverageTimeSpent = () => {
    let timeData = JSON.parse(localStorage.getItem("pageTimeData")) || {};
    let totalTimeSpent = 0;
    let pageCount = 0;

    // Iterate through the timeData object to sum up the times and count the pages
    for (let page in timeData) {
      if (timeData.hasOwnProperty(page)) {
        totalTimeSpent += timeData[page];
        pageCount += 1;
      }
    }

    const averageTimeSpent = totalTimeSpent / pageCount;
    return averageTimeSpent;
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const mouseSpeedStd = calculateMouseSpeedStd(mouseMovement);
    const clickIntervalAvg = calculateClickIntervalAvg(clickData);
    const scrollSpeedAvg = calculateScrollSpeedAvg(scrollData);
    const typingSpeeds = calculateTypingSpeed(fieldData);
    const averageTypingSpeed = calculateAverageTypingSpeed(typingSpeeds);
    const averagePageInterval =
      pageTimeInterval.reduce((sum, interval) => sum + interval, 0) /
      pageTimeInterval.length;
    const averageTimeSpent = calculateAverageTimeSpent();

    console.log("Mouse Speed Standard Deviation:", mouseSpeedStd);
    console.log("Average Click Interval:", clickIntervalAvg);
    console.log("Average Scroll Speed:", scrollSpeedAvg);
    console.log(
      "Average Typing Speed:",
      averageTypingSpeed,
      "keystrokes per second"
    );
    console.log("Page Interval", averagePageInterval);
    console.log(`Average time spent on all pages: ${averageTimeSpent} seconds`);

    const data = {
      accessData: JSON.parse(localStorage.getItem("accessTimeData")) || [],
      screenResolution:
        JSON.parse(localStorage.getItem("screenResolution")) || {},
      totalSessionData:
        JSON.parse(localStorage.getItem("totalSessionLengthData")) || [],
      mouseSpeed: mouseSpeedStd,
      clickIntervalAvg: clickIntervalAvg,
      scrollSpeedAvg: scrollSpeedAvg,
      averageTypingSpeed: averageTypingSpeed,
      averagePageInterval: averagePageInterval,
      averageTimeSpent: averageTimeSpent,
      useragent: localStorage.getItem("userAgent") || "",
      referrer: localStorage.getItem("referrerInfo") || "",
      pageViews: sessionStorage.getItem("pageViewCount") || 0,
    };

    // Send data to server using fetch
    fetch("http://192.168.191.166:8000/users/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div>
      <nav className="sticky">
        <div className="flex items-center justify-between p-4 pr-20 pl-12">
          <img className="w-[100px] h-[60px]" src={image} />
          <h1 className="text-blue-800 font-bold text-2xl">
            Unique Identification Authority of India
          </h1>
          <img className="w-[70px] h-[40px]" src={aadhar} />
        </div>
        <div
          className="w-full flex pl-10 pr-10 p-2 justify-between"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
          }}
        >
          <div className="flex">
            <WindowIcon style={{ color: "white" }} />
            <p className="font-bold text-white">myAadhar</p>
          </div>
          <div className="flex">
            <TranslateIcon style={{ color: "white" }} />
            <p className="font-bold text-white">English</p>
          </div>
        </div>
      </nav>
      <div>
        <div className="flex p-3 pl-10">
          <button className="text-slate-500">Dashboard</button>
          <p className="text-blue-800 ml-4">Check Enrolment & update status</p>
        </div>
        <div className="p-5 pl-10">
          <form className="border border-2 border-slate-600 w-[800px] p-4 rounded-md flex flex-col justify-between h-[400px]">
            <p className="font-bold">Enter your Information</p>
            <div className="w-[750px] border border-slate-500 p-2 rounded-md">
              <input
                type="text"
                name="name1"
                className="w-full h-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="w-[750px] border border-slate-500 p-2 rounded-md">
              <input
                type="text"
                name="name2"
                className="w-full h-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="w-[750px] border border-slate-500 p-2 rounded-md">
              <input
                type="text"
                name="name3"
                className="w-full h-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="w-[750px] border border-slate-500 p-2 rounded-md">
              <input
                type="text"
                name="name4"
                className="w-full h-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="w-[750px] border border-slate-500 p-2 rounded-md">
              <input
                type="text"
                name="name5"
                className="w-full h-full"
                placeholder="Enter your name"
              />
            </div>
            <input
              type="text"
              name="honeypot"
              style={{ display: "none" }}
              onChange={handleHoneypot}
            />
            <button
              style={{
                background:
                  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
              }}
              onClick={handleSubmit}
              className="w-20 text-white p-5"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forms;
