function fetchData() {
  // Read the DB with robots:
  fetch("http://localhost:8081/listRobots")
    .then((response) => response.json())
    .then((robots) => {
      console.log(robots);
      loadRobots(robots);
    })
    .catch((err) => console.log("error:" + err));
}
fetchData();

function loadRobots(robots) {
  console.log(robots);
  var CardRobot = document.getElementById("col");
  CardRobot.innerHTML = ""; // Clear existing content
  for (var i = 0; i < robots.length; i++) {
    let name = robots[i].name;
    let description = robots[i].description;
    let price = robots[i].price;
    let imageUrl = robots[i].imageUrl;
    let AddCardRobot = document.createElement("div");
    AddCardRobot.classList.add("col"); // Add Bootstrap class to the column
    AddCardRobot.innerHTML = `
      <div class="card shadow-sm">
        <img src="${imageUrl}" class="card-img-top" alt="${name}">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">${description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">$${price}</small>
          </div>
        </div>
      </div>
    `;
    CardRobot.appendChild(AddCardRobot);
  } // end of for
} // end of function

// Replace image and text per every one in HTML
function showOneRobot() {
  // Value from the input field
  let id = document.getElementById("id").value;

  // Fetch the robot data based on the provided ID
  fetch(`http://localhost:8081/robot/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Robot not found: ${response.statusText}`);
      }
      return response.json();
    })
    .then((robot) => {
      loadOneRobot(robot);
    })
    .catch((err) => {
      console.error("Error fetching robot:", err);
      alert("Error fetching robot: " + err.message);
    });
}

function loadOneRobot(robot) {
  console.log(robot);
  var CardRobot = document.getElementById("col2");
  CardRobot.innerHTML = ""; // Clear existing content
  let name = robot.name;
  let description = robot.description;
  let price = robot.price;
  let imageUrl = robot.imageUrl;
  let AddCardRobot = document.createElement("div");
  AddCardRobot.classList.add("col"); // Add Bootstrap class to the column
  AddCardRobot.innerHTML = `
    <div class="card shadow-sm">
      <img src="${imageUrl}" class="card-img-top" alt="${name}">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">$${price}</small>
        </div>
      </div>
    </div>
  `;
  CardRobot.appendChild(AddCardRobot);
}

function addANewRobot() {
  fetch("http://localhost:8081/robot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 22,
      name: "Robot Abraham",
      price: 100.9,
      description: "I robot is one example of an image for my exercise",
      imageUrl: "https://robohash.org/Abraham",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errData) => {
          throw new Error(`Error adding robot: ${errData.error}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Robot added successfully:", data);
      alert("Robot added successfully!");
    })
    .catch((error) => {
      console.error("Error adding robot:", error);
      alert("Error adding robot: " + error.message);
    });
}

function deleteOneRobot() {
  // Fetch the value from the input field
  let id = document.getElementById("deleteId").value;
  console.log(id);
  fetch(`http://localhost:8081/robot/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      if (response.status != 200) {
        return response.json().then((errData) => {
          throw new Error(
            `DELETE response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`
          );
        });
      }
      return response.json();
    })
    .then((deleteThisRobot) => {
      displayCRUDRobot(deleteThisRobot, "col4", "Robot Deleted");
    })
    .catch((error) => {
      // Display alert if there's an error
      alert("Error deleting robot: " + error.message);
    });
}


function updateOneRobot() {
  // Fetch the value from the input field
  let id = document.getElementById("updateId").value;
  console.log(id);
  fetch(`http://localhost:8081/robot/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Robot Abraham ALDACO-GASTELUM",
      price: 100.9,
      description: "I robot is one example of an image for my exercise",
      imageUrl: "https://robohash.org/Abraham",
    }),
  })
    .then((response) => {
      if (response.status != 200) {
        return response.json().then((errData) => {
          throw new Error(
            `UPDATE response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`
          );
        });
      }
      return response.json();
    })
    .then((updateThisRobot) => {
      displayCRUDRobot(updateThisRobot, "col5", "Robot Updated");
    })
    .catch((error) => {
      // Display alert if there's an error
      alert("Error UPDATING robot:" + error.message);
    });
  }

  // Replace image and text per every one in HTML
function displayCRUDRobot(robot,divcol,message) {
  console.log(message);
  console.log(robot);

  var CardRobot = document.getElementById(divcol);
    let id = robot.id;
    let name = robot.name;
    let price = robot.price;
    let description = robot.description;
    let imageUrl = robot.imageUrl;

    let AddCardRobot = document.createElement("div");
    AddCardRobot.classList.add(divcol); // Add Bootstrap class to the column
    AddCardRobot.innerHTML = `
            <div class="card shadow-sm">
                <h1>${message} ${id}</h1>
                <img src=${imageUrl} class="card-img-top" alt="..."></img>
                <div class="card-body">
                    <p class="card-text"> <strong>${description}</strong></p>
                    <p class="card-text"> <strong>${name}</strong>, $${price}</p>
                </div>
            </div>
        `;
    CardRobot.appendChild(AddCardRobot);
} // end of function