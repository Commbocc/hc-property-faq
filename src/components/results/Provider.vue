<template lang="html">
  <div>
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
  </div>
</template>

<script>
export default {
  name: 'provider',
  props: ['provider']
}
</script>
