<template>
  <v-card>
    <v-img v-if="ogImage" weight="200" height="200" :src="ogImage" />
    <v-card-title v-if="title">{{ title }}</v-card-title>
    <v-card-subtitle v-if="user">{{ user }}</v-card-subtitle>
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-text-field
        v-model="url"
        placeholder="Add new Link"
        hint="Enter URL"
        append-outer-icon="mdi-plus"
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
