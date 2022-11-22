'use strict'

// Render the cinema (7x15 with middle path)
// implement the Seat selection flow
// Popup shows the seat identier - e.g.: 3-5 or 7-15
// Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')

// Uplift your model - each seat should have its own price... 
// In seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gElSelectedSeat = null
const gCinema = createCinema()

function onInit() {
    renderCinema()
}


function createCinema() {
    const cinema = []
    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 15; j++) {
            const cell = {
                isSeat : (j !== 7)
            }
            if (cell.isSeat) {
                cell.price = 10 + i
                cell.isBooked = false
            } 
            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            
            // For cell of type SEAT add seat class
            var className = ''
            if (cell.isSeat) className = 'seat'
            if (cell.isBooked) className += ' booked'

            const title = `Seat: ${i+1}, ${j+1}`

            // TODO: for cell that is booked add booked class
            // Add a seat title: `Seat: ${i}, ${j}`

            strHTML += `\t<td class="cell ${className}" title="${title}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    const cell = gCinema[i][j]
    // ignore none seats and booked
    if (!cell.isSeat || cell.isBooked) return
    console.log('Cell clicked: ', elCell, i, j)
    
    // Support selecting a seat
    elCell.classList.add('selected')
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }

    // Only a single seat should be selected
    gElSelectedSeat = (gElSelectedSeat === elCell)? null : elCell

    // When seat is selected a popup is shown
    if (gElSelectedSeat) showSeatDetails({i:i, j:j})
    else hideSeatDetails()
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]

    const seatsAround = getAvailableSeatsAround(pos)
    console.log('seatsAround', seatsAround)

    elPopup.querySelector('h2 span').innerText = `${pos.i+1}-${pos.j+1}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    elPopup.querySelector('p span').innerText = seatsAround.length
    const elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function bookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    //book the seat
    gCinema[i][j].isBooked = true
    renderCinema()
    unSelectSeat()
}

function unSelectSeat() {
    hideSeatDetails()
    gElSelectedSeat.classList.remove('selected')
    gElSelectedSeat = null
}



function getAvailableSeatsAround(pos) {
    var seats = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gCinema[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (gCinema[i][j].isSeat && !gCinema[i][j].isBooked) seats.push({i:i, j:j})
        }
    }
    return seats
}
