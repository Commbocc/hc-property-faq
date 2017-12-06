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

      <small v-if="helpText" class="form-text text-muted">
        {{ helpText }}
      </small>

    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'address-form',
  data () {
    return {
      input: '',
      placeholder: 'Your Street Address...',
      helpText: null
    }
  },
  computed: {
    ...mapState({
      searching: state => state.address.searching
    }),
    btnText () {
      // return (this.searching) ? 'Loading' : 'Find'
      return 'Find'
    },
    btnClass () {
      return (this.searching) ? 'btn-warning' : 'btn-info'
    },
    btnIcon () {
      return (this.searching) ? 'fa fa-fw fa-spinner fa-spin' : 'fa fa-fw fa-search'
    }
  },
  methods: {
    search () {
      this.$emit('search', this.input)
    }
  }
}
</script>

<style scope>
.btn {
  white-space: nowrap;
}
</style>
