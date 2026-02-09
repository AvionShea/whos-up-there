const issElement = document.getElementById("iss");
const moonPhaseElement = document.getElementById("moon");
const issBtn = document.getElementById("iss-crew-btn");
const moonBtn = document.getElementById("moon-phases-btn");
const issPositionCard = document.getElementById("iss-position");
const issTimestamp = document.getElementById("iss-timestamp");
const peopleInSpaceCard = document.getElementById("space-people");
const moonPhaseCard = document.getElementById("moon-data");
const moonTimestamp = document.getElementById("moon-timestamp");
const now = new Date();
const formattedTimestamp = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})

//Only shows ISS/Astronauts on Page load
window.onload = function () {
    moonPhaseElement.classList.add("hidden");
    issBtn.classList.add("active");
    issLocation();
    peopleInSpace();
};


// API CALLS

// ISS (Space Station) Location
async function issLocation() {
    const issLocationUrl = "https://corsproxy.io/?http://api.open-notify.org/iss-now.json";
    try {
        const issLocationResponse = await fetch(issLocationUrl);
        if (!issLocationResponse.ok) {
            throw new Error("Sorry. We can't locate the ISS.")
        }
        const issLocationData = await issLocationResponse.json();
        //console.log(issLocationData);
        //return issLocationData;
        //console.log(issLocationData.iss_position.latitude);
        //console.log(issLocationData.iss_position.longitude);
        let issLatitude = issLocationData.iss_position.latitude;
        let issLongitude = issLocationData.iss_position.longitude;

        let formattedLat;
        let formattedLon;

        if (issLatitude > 0) {
            formattedLat = `${issLatitude}°N`;
            //console.log(`${issLatitude}°N`);
        } else {
            formattedLat = `${Math.abs(issLatitude)}°S`;
            //console.log(`${issLatitude}°S`);
        }

        if (issLongitude > 0) {
            formattedLon = `${issLongitude}°E`;
            //console.log(`${issLongitude}°E`);
        } else {
            formattedLon = `${Math.abs(issLongitude)}°W`;
            //console.log(`${issLongitude}°W`);
        }

        issPositionCard.innerHTML = `
    <div class="label">🛰️ ISS POSITION</div>
    <div class="coordinates">${formattedLat}</div>
    <div class="coordinates">${formattedLon}</div>
    <div class="label">Orbiting Earth</div>
`;

        issTimestamp.innerText = `Last updated: ${formattedTimestamp}`

    } catch (error) {
        console.error("An error has occurred: ", error);
        issPositionCard.innerHTML = `
    <div class="label">Sorry. We can't locate the ISS.</div>
`;
    }
}

//issLocation();

// Astronauts currently in space
async function peopleInSpace() {
    const peopleInSpaceUrl = "https://corsproxy.io/?http://api.open-notify.org/astros.json";
    try {
        const peopleInSpaceResponse = await fetch(peopleInSpaceUrl);
        if (!peopleInSpaceResponse.ok) {
            throw new Error("Sorry. We can't locate the Astronauts.");
        }
        const peopleInSpaceData = await peopleInSpaceResponse.json();
        //console.log(peopleInSpaceData);
        //return peopleInSpaceData;

        const numOfPeopleInSpace = peopleInSpaceData.number;
        //console.log(numOfPeopleInSpace);

        const namesOfPeopleInSpace = peopleInSpaceData.people;
        //console.log(namesOfPeopleInSpace);

        //Creating List of Names
        let astronautListHtml = "";

        namesOfPeopleInSpace.forEach((person) => {
            astronautListHtml += `<li>${person.name} - 🚀${person.craft}</li>`;
        })

        peopleInSpaceCard.innerHTML = `
    <div class="label">👨‍🚀 PEOPLE IN SPACE</div>
    <div class="astronaut-count">${numOfPeopleInSpace} astronauts in space!</div>
    <ul class="astronaut-list">${astronautListHtml}</ul>
`;
    } catch (error) {
        console.error("An error has occurred: ", error);
        peopleInSpaceCard.innerHTML = `
    <div class="label">Sorry. We can't locate the Astronauts.</div>
`;
    }
}

//peopleInSpace();

//Moon Phases
// DATE AND TIME
const currentDate = new Date().toJSON().slice(0, 10);
const midpointOfEastCoastCoords = "36.5,-76.0";
const moonEmojiMap = {

    "New Moon": "🌑",
    "Waxing Crescent": "🌒",
    "First Quarter": "🌓",
    "Waxing Gibbous": "🌔",
    "Full Moon": "🌕",
    "Waning Gibbous": "🌖",
    "Last Quarter": "🌗",
    "Waning Crescent": "🌘"
};

async function moonPhases() {
    const moonPhasesUrl = `https://aa.usno.navy.mil/api/rstt/oneday?date=${currentDate}&coords=${midpointOfEastCoastCoords}`;
    try {
        const moonPhasesResponse = await fetch(moonPhasesUrl);
        if (!moonPhasesResponse.ok) {
            throw new Error("Sorry. We couldn't locate the moon.");
        }
        const moonPhasesData = await moonPhasesResponse.json();
        //console.log(moonPhasesData);
        //return moonPhasesData;
        const currentPhase = moonPhasesData.properties.data.curphase;
        const illumination = moonPhasesData.properties.data.fracillum;
        const emoji = moonEmojiMap[currentPhase] || "🌙";

        moonPhaseCard.innerHTML = `
        <span id="moon-emoji">${emoji}</span>
        <p>Current Moon Phase:<span class="moon-info"> ${currentPhase}</span></p>
        <p>Illumination Percentage:<span class="moon-info"> ${illumination}</span></p>
        `
        moonTimestamp.innerText = `Last updated: ${formattedTimestamp}`

    } catch (error) {
        console.error("An error has occurred: ", error);
    }
}

//moonPhases();

//Makes ISS Button and Section Visible/Active
issBtn.addEventListener("click", () => {
    issElement.classList.remove("hidden");
    moonPhaseElement.classList.add("hidden");
    moonBtn.classList.remove("active");

    issBtn.classList.add("active");

    issLocation();
    peopleInSpace();

});

//Makes Moon Phases Button and Section Visible/Active
moonBtn.addEventListener("click", () => {
    moonPhaseElement.classList.remove("hidden");
    issElement.classList.add("hidden");
    issBtn.classList.remove("active");

    moonBtn.classList.add("active");

    moonPhases();
});

