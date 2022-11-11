console.log("***https://cdn.jsdelivr.net/gh/dakoalbeik/cdn-files/script2.js***")

document.head.innerHTML += `
  <style>
    .custom-wrapper {
      width: 100px;
      height: 100px;
      background: yellow;
    }
  </style>
`

setInterval(() => {
  location.reload();
}, 1000 * 60 * 20)

let dash = document.getElementById('YsiTabStrip1_tab1');

if(dash.innerText.indexOf("Available Units") !== -1 && dash.classList.contains('TabStripActiveCell')){
  const availableAptsTbl = document.getElementById('DashboardGrid_DataTable');
  const body = availableAptsTbl.firstElementChild;
  const headers = ['unit', '', 'br', 'rent', 'date', "", "sqft", "occ", "amentities"]
  const apts = []
  for (let row = body.firstElementChild; row; row = row.nextElementSibling) {
    const apt = {}
    for(let i = 0; i < headers.length; i++){
      if(headers[i] !== "") {
        apt[headers[i]] = row.children[i].firstElementChild.innerText
      }
    }
    apts.push(apt);
  }
  createUnitsUi(apts)
}


document.addEventListener("keydown", ({key}) => {
  // to fetch available apts
  if (key !== "+") return;
  const link = document.createElement('a')
  document.body.appendChild(link)
  link.href = "JavaScript:__doPostBack('AvailableUnitsDash','')"
  link.click()

})

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

function createUnitsUi(unitsArray){
  console.log("Create units UI");
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('custom-wrapper');
  document.body.appendChild($wrapper);
  unitsArray.forEach((unit)=>{
    console.log(unit)
  })
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


// create ui elements 
const apartmentsElem = document.createElement('div');
apartmentsElem.classList.add('my_custom_wrapper')
document.body.appendChild(apartmentsElem);
apartmentsElem.style = {
  ...apartmentsElem.style,
  zIndex: '12312312323',
  width: '100px',
  height: '100px',
  backgroundColor: 'red'
}