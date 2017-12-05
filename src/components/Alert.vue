<template>
  <div v-if="error" class="alert alert-warning" role="alert">
    <button type="button" class="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>

    <p class="mb-0">
      <i class="fa fa-fw fa-warning" aria-hidden="true"></i>
      <strong>{{ error.message }}</strong>
    </p>

    <!-- <div v-html="error.message"></div> -->

  </div>
</template>

<script>
export default {
  name: 'alert',
  props: ['error']
}
</script>
