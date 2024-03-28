
      const lt = document.querySelector(".latitude");
      const lg = document.querySelector(".longitude");
      const vt = document.querySelector(".velocity");
      const pn = document.querySelector(".pn");
      const dt = document.querySelector(".date");
      const tm = document.querySelector(".time");
      const vs = document.querySelector(".visi");
      const alt = document.querySelector(".altitude");

      const img = document.querySelector("#myimg");
      const dimg = document.querySelector("#dimg");
      const span = document.querySelectorAll("span")

      const m = document.getElementById("map")
      const spinner = document.querySelector(".spinner-border")
      const content = document.querySelector("#content")

      const dark = document.querySelector(".dark-mode");
      const body = document.body;

      var map = L.map("map").setView([0, 0], 8);

      L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      var myIcon = L.icon({
        iconUrl: "iss.png",
        iconSize: [38, 95],
        iconAnchor: [22, 94],
      });

      var marker = L.marker([0, 0], { icon: myIcon }).addTo(map);
      var trackPath = L.polyline([], { color: "red" }).addTo(map);

      function getName(latitude, longitude) {
        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          .then((response) => response.data)
          .then((data) => {
            const placeName = data.display_name;

            if (placeName === undefined) {
              pn.innerHTML = "Sorry co-ordinates does not fetch";
              pn.style.color = "red";
            } else {
              pn.textContent = placeName;
              pn.style.color="#7f9f80"
            }

            console.log(placeName);
          })
          .catch((error) => {
            console.error("Error:", error.message);
          });
      }

      var prevPositions = JSON.parse(localStorage.getItem("trackPath")) || [];

      if (prevPositions.length > 0) {
        prevPositions.forEach((position) => {
          trackPath.addLatLng([position.lat, position.lng]);
        });
      }

      setInterval(() => {
        axios
          .get("https://api.wheretheiss.at/v1/satellites/25544")
          .then((response) => {
            const data = response.data;
            const latitude = data.latitude;
            const longitude = data.longitude;
            const velocity = Math.round(data.velocity);
            var visibility = data.visibility;
            const altitude = Math.round(data.altitude);

            console.log(
              `lg : ${longitude}, lt : ${latitude}, velocity : ${velocity} visibility : ${visibility}`
            );

            lt.textContent = latitude;
            lg.textContent = longitude;
            vt.textContent = velocity;
            vs.textContent = visibility;
            alt.textContent = altitude;

            getName(latitude, longitude);

            marker.setLatLng([latitude, longitude]);

            trackPath.addLatLng([latitude, longitude]);

            map.setView([latitude, longitude], 8);

            prevPositions.push({ lat: latitude, lng: longitude });
            localStorage.setItem("trackPath", JSON.stringify(prevPositions));

            console.log(data);

            // for img set

            if (visibility === "daylight") {
              console.log("dl");
              img.src = "sun2.jpg";
            } else if (visibility === "night") {
              img.src = "moon.webp";
            } else {
              img.src = "eclipse.jpg";
            }
          })
          .catch((error) => {
            console.error("Error fetching ISS position:", error.message);
          });
      }, 5000);

      // for timezone

      setInterval(() => {
        var today = new Date();

        var monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        var dayOfMonth = today.getDate();

        var monthIndex = today.getMonth();
        var monthName = monthNames[monthIndex];

        var year = today.getFullYear();

        var date = `${dayOfMonth} ${monthName} ${year}`;

        dt.textContent = date;

        var today = new Date();

        var hours = today.getUTCHours();

        var minutes = today.getUTCMinutes();

        var seconds = today.getUTCSeconds();

        var formattedTime =
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes +
          ":" +
          (seconds < 10 ? "0" : "") +
          seconds +
          " GMT";

        tm.textContent = formattedTime;
        console.log(formattedTime);
      }, 5000);


      function change() {
        if (body.style.backgroundColor == "white") {
          body.style.backgroundColor = "black";

          dimg.style.transition = "opacity 0.5s"; 
    dimg.style.opacity = 0; 
    setTimeout(() => {
      dimg.src = "sleep-mode.png"; 
      dimg.style.opacity = 1; 
    }, 500);

          span.style.color="wheat"
        } else {
          body.style.backgroundColor = "white";
          dimg.style.transition = "opacity 0.5s"; 

    dimg.style.opacity = 0; 
    setTimeout(() => {
      dimg.src = "sun.png"; 
      dimg.style.opacity = 1; 
    }, 500);


        }
      }


      
  
