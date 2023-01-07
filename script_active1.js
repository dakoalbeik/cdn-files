console.log("***https://cdn.jsdelivr.net/gh/dakoalbeik/cdn-files/script2.js***")

setInterval(() => {
  location.reload();
}, 1000 * 60 * 20)

let dash = document.getElementById('YsiTabStrip1_tab1');





document.getElementById('cmdLogin')?.click();

let shouldClick = true;

if (dash) {
  if (!dash.innerText.includes("Dashboard")) {
    shouldClick = false;
  }
}


if (shouldClick) {
  let search = document.getElementById('YsiTabStrip1_tab2');
  if (search?.innerText.includes("Person Search")) {
    search.click();
    let searchInput = document.getElementById('PersonSearch_UnitLookup_LookupCode');
    searchInput.focus();
    searchInput.select();
  }
}


//find the table and call clickCurrentResident
let myTable = document.querySelector('#PersonSearch_Results_DataTable');
// get the name input 
let nameInputBox = document.getElementById('PersonSearch_Name_TextBox');
if (myTable != null && nameInputBox.value === "") {
  clickCurrentResident();
}

const pesonalInfoBtn = document.getElementById('YsiTabStrip1_tab5');
if (pesonalInfoBtn) {
  pesonalInfoBtn.click()
}

const residentIdBox = document.getElementById('Tent_Code_TextBox');
if (residentIdBox) {
  residentIdBox.select();
  residentIdBox.setSelectionRange(0, 99999); /* For mobile devices */
  /* Copy the text inside the text field */
  navigator.clipboard.writeText(residentIdBox.value);
}


const emailBox = document.getElementById('Tent_Email_TextBox');
if (emailBox) {
  emailBox.select();
  emailBox.setSelectionRange(0, 99999); /* For mobile devices */
  /* Copy the text inside the text field */
  navigator.clipboard.writeText(emailBox.value);
}

function clickAttachments() {
  const attachBtn = document.getElementById('ResidentDataLinks:LinkList:DataTable:row0:Value_anchor');
  if (attachBtn) {
    //attachBtn.click();
    const attachBtnHref = attachBtn.href;
    const newLink = attachBtnHref.slice(85, 91)
    const LINK = `https://www.yardiasptx10.com/80245lindsey/Pages/SysAttachmentView.aspx?iType=1&hRecord=${newLink}`

    const newWindow = window.open(LINK, "_self");


  }
}

function openLedger() {
  const ledger = document.getElementById('ResidentReportsLinks:LinkList:DataTable:row0:Value_anchor');
  if (ledger) {
    const ledgerLink = ledger.href;
    const newLink = ledgerLink.slice(83, 89);
    const LINK = `https://www.yardiasptx10.com/80245lindsey/Pages/ResResidentLedger.aspx?hTenant=${newLink}`
    window.open(LINK, "_self");
  }
}

const findBtn = document.getElementById('cmdFind_Button')
if (findBtn) {
  console.log("findBtn")
  findBtn.addEventListener('click', copyTCodeFromFindPage);
}

function clickCurrentResident() {
  const tBody = myTable.firstElementChild;
  const rows = tBody["rows"];
  let cells = null;

  for (let row of rows) {
    cells = row["cells"];
    let text = cells[3].innerText;
    if (text.includes("Current")) {
      cells[0].firstElementChild.click();
    }
  }
} //searchs the table and clicks on current

function copyTCodeFromFindPage() {
  // add code here
  if (window.location.href.indexOf('pages/Lookup2.aspx') === -1) {
    return;
  }

  setTimeout(function() {
    const newDiv = document.createElement('div');
    newDiv.style.width = '200px';
    newDiv.style.height = 'fit-content';
    newDiv.style.position = 'absolute';
    newDiv.style.backgroundColor = 'yellow';
    newDiv.style.top = '0px';
    newDiv.style.right = '0px';
    document.body.appendChild(newDiv);

    let row = document.getElementById('row1');
    let counter = 1;
    while (row && counter !== -1) {
      const nameField = row.children[2].innerText;
      if (nameField.indexOf('(Current)') !== -1) {
        newDiv.innerText = row.children[1].innerText;
        const parts = nameField.split(',');
        newDiv.innerText += (parts[1] + " " + parts[0])
        counter = -2;
      }
      counter++;
      row = document.getElementById(`row${counter}`)
    }
  }, 800);
}

function tableToArray(string) {
  const NEWLINE_CHAR = String.fromCharCode(10);
  return string.split(NEWLINE_CHAR);

}

async function clickDelay(element, amount = 3000) {
  return new Promise(resolve => {
    setTimeout(() => {
      element.click();
      resolve();
    }, amount)
  })
}

async function closeWorkorders() {
  const table = document.getElementById('DashboardGrid_DataTable')
  if (!table) {
    return
  }

  const body = table.firstElementChild;
  for (let row = body.firstElementChild; row; row = row.nextElementSibling) {
    if (row.children[1].innerText.indexOf("Quarterly Inspections") !== -1) {
      await clickDelay(row.children[9].firstElementChild)
    }
  }
}

/**************************************************************************/
/******************CODE BELOW IS TO DISPLAY THE UNTIS UI ******************/
/**************************************************************************/
if (window.location.pathname === "/80245lindsey/pages/SiteDashboard.aspx") main();


async function main() {
  document.addEventListener("keydown", ({
    key
  }) => {
    // to fetch available apts
    if (key === "+") {
      __doPostBack('AvailableUnitsDash', '')
    }

  })
  if (shouldShowPopup()) {
    const apts = getApartmentsTable();
    const notes = getNotesFromStorage();
    createUI(apts, notes);
  }
}

function shouldShowPopup() {
  const middleTab = document.getElementById('YsiTabStrip1_tab1')
  return (middleTab?.innerText.includes("Available Units") &&
    middleTab?.classList.contains('TabStripActiveCell'));
}

function getNotesFromStorage() {
  return JSON.parse(localStorage.getItem("__NOTES")) || {};
}

function setNotesToStorage(obj) {
  localStorage.setItem("__NOTES", JSON.stringify(obj))
}

function updateStorage(address, text) {
  setNotesToStorage({
    ...getNotesFromStorage(),
    [address]: text
  })
}

function createUI(apts, notes) {

  addStylesToDOM(STYLES);

  const apartmentsElem = createElement('div', "my_custom_wrapper", "", document.body)

  createElement('button', '__close', "✕", apartmentsElem).addEventListener('click', () => {
    apartmentsElem.style.display = "none";
  })

  const updateStorageBtn = createElement('button', '__close', `00`, apartmentsElem);
  updateStorageBtn.addEventListener('click', () => deleteAccessNotes(apts));
  updateStorageBtn.style.transform = "translateX(-100%)";

  let lastOneBed = false;
  apts.forEach((apt, i) => {
    const aptElem = document.createElement('div');
    aptElem.classList.add('single_unit');

    // work on card here
    const inner_e = createElement('div', '__inner', "", aptElem),
      face_e = createElement('div', '__face', "", inner_e),
      back_e = createElement('div', '__back', "", inner_e);

    const spans = [{
        css_class: "br",
        text: `${apt.br}/${apt.sqft.trim() === "1,093" ? 2 : 1}`
      },
      {
        css_class: "unit",
        text: `${apt.unit.slice(0, 5)}-${apt.unit.slice(5)}`
      },
      {
        css_class: "rent",
        text: `$${apt.rent}`
      }, {
        css_class: "date",
        text: apt.date
      },
      {
        css_class: "golf",
        text: apt.isGolf ? "⛳" : `🅿️`
      }
    ]

    apt.isUpstairs && spans.push({
      css_class: 'stairs',
      text: "𓊍"
    })

    spans.forEach(({
      css_class,
      text
    }) => createElement('span', `__${css_class}`, text, face_e))

    const input_e = createElement('textarea', '__input', '', back_e);
    input_e.value = notes[apt.unit] || "";
    input_e.addEventListener('input', ({
      target
    }) => updateStorage(apt.unit, target.value))

    apartmentsElem.appendChild(aptElem);
    if (apts[i].br === "1" && apts[i + 1]?.br !== "1" && !lastOneBed) {
      lastOneBed = true;
      createElement('div', '__divider', "", apartmentsElem);
    }
  })

}

function createElement(tag, css_class, text, parent) {
  const element = document.createElement(tag);
  element.classList.add(css_class);
  element.innerText = text;
  return parent.appendChild(element);
}

function getApartmentsTable() {
  const availableAptsTbl = document.getElementById('DashboardGrid_DataTable');
  const body = availableAptsTbl.firstElementChild;
  const headers = ['unit', '', 'br', 'rent', 'date', "", "sqft", "occ"]
  const apts = []
  for (let row = body.firstElementChild; row; row = row.nextElementSibling) {
    const apt = {}
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] !== "") {
        apt[headers[i]] = row.children[i].firstElementChild.innerText.trim()
      }
    }
    apt.isUpstairs = !(apt.unit[5] % 2);
    apt.isGolf = row.children[8].firstElementChild.innerText.includes('Golf');
    !apt.occ.includes('Eviction') && apts.push(apt);
  }

  apts.sort((a, b) => (parseFloat(a.rent.replace(/,/g, '')) - parseFloat(b.rent.replace(/,/g, ''))));

  return apts;
}

function deleteAccessNotes(apts) {
  const notes = getNotesFromStorage();
  const newNotes = {};
  apts.forEach(({
    unit
  }) => {
    if (notes[unit]) {
      newNotes[unit] = notes[unit]
    }
  })
  setNotesToStorage(newNotes)
}

function addStylesToDOM(string) {
  document.head.innerHTML += `<style>${string}</style>`
}


