// console.log(firebase);

// Add a person to the database
// when the user clicks on the Submit button, we collect the person details from
// the form and send that over to Firebase

document.querySelector("#submit").addEventListener("click", () => {
  let name = document.querySelector("#name").value;
  let age = document.querySelector("#age").value;
  let color = document.querySelector("#favcolor").value;

  let user = {
    name: name,
    age: parseInt(age),
    color: color,
  };

  db.collection("mypeople")
    .add(user)
    .then(() => {
      alert("New user added!");
      show_people();
    });
});

function show_people() {
  db.collection("mypeople")
    .get()
    .then((mydata) => {
      let html = "";

      mydata.docs.forEach((d) => {
        html += `<p class="p-3">
          ${d.data().name} is ${d.data().age} years old.
          <span class="subtitle m-4">${d.id}</span>
          <button onclick="del_doc('${d.id}')">X</button>
        </p>`;
      });

      document.querySelector("#all_people").innerHTML = html;
    });
}

show_people();

function del_doc(docid) {
  db.collection("mypeople")
    .doc(docid)
    .delete()
    .then(() => {
      alert("User deleted!");
      show_people();
    });
}

// ============================
// TASK 1: ADD TEAMS
// ============================

function add_teams() {
  const teams = [
    {
      name: "Real Madrid",
      city: "Madrid",
      country: "Spain",
      scorers: ["Ronaldo", "Benzema", "Hazard"],
      fans: 798,
      type: "club",
    },
    {
      name: "Barcelona",
      city: "Barcelona",
      country: "Spain",
      scorers: ["Messi", "Suarez", "Puyol"],
      fans: 738,
      type: "club",
    },
    {
      name: "Manchester United",
      city: "Manchester",
      country: "England",
      scorers: ["Cantona", "Rooney", "Ronaldo"],
      fans: 755,
      type: "club",
    },
    {
      name: "Manchester City",
      city: "Manchester",
      country: "England",
      scorers: ["Sterling", "Aguero", "Haaland"],
      fans: 537,
      type: "club",
    },
    {
      name: "Brazil National Team",
      city: "N/A",
      country: "Brazil",
      scorers: ["Ronaldinho", "Cafu", "Bebeto"],
      fans: 950,
      type: "national",
    },
    {
      name: "Argentina National Team",
      city: "N/A",
      country: "Argentina",
      scorers: ["Messi", "Batistuta", "Maradona"],
      fans: 888,
      type: "national",
    },
    {
      name: "Atletico Madrid",
      city: "Madrid",
      country: "Spain",
      scorers: ["Aragones", "Griezmann", "Torez"],
      fans: 400,
      type: "club",
    },
  ];

  teams.forEach((team) => {
    db.collection("teams").add(team);
  });

  alert("Teams added!");
}

// ============================
// DISPLAY TEAMS
// ============================

function show_teams() {
  db.collection("teams")
    .get()
    .then((data) => {
      let html = "";

      data.docs.forEach((doc) => {
        const t = doc.data();
        html += `<p>${t.name} (${t.country}) - ${t.fans}M fans</p>`;
      });

      document.querySelector("#teams").innerHTML = html;
    });
}

// ============================
// TASK 2: QUERIES
// ============================

function display(title, docs) {
  let html = `<h3>${title}</h3>`;

  docs.forEach((d) => {
    html += `<p>${d.data().name}</p>`;
  });

  document.querySelector("#queries").innerHTML += html;
}

// 1
function q_spain() {
  db.collection("teams")
    .where("country", "==", "Spain")
    .get()
    .then((data) => display("Teams in Spain", data.docs));
}

// 2
function q_madrid() {
  db.collection("teams")
    .where("country", "==", "Spain")
    .where("city", "==", "Madrid")
    .get()
    .then((data) => display("Madrid Teams", data.docs));
}

// 3
function q_national() {
  db.collection("teams")
    .where("type", "==", "national")
    .get()
    .then((data) => display("National Teams", data.docs));
}

// 4
function q_not_spain() {
  db.collection("teams")
    .get()
    .then((data) => {
      const filtered = data.docs.filter((d) => d.data().country !== "Spain");
      display("Not Spain", filtered);
    });
}

// 5
function q_not_spain_england() {
  db.collection("teams")
    .get()
    .then((data) => {
      const filtered = data.docs.filter(
        (d) => d.data().country !== "Spain" && d.data().country !== "England",
      );
      display("Not Spain/England", filtered);
    });
}

// 6
function q_spain_700() {
  db.collection("teams")
    .where("country", "==", "Spain")
    .where("fans", ">", 700)
    .get()
    .then((data) => display("Spain >700M", data.docs));
}

// 7
function q_500_600() {
  db.collection("teams")
    .where("fans", ">=", 500)
    .where("fans", "<=", 600)
    .get()
    .then((data) => display("500–600M Fans", data.docs));
}

// 8
function q_ronaldo() {
  db.collection("teams")
    .where("scorers", "array-contains", "Ronaldo")
    .get()
    .then((data) => display("Ronaldo Teams", data.docs));
}

// 9
function q_big3() {
  db.collection("teams")
    .where("scorers", "array-contains-any", ["Ronaldo", "Messi", "Maradona"])
    .get()
    .then((data) => display("Top Scorers", data.docs));
}

// ============================
// TASK 3: UPDATES
// ============================

function update_teams() {
  db.collection("teams")
    .get()
    .then((data) => {
      data.docs.forEach((doc) => {
        const t = doc.data();

        if (t.name === "Real Madrid") {
          db.collection("teams")
            .doc(doc.id)
            .update({
              name: "Real Madrid FC",
              fans: 811,
              scorers: ["Ronaldo", "Benzema", "Crispo"],
            });
        }

        if (t.name === "Barcelona") {
          db.collection("teams")
            .doc(doc.id)
            .update({
              name: "FC Barcelona",
              fans: 747,
              scorers: ["Messi", "Suarez", "Deco"],
            });
        }
      });
    });
}

function add_colors() {
  db.collection("teams")
    .get()
    .then((data) => {
      data.docs.forEach((doc) => {
        const t = doc.data();

        if (t.name === "Real Madrid FC") {
          db.collection("teams")
            .doc(doc.id)
            .update({
              color: { home: "White", away: "Black" },
            });

          db.collection("teams").doc(doc.id).update({
            "color.away": "Purple",
          });
        }

        if (t.name === "FC Barcelona") {
          db.collection("teams")
            .doc(doc.id)
            .update({
              color: { home: "Red", away: "Gold" },
            });

          db.collection("teams").doc(doc.id).update({
            "color.away": "Pink",
          });
        }
      });
    });
}

q_spain();
q_madrid();
q_national();
q_not_spain();
q_not_spain_england();
q_spain_700();
q_500_600();
q_ronaldo();
q_big3();
