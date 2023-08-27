const cityName = document.querySelector(".search input"); // to get the name of the city
    const cityBtn = document.querySelector(".search button");
    // var requestOptions = {
    //     method: 'GET',
    // };
    const cityApi = "https://api.geoapify.com/v1/geocode/autocomplete?text=";
    const cityKey = "31acfaba247b4d1fb3a2d7f570197022";

    // let weatherIcon = document.querySelector("weather-icon");
    // console.log(weatherIcon)
    const apiKey = "33c74d3c8ee5988db56810ee91c9fdd9";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

    const img = new Image();
    img.src = "";
    document.getElementById("weather-icon").append(img);

    async function checkWeather(values) {
      const response = await fetch(
        apiUrl + `lat=${values[0]}&lon=${values[1]}` + `&appid=${apiKey}`
      );

      if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
      }
      var data = await response.json();
      console.log(data);
      document.querySelector(".city").innerHTML = data.name; //grabing data from json
      Celsius = data.main.temp - 273.15;
      document.querySelector(".temp").innerHTML = Celsius.toFixed(1) + "°C";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

      if (data.weather[0].main) {
        if (data.weather[0].main == "Clouds") {
          img.src = "./images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
          img.src = "./images/clear.png";
        } else if (data.weather[0].main == "Rain") {
          img.src = "./images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
          img.src = "./images/Drizzle.png";
        } else if (data.weather[0].main == "Mist") {
          img.src = "./images/mist.png";
        } else if (data.weather[0].main == "Snow") {
          img.src = "./images/snow.png";
        }
      }

      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    }

    const locationDropdown = document.getElementById("result-box");

    async function findLocation(e) {
      let arr = [];
      e.preventDefault();
      const inputValue = e.target.value;
      if (inputValue.length) {
        try {
          const response = await fetch(
            `${cityApi}${inputValue}&format=json&apiKey=${cityKey}`
          ).then((response) => response.json());

          const { results } = response; //destructuring of Object(JSON)
          if (results.length) {
            document.getElementById("rbc").classList.add("visible");
          } else document.getElementById("rbc").classList.remove("visible");
          results.forEach((element) => {
            const { address_line1, address_line2, lon, lat } = element;

            let option = document.createElement("option");

            option.setAttribute("value", `${lat},${lon}`);

            let optionText = document.createTextNode(
              `${address_line1}   ${address_line2}`
            );
            option.append(optionText);
            arr.push(option);
          });
          locationDropdown.replaceChildren(...arr);
        } catch (err) {
          console.log(err);
        }
      } else document.getElementById("rbc").classList.remove("visible");
    }

    locationDropdown.addEventListener("click", async function (e) {
      const values = e.target.value.split(",");
      document.getElementById("rbc").classList.remove("visible");
      await checkWeather(values);
      document.querySelector(".search input").value="";
    });
