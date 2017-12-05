import moment from 'moment'
import _ from 'underscore'
import providerIndex from '@/store/models/providerIndex'

// Provider model
export default class Provider {
  constructor (attributes) {
    this.providerString = attributes.Provider
    this.garbageString = attributes.Garbage
    this.recycleString = attributes.Recycling
    this.yardWasteString = attributes.YardWaste
  }

  // static methods
  static esriEndpointUrl (layer = 1) {
    return `https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_HAULER_DATA2/MapServer/${layer}`
  }

  static esriForeignKey () {
    return 'Folio'
  }

  static esriFields () {
    return ['*']
  }

  // getter methods
  get nextGarbageDates () {
    var days = stringToDaysOfWeek(this.garbageString)
    return accountForHolidays(days)
  }

  get nextRecycleDates () {
    var days = stringToDaysOfWeek(this.recycleString)
    return accountForHolidays(days, true)
  }

  get nextYardDates () {
    var days = stringToDaysOfWeek(this.yardWasteString)
    return accountForHolidays(days)
  }

  get details () {
    return _.find(providerIndex, p => _.contains(p.ids, this.providerString))
  }
}

// var h = new Provider({
//   'Address': '6106 OLIVEDALE DR',
//   'City': 'RIVERVIEW',
//   'District': '4',
//   'Folio': 479340322,
//   'Garbage': 'Monday-Thursday',
//   'OBJECTID': 222272,
//   'PA_ZIP': '33578',
//   'Provider': 'WASTE MANAGEMENT',
//   'Recycling': 'Monday',
//   'State': 'FL',
//   'YardWaste': 'Monday',
//   'ZipCode': '33569',
//   'folio2': '0479340322'
// })
// console.log(h)
// console.log(h.nextGarbageDates)

function accountForHolidays (momentArr, isRecycling = false) {
  var addOns = []

  _.each(momentArr, (m, index) => {
    var d = moment(m)
    var nextDay
    while (isHoliday(d, isRecycling)) {
      if (momentArr.length > 1) {
        nextDay = (index + 1 === momentArr.length) ? momentArr[0] : momentArr[index + 1]
        addOns.push(nextDayOfWeek(nextDay.day(), d))
      } else {
        nextDay = moment(d.valueOf()).add(1, 'weeks')
        addOns.push(nextDay)
      }
      d = nextDay
    }
  })

  return _.chain(_.union(momentArr, addOns)).sortBy(d => d.valueOf()).uniq(d => d.valueOf(), true).value()
}

function stringToDaysOfWeek (string) {
  return _.chain(moment()._locale._weekdaysShort).map((dow, index) => {
    return (string.toLowerCase().indexOf(dow.toLowerCase()) >= 0) ? nextDayOfWeek(index) : false
  }).compact().value()
}

function nextDayOfWeek (dowInt, startDate = false) {
  var date = (startDate) ? moment(startDate) : moment()
  // var date = (startDate) ? moment(startDate) : moment('11/20/2017', 'MM/DD/YYY')
  if (date.isoWeekday() <= dowInt) {
    return date.isoWeekday(dowInt)
  } else {
    return date.add(1, 'weeks').isoWeekday(dowInt)
  }
}

// console.log(isHoliday(moment('12/25/2017', 'MM/DD/YYY'))) => true
export function isHoliday (testDate, isRecycling = false) {
  var tempDate, dateD, dateM, dateW, dateWnum, dateStr1, dateStr2, dateStr3
  testDate = moment(testDate.valueOf())

  // new years, independence, christmas
  dateD = testDate.date()
  dateM = testDate.month() + 1
  dateStr1 = [dateM, dateD].join('/')
  if (dateStr1 === '1/1' && isRecycling) {
    return false
  }
  if (dateStr1 === '1/1' || dateStr1 === '7/4' || dateStr1 === '12/25') {
    return true
  }

  // labor, thanksgiving
  dateW = testDate.day()
  dateWnum = Math.floor((dateD - 1) / 7) + 1
  dateStr2 = [dateM, dateWnum, dateW].join('/')
  if (dateStr2 === '9/1/1' || dateStr2 === '11/4/4') {
    return true
  }

  // memorial
  tempDate = testDate.endOf('month')
  dateWnum = Math.floor((tempDate.date() - dateD - 1) / 7) + 1
  dateStr3 = [dateM, dateWnum, dateW].join('/')
  if (dateStr3 === '5/1/1') {
    return true
  }

  // else
  return false
}
