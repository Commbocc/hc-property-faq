<template lang="html">
  <div v-if="provider">
    <!-- <details><pre>{{ $store.state.hauler }}</pre></details> -->
    <table class="table table-striped table-">
      <tbody>
        <tr v-for="dateBlock in dateBlocks">
          <td>
            <strong>{{ dateBlock.title }}</strong><br>
            Next Pickup(s)
          </td>
          <td>
            <strong>{{ daysInBlock(dateBlock.dates) }}</strong>
            <ul class="list-unstyled">
              <li v-for="date in dateBlock.dates" class="px-1" :class="(isHoliday(date, dateBlock.isRecycling)) ? 'bg-danger text-white' : null">
                {{ date.format('dddd MMMM Do') }}
                <strong v-if="isHoliday(date, dateBlock.isRecycling)">
                  - No Pickup on Holiday
                </strong>
              </li>
            </ul>
          </td>
        </tr>

        <tr>
          <td>
            <strong>Provider</strong>
          </td>
          <td>
            <strong>{{ provider.details.name }}</strong>
            <p v-text="provider.details.address"></p>
            <ul class="list-unstyled mb-0">
              <li>
                <span class="fa fa-fw fa-phone" aria-hidden="true"></span> <span class="sr-only">Phone:</span>
                {{ provider.details.phone }}
              </li>
              <li>
                <span class="fa fa-fw fa-fax" aria-hidden="true"></span> <span class="sr-only">Fax:</span>
                {{ provider.details.fax }}
              </li>
              <li>
                <span class="fa fa-fw fa-envelope" aria-hidden="true"></span> <span class="sr-only">Email:</span>
                <a :href="'mailto:'+provider.details.email" v-text="provider.details.email"></a><br>
              </li>
              <li>
                <span class="fa fa-fw fa-globe" aria-hidden="true"></span> <span class="sr-only">Web:</span>
                <a :href="provider.details.website" target="_blank">Website</a>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from 'underscore'
import { mapState } from 'vuex'
import { isHoliday as holidayChecker } from '@/store/models/provider'

export default {
  methods: {
    isHoliday (moment) {
      return holidayChecker(moment)
    },
    daysInBlock (dates) {
      return _.chain(dates)
      .sortBy(d => d.day())
      .map(d => d.format('dddd') + 's')
      .uniq(true).value().join(' & ')
    }
  },
  computed: {
    ...mapState({
      provider: state => state.hauler.provider
    }),
    dateBlocks () {
      return [{
        title: 'Garbage Days',
        dates: this.provider.nextGarbageDates,
        isRecycling: false
      },
      {
        title: 'Recycle Days',
        dates: this.provider.nextRecycleDates,
        isRecycling: true
      },
      {
        title: 'Yard Waste Days',
        dates: this.provider.nextYardDates,
        isRecycling: false
      }]
    }
  }
}
</script>
