<template>
  <v-card>
    {{ title }}
    {{ url }}
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined,
    },
    url: {
      type: String,
      default: undefined,
    },
  },
};
</script>
