<template>
  <v-card>
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-text-field
        v-model="url"
        append-outer-icon="add"
        @click:append-outer="onClickIcon"
      />
    </v-form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    };
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.url);
    },
    onClickIcon() {
      this.onSubmit();
    },
  },
};
</script>
