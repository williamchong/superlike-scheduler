<template>
  <v-card>
    <v-img weight="200" height="200" :src="ogImage" />
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ user }}</v-card-subtitle>
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      url: '',
    };
  },
  computed: {
    ...mapGetters('link', ['getLinkInfo']),
    user() {
      return (this.getLinkInfo(this.url) || {}).user;
    },
    title() {
      return (this.getLinkInfo(this.url) || {}).title;
    },
    ogImage() {
      return (this.getLinkInfo(this.url) || {}).image;
    },
  },
  watch: {
    url(u) {
      if (!this.getLinkInfo(u)) {
        this.fetchLinkInfo({ url: u });
      }
    },
  },
  methods: {
    ...mapActions('link', ['fetchLinkInfo']),
    onSubmit() {
      this.$emit('submit', { url: this.url, likee: this.user });
    },
    onClickIcon() {
      this.onSubmit();
    },
  },
};
</script>
