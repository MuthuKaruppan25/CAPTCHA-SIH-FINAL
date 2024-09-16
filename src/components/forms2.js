import { useState, useEffect , useRef } from 'react';
import { runBotDetection, appendBehaviorData } from 'proofify';

const BotDetectionComponent = () => {


  const [keyPressData, setKeyPressData] = useState([]);

  useEffect(() => {
    let lastKey = null;
    let lastKeyTime = 0;

    const handleKeyDown = (event) => {
      const currentTime = new Date().getTime();
      const currentKey = event.key;

      setKeyPressData((prevState) => [
        ...prevState,
        { key: currentKey, timestamp: currentTime },
      ]);

      if (currentKey === "Backspace") {
        setBackspaceCount((prev) => prev + 1);
      }

      if (lastKey === currentKey && currentTime - lastKeyTime < 300) {
        setRepeatedKeyCount((prev) => prev + 1);
      }

      lastKey = currentKey;
      lastKeyTime = currentTime;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  








    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
    });


    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const [showDialog, setShowDialog] = useState(false);
    const closeDialog = () => {
      setShowDialog(false);
    };
    
    const [inputValue, setInputValue] = useState("");
    const [visible, setVisible] = useState(true);
    const [backspaceCount, setBackspaceCount] = useState(0);
    const [repeatedKeyCount, setRepeatedKeyCount] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [keyHoldData, setKeyHoldData] = useState({});
    const [clickData, setClickData] = useState([]);
    const [referrer, setReferrer] = useState("");
    const [mouseMovement, setMouseMovement] = useState([]);
    const [scrollData, setScrollData] = useState([]);
    const [scrollStartTime, setScrollStartTime] = useState(0);
    const [keystrokes, setKeystrokes] = useState(0);
    const [startTime1, setStartTime1] = useState(null);
    const [fieldData, setFieldData] = useState([]);
    const [plugins, setPlugins] = useState([]);
    const [intervals, setIntervals] = useState([]);
    let lastKeystrokeTime = useRef(null);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [captchaVerified1, setCaptchaVerified1] = useState(false);
    const [result, setResult] = useState("");
    const handleCaptchaChange = (value) => {
      if (value) {
        setCaptchaVerified(true);
      }
    };
  
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
      let lastKey = null;
      let lastKeyTime = 0;
  
      const handleKeyDown = (event) => {
        const currentTime = new Date().getTime();
        const currentKey = event.key;
  
        if (currentKey === "Backspace") {
          setBackspaceCount((prev) => prev + 1);
        }
  
        if (lastKey === currentKey && currentTime - lastKeyTime < 300) {
          setRepeatedKeyCount((prev) => prev + 1);
        }
  
        lastKey = currentKey;
        lastKeyTime = currentTime;
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        setKeyHoldData((prevState) => {
          if (!prevState[event.key]) {
            return {
              ...prevState,
              [event.key]: { pressTime: new Date().getTime(), holdDuration: 0 },
            };
          }
          return prevState;
        });
      };
  
      const handleKeyUp = (event) => {
        setKeyHoldData((prevState) => {
          const keyData = prevState[event.key];
          if (keyData && keyData.pressTime) {
            const releaseTime = new Date().getTime();
            const holdDuration = releaseTime - keyData.pressTime;
  
            return {
              ...prevState,
              [event.key]: { ...keyData, holdDuration },
            };
          }
          return prevState;
        });
      };
  
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
  
    useEffect(() => {
      const handleFocus = (event) => {
        if (
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA"
        ) {
          setStartTime1(Date.now());
          setKeystrokes(0);
          setIntervals([]);
        }
      };
  
      const handleInput = (event) => {
        if (
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA"
        ) {
          setKeystrokes((prev) => prev + 1);
          const currentTime = Date.now();
  
          if (lastKeystrokeTime.current) {
            const timeInterval = currentTime - lastKeystrokeTime.current;
            setIntervals((prev) => [...prev, timeInterval]);
          }
  
          lastKeystrokeTime.current = currentTime;
        }
      };
  
      const handleBlur = (event) => {
        if (
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA"
        ) {
          const endTime = Date.now();
          const timeSpent = (endTime - startTime1) / 1000;
  
          setFieldData((prevData) => [
            ...prevData,
            {
              fieldName: event.target.name,
              keystrokes,
              timeSpent,
              intervals,
              startTime1,
              endTime,
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
  
    useEffect(() => {
      const referrerURL = document.referrer;
      setReferrer(referrerURL);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("referrerInfo", referrer);
    }, [referrer]);
  
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
  
    // useEffect(() => {
    //   const entryTime = Date.now();
    //   setStartTime(entryTime);
  
    //   return () => {
    //     const exitTime = performance.now();
    //     const timeSpent = (exitTime - entryTime) / 1000;
  
    //     let timeData = JSON.parse(localStorage.getItem("pageTimeData")) || {};
    //     timeData["Forms"] = (timeData["Forms"] || 0) + timeSpent;
    //     localStorage.setItem("pageTimeData", JSON.stringify(timeData));
  
    //     console.log(`Time spent on the page: ${timeSpent} seconds`);
    //     console.log(
    //       "Total time spent on this page:",
    //       timeData["Forms"],
    //       "seconds"
    //     );
    //   };
    // }, []);
  
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
      const delayThreshold = 1000;
      let lastRecordedTime = Date.now();
  
      const handleMouseMove = (event) => {
        const currentTime = Date.now();
  
        if (currentTime - lastRecordedTime >= delayThreshold) {
          setMouseMovement((prev) => [
            ...prev,
            { x: event.clientX, y: event.clientY, timestamp: currentTime },
          ]);
          lastRecordedTime = currentTime;
        }
      };
  
      document.addEventListener("click", handleClick);
  
      document.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("clickPatterns", JSON.stringify(clickData));
        localStorage.setItem("mouseMovements", JSON.stringify(mouseMovement));
      });
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, [clickData, mouseMovement]);
  
    const calculateMouseSpeedStd = (mouseData) => {
      if (mouseData.length < 2) {
        return { avgSpeed: 0, totalDistance: 0, avgAngleChange: 0 };
      }
  
      var totalDistance = 0;
      var totalTime =
        mouseData[mouseData.length - 1].timestamp - mouseData[0].timestamp;
      var speedList = [];
      var angleChanges = [];
  
      for (var i = 1; i < mouseData.length; i++) {
        var x1 = mouseData[i - 1].x;
        var y1 = mouseData[i - 1].y;
        var x2 = mouseData[i].x;
        var y2 = mouseData[i].y;
  
        var timeDiff = mouseData[i].timestamp - mouseData[i - 1].timestamp;
  
        if (timeDiff === 0) continue;
  
        var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        totalDistance += distance;
  
        var speed = distance / timeDiff;
        speedList.push(speed);
  
        if (i > 1) {
          var x0 = mouseData[i - 2].x;
          var y0 = mouseData[i - 2].y;
          var angle1 = Math.atan2(y1 - y0, x1 - x0);
          var angle2 = Math.atan2(y2 - y1, x2 - x1);
          var angleChange = Math.abs(angle2 - angle1);
          angleChanges.push(angleChange);
        }
      }
  
      var avgSpeed =
        speedList.length > 0
          ? speedList.reduce((a, b) => a + b, 0) / speedList.length
          : 0;
      var avgAngleChange =
        angleChanges.length > 0
          ? angleChanges.reduce((a, b) => a + b, 0) / angleChanges.length
          : 0;
  
      return {
        avgSpeed: avgSpeed,
        totalDistance: totalDistance,
        avgAngleChange: avgAngleChange,
      };
    };
  
    const calculateJitterAndTremors = (mouseData) => {
      if (mouseData.length < 3) {
        return { jitter: 0, tremors: 0 };
      }
  
      var jitterDistances = [];
      var tremorCounts = 0;
  
      for (var i = 2; i < mouseData.length; i++) {
        var x1 = mouseData[i - 2].x;
        var y1 = mouseData[i - 2].y;
        var x2 = mouseData[i - 1].x;
        var y2 = mouseData[i - 1].y;
        var x3 = mouseData[i].x;
        var y3 = mouseData[i].y;
  
        var dist1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        var dist2 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
  
        var distanceDiff = Math.abs(dist2 - dist1);
        if (distanceDiff > 0 && distanceDiff < 5) {
          jitterDistances.push(distanceDiff);
        }
        var angle1 = Math.atan2(y2 - y1, x2 - x1);
        var angle2 = Math.atan2(y3 - y2, x3 - x2);
        var angleChange = Math.abs(angle2 - angle1);
  
        if (angleChange > Math.PI / 2) {
          tremorCounts++;
        }
      }
      var jitter =
        jitterDistances.length > 0
          ? jitterDistances.reduce((a, b) => a + b, 0) / jitterDistances.length
          : 0;
      var tremors = tremorCounts;
      return { jitter: jitter, tremors: tremors };
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
  
    const calculateClickAreaVariability = (clickData) => {
      if (clickData.length < 2) {
        return { xVariance: 0, yVariance: 0, totalVariance: 0 };
      }
  
      const xCoords = clickData.map((click) => click.x);
      const yCoords = clickData.map((click) => click.y);
  
      const calculateVariance = (values) => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return (
          values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
          values.length
        );
      };
  
      const xVariance = calculateVariance(xCoords);
      const yVariance = calculateVariance(yCoords);
  
      const totalVariance = Math.sqrt(xVariance + yVariance);
  
      return {
        xVariance: xVariance,
        yVariance: yVariance,
        totalVariance: totalVariance,
      };
    };
  
    const clickToScrollRatio = (scrollCount, clickCount) => {
      return scrollCount > 0 ? (clickCount / scrollCount).toFixed(2) : 0;
    };
  
    const calculateScrollSpeedAvg = (scrollData) => {
      const speeds = [];
      for (let i = 1; i < scrollData.length; i++) {
        const distance =
          scrollData[i].scrollPosition - scrollData[i - 1].scrollPosition;
        const dt = scrollData[i].timestamp - scrollData[i - 1].timestamp;
  
        if (dt > 0 && !isNaN(distance) && !isNaN(dt)) {
          const speed = distance / dt;
          speeds.push(speed);
        }
      }
      return speeds.length > 0
        ? speeds.reduce((a, b) => a + b, 0) / speeds.length
        : 0;
    };
  
    const calculateAverageTypingSpeed = (typingSpeeds) => {
      const totalTimeSpent = fieldData.reduce(
        (total, data) => total + data.timeSpent,
        0
      );
      const averageTimeSpent = totalTimeSpent / fieldData.length;
      return averageTimeSpent;
    };
  
    const calculateAverageTimeSpent = () => {
      let timeData = JSON.parse(localStorage.getItem("pageTimeData")) || {};
      let totalTimeSpent = 0;
      let pageCount = 0;
      for (let page in timeData) {
        if (timeData.hasOwnProperty(page)) {
          totalTimeSpent += timeData[page];
          pageCount += 1;
        }
      }
      const averageTimeSpent = totalTimeSpent / pageCount;
      return averageTimeSpent;
    };
  
    const concatenateFieldData = (data) => {
      const result = {};
  
      data.forEach((entry) => {
        const {
          fieldName,
          intervals,
          keystrokes,
          timeSpent,
          startTime1,
          endTime,
        } = entry;
  
        if (!result[fieldName]) {
          result[fieldName] = {
            fieldName: fieldName,
            intervals: [...intervals],
            keystrokes: keystrokes,
            timeSpent: timeSpent,
            startTime1: startTime1,
            endTime: endTime,
          };
        } else {
          result[fieldName].intervals =
            result[fieldName].intervals.concat(intervals);
          result[fieldName].keystrokes += keystrokes;
          result[fieldName].timeSpent += timeSpent;
          result[fieldName].startTime1 = Math.min(
            result[fieldName].startTime1,
            startTime1
          );
          result[fieldName].endTime = Math.max(
            result[fieldName].endTime,
            endTime
          );
        }
      });
      let concatenatedData = Object.values(result);
      concatenatedData.sort((a, b) => a.startTime1 - b.startTime1);
      const fieldIntervals = [];
      let totalInterval = 0;
      for (let i = 1; i < concatenatedData.length; i++) {
        const previousField = concatenatedData[i - 1];
        const currentField = concatenatedData[i];
        const timeInterval =
          (currentField.startTime1 - previousField.endTime) / 1000;
        totalInterval += timeInterval;
        console.log(timeInterval);
  
        fieldIntervals.push({
          fromField: previousField.fieldName,
          toField: currentField.fieldName,
          timeInterval: timeInterval,
        });
      }
      const averageInterval =
        fieldIntervals.length > 0 ? totalInterval / fieldIntervals.length : 0;
  
      return {
        concatenatedData,
        averageInterval: averageInterval,
      };
    };
  
    const calculateStatistics = () => {
      const durations = Object.values(keyHoldData)
        .map((data) => data.holdDuration)
        .filter((duration) => duration > 0);
  
      if (durations.length === 0) return { avgDuration: 0, stdDev: 0 };
  
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  
      const variance =
        durations.reduce((a, b) => a + Math.pow(b - avgDuration, 2), 0) /
        durations.length;
      const stdDev = Math.sqrt(variance);
  
      return { avgKeyHoldDurarion: avgDuration, avdStdKeyHoldDev: stdDev };
    };
  
    const calculateAverageKeystrokeInterval = (data) => {
      const avgIntervals = [];
      let totalTimeSpent = 0;
      data.forEach((field) => {
        const intervals = field.intervals;
        const avgInterval =
          intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
        totalTimeSpent += field.timeSpent;
        avgIntervals.push(avgInterval);
        console.log(
          `Average keystroke interval for ${
            field.fieldName
          }: ${avgInterval.toFixed(2)}`
        );
      });
      const avgTimeSpent = totalTimeSpent / data.length;
      const overallAvgInterval =
        avgIntervals.reduce((sum, value) => sum + value, 0) / avgIntervals.length;
      console.log(
        `Overall average keystroke interval: ${overallAvgInterval.toFixed(2)}`
      );
  
      return {
        avgTimeSpent: avgTimeSpent,
        avgIntervals: avgIntervals,
        overallAvgInterval: overallAvgInterval,
      };
    };
  
    const handleVerificationComplete = () => {
      setCaptchaVerified1(true);
      alert("CAPTCHA verified successfully!");
    };
  
    const handleSubmit = (event) => {
      // if (validateCaptcha(inputValue) == true) {
      //   alert("Captcha Matched");
      // } else {
      //   alert("Captcha Does Not Match");
      // }
      event.preventDefault();
  
      const mouseSpeedStd = calculateMouseSpeedStd(mouseMovement);
      const jittersandTremors = calculateJitterAndTremors(mouseMovement);
      const clickIntervalAvg = calculateClickIntervalAvg(clickData);
      const variableData = calculateClickAreaVariability(clickData);
      const concatenatedData = concatenateFieldData(fieldData);
      const scrollSpeedAvg = calculateScrollSpeedAvg(scrollData);
      const averageTypingSpeed = calculateAverageTypingSpeed(fieldData);
      const keyHoldValues = calculateStatistics(keyHoldData);
      const averageTimeSpent = (Date.now() - startTime) / 1000;
      const keyFieldData = calculateAverageKeystrokeInterval(
        concatenatedData.concatenatedData
      );
  
      console.log("Mouse Speed Standard Deviation:", mouseSpeedStd.avgSpeed);
      console.log(
        "Mouse Speed Standard angle change:",
        mouseSpeedStd.avgAngleChange
      );
      console.log("Mouse Jitters", jittersandTremors.jitter);
      console.log("Mouse Tremors", jittersandTremors.tremors);
      console.log("x Variance", variableData.xVariance);
      console.log("y Variance", variableData.yVariance);
      console.log("total Variance", variableData.totalVariance);
      console.log("key hold values duration", keyHoldValues.avgKeyHoldDurarion);
      console.log("key hold values SD", keyHoldValues.avdStdKeyHoldDev);
      console.log("Average Click Interval:", clickIntervalAvg);
      console.log("Average Scroll Speed:", scrollSpeedAvg);
      console.log("Field Data", fieldData);
      console.log("Average Key Stroke Interval", keyFieldData.overallAvgInterval);
      console.log(
        "Average Typing Speed:",
        averageTypingSpeed,
        "keystrokes per second"
      );
      console.log("Average time spent on Each field", keyFieldData.avgTimeSpent);
      console.log(
        "Average time spent between each field",
        concatenatedData.averageInterval
      );
      console.log("Backspace count", backspaceCount);
      console.log("RepeatedValues count", repeatedKeyCount);
      console.log(`Average time spent on all pages: ${averageTimeSpent} seconds`);
  
      const features = {
        screenResolution:
          JSON.parse(localStorage.getItem("screenResolution")) || {},
        mouseSpeed: parseFloat(mouseSpeedStd.avgSpeed),
        mouseAngle: parseFloat(mouseSpeedStd.avgAngleChange),
        mouseTremors: jittersandTremors.tremors,
        mouseJitters: jittersandTremors.jitter,
        xVariance: variableData.xVariance,
        yVariance: variableData.yVariance,
        totalVariance: variableData.totalVariance,
        keyHoldDuration: keyHoldValues.avgKeyHoldDurarion,
        keyHoldStd: keyHoldValues.avdStdKeyHoldDev,
        clickIntervalAvg: clickIntervalAvg,
        scrollSpeedAvg: scrollSpeedAvg,
        keyStrokeInterval: keyFieldData.overallAvgInterval,
        avgTimeSpentField: keyFieldData.avgTimeSpent,
        averageTimeInterval: parseFloat(concatenatedData.averageInterval),
        backspaceCount: backspaceCount,
        repeatedKeyCount: repeatedKeyCount,
        averageTimeSpent: averageTimeSpent,
        useragent: localStorage.getItem("userAgent") || "",
        referrer: localStorage.getItem("referrerInfo") || "",
        plugins: plugins.length,
      };
      console.log(features);
      console.log(features.averageTimeSpent);
      console.log(features.avgTimeSpentField);
      const data = [];
      data.push(
        mouseSpeedStd.avgSpeed,
        mouseSpeedStd.avgAngleChange,
        jittersandTremors.tremors,
        jittersandTremors.jitter,
        variableData.xVariance,
        variableData.yVariance,
        variableData.totalVariance,
        keyHoldValues.avgKeyHoldDurarion,
        keyHoldValues.avdStdKeyHoldDev,
        clickIntervalAvg,
        scrollSpeedAvg,
        keyFieldData.overallAvgInterval,
  
        parseFloat(concatenatedData.averageInterval),
        backspaceCount,
        averageTimeSpent
      );
      const x = JSON.stringify(features);
      console.log(x);
      const formattedData = {
        features: data,
      };
      // fetch("http://192.168.100.166:8000/users/data", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(features),
      // })
      //   .then((response) => response.json())
      //   .then((result) => {
      //     // console.log("Success:", result);
      //     // if (result.Classification === "bot") {
      //     //   console.log("it is bot");
      //     //   setShowCaptcha(true);
      //     // } else {
      //     //   console.log("It is human");
      //     //   setShowDialog(true);
      //     //   setResult("Form Submitted Successfully");
      //     // }
      //     // console.log("Data Entry Successful");
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
    };
  
  
  

  
    const runBotDetectionInReact = async () => {
      console.log(keyHoldData);
      setLoading(true);  // Set loading to true when detection starts
      try {
          const endTime = Date.now();
          const detectionScore = await runBotDetection(backspaceCount , repeatedKeyCount , startTime , keyHoldData, clickData, mouseMovement,scrollData,fieldData,endTime);  // Await bot detection result
          setScore(detectionScore);  // Set the score to display in the UI
      } catch (error) {
          console.error('Error during bot detection:', error);
          setScore('Error in detection');  // Handle error case
      } finally {
          setLoading(false);  // Set loading to false after completion
      }
      ;
  };
  
  // const runGetData = async () =>{
  //   try
  //   {
  //     await appendBehaviorData();
  //   } catch(error){
  
  //   }
    
   
  // }

    return (
        <div>
            <h1>Bot Detection with User Info</h1>

            {/* Basic Information Form */}
            <form>
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label>Age: </label>
                    <input
                        type="number"
                        name="age"
                        
                        onChange={handleInputChange}
                        placeholder="Enter your age"
                    />
                </div>
            </form>

            {/* Run Bot Detection Button */}
            <button onClick={()=>runBotDetectionInReact()} disabled={loading}>
                {loading ? 'Detecting...' : 'Run Bot Detection'}
            </button>

            {/* Display the bot detection score */}
            {score !== null && <p>Detection Score: {score}</p>}
        </div>
    );
};

export default BotDetectionComponent;
