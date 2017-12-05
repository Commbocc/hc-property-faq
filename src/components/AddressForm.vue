<template lang="html">
  <form @submit.prevent="search">

    <!-- <details open><pre>{{ $store.state.address }}</pre></details> -->

    <div class="form-group">

      <div class="input-group input-group-lg">
        <input class="form-control" v-model="input" :placeholder="placeholder" autocomplete="off" required>
        <span class="input-group-btn">
          <button class="btn text-white" :class="btnClass" type="submit">
            <i :class="btnIcon"></i>
            <span class="d-none d-sm-inline-block">
              {{ btnText }}
            </span>
          </button>
        </span>
      </div>

      <small v-if="false" class="form-text text-muted">
        {{ helpText }}
      </small>

    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'address-form',
  data () {
    return {
      input: '6106 olivedale',
      loading: false,
      placeholder: 'Your Street Address...',
      helpText: 'help text'
    }
  },
  computed: {
    btnText () {
      // return (this.loading) ? 'Loading' : 'Find'
      return 'Find'
    },
    btnClass () {
      return (this.loading) ? 'btn-warning' : 'btn-info'
    },
    btnIcon () {
      return (this.loading) ? 'fa fa-fw fa-spinner fa-spin' : 'fa fa-fw fa-search'
    }
  },
  methods: {
    ...mapActions([
      'findHauler'
    ]),
    search () {
      this.loading = true
      this.findHauler(this.input).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scope>
.btn {
  white-space: nowrap;
}
</style>
