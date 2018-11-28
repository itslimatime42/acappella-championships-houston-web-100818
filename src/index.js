const winnerBanner = document.querySelector('#winner')
const tableHeaders = document.querySelector('#table-headers')
const tableBody = document.querySelector('#table-body')

let groups
let winner

// fetch groups data
fetch('http://localhost:3000/a_cappella_groups')
.then(function(response) {
  return response.json()
}).then(function(result) {
  groups = result
  render()
})

const render = function() {
  renderWinner(winner)
  renderTable()
}

const renderWinner = function(winner) {
  if (winner) {
    winnerBanner.innerText = `Winner: ${winner.college.name} ${winner.name}`
  } else {
    winnerBanner.innerText = 'Who will be crowned winner?'
  }
}

const renderTable = function() {
  tableBody.innerHTML = ''
  groups.forEach(function(group) {
    if (group != winner) {renderRow(group)}
  })
}

const renderRow = function(group) {
  const row = tableBody.appendChild(document.createElement('tr'))
  row.innerHTML = `
    <td class='padding-center'>${group.college.name}</td>
    <td class='padding-center'>${group.name}</td>
    <td class='padding-center'>${group.membership}</td>
    <td class='padding-center'>${group.college.division}</td>
  `
  renderWinnerButton(group, row)
  renderDeleteButton(group, row)
}

const renderWinnerButton = function(group, row) {
  const winnerButton = row.appendChild(document.createElement('td'))
  winnerButton.className = 'button-center'
  winnerButton.innerHTML = `<button><img src="assets/trophy.png"/></button>`
  winnerButton.addEventListener('click', function() {
    winner = group
    render()
  })
}

const renderDeleteButton = function(group, row) {
  const deleteButton = row.appendChild(document.createElement('td'))
  deleteButton.className = 'button-center'
  deleteButton.innerHTML = `<button><img src="assets/trashcan.png"/></button>`
  deleteButton.addEventListener('click', function() {
    deleteGroup(group)
    render()
  })
}

const deleteGroup = function(groupToDelete) {
  groups = groups.filter(function(group) {
    return group !== groupToDelete
  })
}

const sortTableBy = function(columnId) {
  if (columnId === 'cant-sort') {
    alert('Cannot sort by this column.')
  } else {
    let category = columnId.split('-')[0]
    let subcategory = columnId.split('-')[1]
    sortGroups(category, subcategory)
  }
  render()
}

const sortGroups = function(category, subcategory) {
  groups = groups.sort(function(groupA, groupB) {
    if (subcategory) {
      return groupA[category][subcategory].localeCompare(groupB[category][subcategory])
    } else {
      return groupA[category].localeCompare(groupB[category])
    }
  })
}

// Add event listener for every column title in table
for (let i = 0; i < tableHeaders.children.length; i++) {
  let columnTitle = tableHeaders.children[i]
  columnTitle.addEventListener('click', function() {
    sortTableBy(columnTitle.id)
  })
}
