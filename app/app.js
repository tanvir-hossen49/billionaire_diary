window.onload = () => {
  loadData();
};

// when loadFunction is called set billionaire value = array of object;
let billionaireArray;
let count = 0;

// load data from server
const loadData = async (category = "?limit=10") => {
  // clear table body
  resetTbody();

  // load spin animation
  loadAnimation();

  try {
    const response = await fetch(
      `https://forbes400.onrender.com/api/forbes400/${category}`
    );
    const data = await response.json();
    displayData(data);

    // clone data
    billionaireArray = JSON.parse(JSON.stringify(data));

    //create unique value of row and create an object
    getUniqueValue();
  } catch (error) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = `
    <tr></tr>
        <tr id='spin'>
          <td colspan='5'>
              <div>
              <h1>Feild.........</h1>
            </div>  
          </td>
        </tr>
    <tr></tr>
  `;
  }
};

// display data in UI
const displayData = data => {
  const tableBody = document.getElementById("table-body");
  console.log(data);
  // clear table body before added element
  tableBody.innerHTML = "";

  try {
    data.forEach(user => {
      console.log(user);
      let { rank, finalWorth, personName, countryOfCitizenship } = user;
      let industry = user?.industries?.[0] ?? "NO Industries";
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `
            <td>${++count}) ${personName}</td>
            <td>${countryOfCitizenship}</td>
            <td>${industry}</td>
            <td>${rank}</td>
            <td class='final-worth'>${finalWorth.toFixed(2)}</td>
    `;
      tableBody.appendChild(tableRow);
    });
    calculationTotalAmount();
    count = 0;
  } catch (error) {
    console.log(error);
  }
};

// calculation total amount of billionaire
const calculationTotalAmount = () => {
  const amountElement = document.querySelectorAll(".final-worth");
  const totalAmountElement = document.getElementById("total-amount");
  totalAmountElement.innerHTML = "00.00";
  let total = 0;
  amountElement.forEach(ele => {
    if (getComputedStyle(ele.parentElement).display !== "none") {
      total += Number(ele.innerText);
    }
  });
  totalAmountElement.innerText = "$" + total.toFixed(2);
};

// get unique value from table column
const getUniqueValue = () => {
  let unique_value_obj = {};
  const allFiters = document.querySelectorAll(".table-filter");

  allFiters.forEach((fiter_i, index) => {
    const cellID = fiter_i.parentElement.id;
    const rows = document.querySelectorAll("#table-body > tr");

    rows.forEach(row => {
      const cell_value = row.querySelector(
        "td:nth-child(" + (index + 2) + ")"
      ).innerHTML;

      //if the cell_id already present in the object
      if (cellID in unique_value_obj) {
        if (unique_value_obj[cellID].includes(cell_value)) {
        } else {
          unique_value_obj[cellID].push(cell_value);
        }
      } else {
        unique_value_obj[cellID] = new Array(cell_value);
      }
    });
  });

  updateSelectOptions(unique_value_obj);
};

// create option element and dropdown list
const updateSelectOptions = obj => {
  const allFiters = document.querySelectorAll(".table-filter");
  allFiters.forEach(filter_i => {
    const option = document.createElement("option");
    option.setAttribute("selected", "selected");
    option.innerText = "All";
    filter_i.appendChild(option);
    obj[filter_i.parentElement.id].forEach(element => {
      filter_i.innerHTML += `
      <option value='${element}'>${element}</option>
      `;
    });
  });
};

// filter
const filterTable = () => {
  const tableFilter = document.querySelectorAll(".table-filter-all");
  let obj = {};
  if (billionaireArray) {
    tableFilter.forEach(filte_i => {
      let value = filte_i.value;
      if (value !== "All") {
        obj[filte_i.parentElement.id] = value;
      }
    });

    if (obj.person && obj.citizenship && obj.industry) {
      const newBillionaireArray = billionaireArray.filter(
        ele =>
          obj.industry === ele.industries[0] &&
          obj.person === ele.gender &&
          obj.citizenship === ele.countryOfCitizenship
      );
      displayData(newBillionaireArray);
    } else if (obj.person && obj.citizenship) {
      const newBillionaireArray = billionaireArray.filter(
        ele =>
          obj.person === ele.gender &&
          obj.citizenship === ele.countryOfCitizenship
      );
      displayData(newBillionaireArray);
    } else if (obj.person && obj.industry) {
      const newBillionaireArray = billionaireArray.filter(
        ele => obj.person == ele.gender && obj.industry === ele.industries[0]
      );
      displayData(newBillionaireArray);
    } else if (obj.citizenship && obj.industry) {
      const newBillionaireArray = billionaireArray.filter(
        ele =>
          obj.citizenship === ele.countryOfCitizenship &&
          obj.industry === ele.industries[0]
      );

      displayData(newBillionaireArray);
    } else if (obj.person) {
      const newBillionaireArray = billionaireArray.filter(
        ele => obj.person === ele.gender
      );

      displayData(newBillionaireArray);
    } else if (obj.citizenship) {
      const newBillionaireArray = billionaireArray.filter(
        ele => obj.citizenship === ele.countryOfCitizenship
      );
      displayData(newBillionaireArray);
    } else if (obj.industry) {
      const newBillionaireArray = billionaireArray.filter(
        ele => obj.industry === ele.industries[0]
      );

      displayData(newBillionaireArray);
    } else {
      displayData(billionaireArray);
    }
  }
};

// reset all items of tabel body
const resetTbody = () => {
  // clear dropdown menu
  const allFiters = document.querySelectorAll(".table-filter");
  allFiters.forEach(e => (e.innerHTML = ""));

  // calculation amount
  document.getElementById("total-amount").innerHTML = "00.00";
};

// load animation
const loadAnimation = () => {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = `
  <tr></tr>
  <tr id='spin'>
    <td colspan='5'>
        <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>  
    </td>
  </tr>

  <tr></tr>
  `;
};

const search = e => {
  e.preventDefault();

  const inputValue = document.getElementById("search").value.toLowerCase();

  const tableBody = document.getElementById("table-body");
  const tableRows = tableBody.querySelectorAll("tr");

  tableRows.forEach((row, i) => {
    const td = row.getElementsByTagName("td")[0];

    if (td) {
      let text = td.innerHTML || td.textContent;

      if (text.toLowerCase().indexOf(inputValue) > -1) {
        tableRows[i].style.display = "";
      } else {
        tableRows[i].style.display = "none";
      }
      calculationTotalAmount();
    }
  });
};

// Event handler (when click category button)
const filterButton = document.getElementById("filter-btn");

// add active class in button
const buttons = document.querySelectorAll("#filter-btn button");
buttons.forEach(button => {
  button.addEventListener("click", () => {
    filterButton.querySelector(".active").classList.remove("active");
    button.classList.add("active");
  });
});

// Event listener for click filter button
filterButton.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const att = e.target.getAttribute("data-value");
    loadData(att);
  } else if (e.target.tagName === "SPAN") {
    const att = e.target.parentElement.getAttribute("data-value");
    loadData(att);
  }
});

// Event listener
document.querySelectorAll(".table-filter-all").forEach(filter_i => {
  filter_i.addEventListener("change", () => {
    filterTable();
  });
});

document.getElementById("searchForm").addEventListener("submit", search);
