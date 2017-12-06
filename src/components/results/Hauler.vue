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
            <strong>{{ dateBlock.days }}</strong>
            <ul class="list-unstyled">
              <li v-for="date in dateBlock.dates" class="px-1 my-1" :class="(isHoliday(date, dateBlock.isRecycling)) ? 'bg-danger text-white' : null">
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
            <div is="Provider" :provider="provider"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Provider from '@/components/results/Provider'

export default {
  components: {
    Provider
  },
  computed: {
    ...mapState({
      provider: state => state.hauler.provider
    }),
    ...mapGetters([
      'isHoliday'
    ]),
    dateBlocks () {
      return [{
        title: 'Garbage Days',
        days: this.provider.garbageDays,
        dates: this.provider.garbageDates,
        isRecycling: false
      },
      {
        title: 'Recycle Days',
        days: this.provider.recycleDays,
        dates: this.provider.recycleDates,
        isRecycling: true
      },
      {
        title: 'Yard Waste Days',
        days: this.provider.yardDays,
        dates: this.provider.yardDates,
        isRecycling: false
      }]
    }
  }
}
</script>
