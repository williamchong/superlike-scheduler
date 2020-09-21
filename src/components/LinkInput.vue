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
        :error="error"
        :error-messages="errorMessage"
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
      error: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters('link', ['getLinkInfo']),
    urlInfo() {
      return this.getLinkInfo(this.url) || {};
    },
    user() {
      return this.urlInfo.user;
    },
    title() {
      return this.urlInfo.title;
    },
    ogImage() {
      return this.urlInfo.image;
    },
  },
  watch: {
    async url(u) {
      this.error = false;
      this.errorMessage = '';
      if (u) {
        if (!this.getLinkInfo(u)) {
          try {
            await this.fetchLinkInfo({ url: u });
          } catch (err) {
            // no op
          }
        }
        if (!this.title) {
          this.error = true;
          this.errorMessage = 'URL not found in LikeCoin button info API';
        } else if (!this.user) {
          this.error = true;
          this.errorMessage =
            'URL Author ID not found in LikeCoin button info API';
        }
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
    clearInput() {
      this.url = '';
    },
  },
};
</script>
