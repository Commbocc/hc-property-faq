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
  get garbageDates () {
    return accountForHolidays(this.garbageString)
  }

  get recycleDates () {
    return accountForHolidays(this.recycleString, true)
  }

  get yardDates () {
    return accountForHolidays(this.yardWasteString)
  }

  get garbageDays () {
    return weekdaysInArr(this.garbageDates)
  }

  get recycleDays () {
    return weekdaysInArr(this.recycleDates)
  }

  get yardDays () {
    return weekdaysInArr(this.yardDates)
  }

  get details () {
    // this is bad practice, consider adding these attributes to the Feature returned from the API
    return _.find(providerIndex, p => _.contains(p.ids, this.providerString))
  }
}

function accountForHolidays (string, isRecycling = false) {
  const momentArr = stringToDaysOfWeek(string)
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
  // var date = (startDate) ? moment(startDate) : moment('12/25/2014', 'MM/DD/YYY')
  if (date.isoWeekday() <= dowInt) {
    return date.isoWeekday(dowInt)
  } else {
    return date.add(1, 'weeks').isoWeekday(dowInt)
  }
}

function weekdaysInArr (momentArr) {
  return _.chain(momentArr)
  .sortBy(d => d.day())
  .map(d => d.format('dddd') + 's')
  .uniq(true).value().join(' & ')
}

// console.log(isHoliday(moment('05/29/2017', 'MM/DD/YYY'))) // => true
export function isHoliday (testDate, isRecycling = false) {
  testDate = moment(testDate.valueOf())
  const dateD = testDate.date()
  const dateM = testDate.month() + 1
  const dateW = testDate.day()
  const dateL = testDate.endOf('month').date()
  var dateWnum, dateStr

  // new years (except recycling), independence, christmas
  dateStr = [dateM, dateD].join('/')
  if (dateStr === '1/1' && isRecycling) {
    return false
  }
  if (dateStr === '1/1' || dateStr === '7/4' || dateStr === '12/25') {
    return true
  }

  // labor, thanksgiving
  dateWnum = Math.floor((dateD - 1) / 7) + 1
  dateStr = [dateM, dateWnum, dateW].join('/')
  if (dateStr === '9/1/1' || dateStr === '11/4/4') {
    return true
  }

  // memorial
  dateWnum = Math.floor((dateL - dateD - 1) / 7) + 1
  dateStr = [dateM, dateWnum, dateW].join('/')
  if (dateStr === '5/1/1') {
    return true
  }

  // else
  return false
}
