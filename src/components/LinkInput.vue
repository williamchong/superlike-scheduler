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
import URL from 'url-parse';
import { QUERY_STRING_TO_REMOVE, SUPERLIKE_HOSTNAME } from '../constant';
import { getSuperLikenfo } from '../util/api';

export default {
  data() {
    return {
      url: '',
      parentSuperLikeId: undefined,
      internalURL: '',
      error: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters('link', ['getLinkInfo']),
    urlInfo() {
      return this.getLinkInfo(this.internalURL) || {};
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
    url() {
      this.onURLUpdate();
    },
  },
  methods: {
    ...mapActions('link', ['fetchLinkInfo']),
    async onURLUpdate() {
      this.error = false;
      this.errorMessage = '';
      await this.handleURLParsing();
      const { internalURL } = this;
      if (internalURL) {
        if (!this.getLinkInfo()) {
          try {
            await this.fetchLinkInfo({ url: internalURL });
          } catch (err) {
            // no op
          }
        }
        this.$nextTick(() => this.displayURLInfoError());
      }
    },
    async handleURLParsing() {
      try {
        this.internalURL = '';
        const url = new URL(this.url, true);
        QUERY_STRING_TO_REMOVE.forEach((qs) => {
          delete url.query[qs];
        });
        let superLikeId;
        if (url.query.superlike_id) {
          superLikeId = url.query.superlike_id;
          delete url.query.superlike_id;
        }
        url.set('query', url.query);
        this.internalURL = url.toString();
        if (url.host === SUPERLIKE_HOSTNAME) {
          [, superLikeId] = url.pathname.split('/');
        }
        if (superLikeId) {
          const superLikeData = await this.$axios.$get(
            getSuperLikenfo(superLikeId)
          );
          const { url: superLikeURL, id } = superLikeData;
          this.internalURL = superLikeURL;
          this.parentSuperLikeId = id;
        }
      } catch (err) {
        // no op
      }
    },
    displayURLInfoError() {
      if (!this.url) return;
      if (!this.title) {
        this.error = true;
        this.errorMessage = 'URL not found in LikeCoin button info API';
      } else if (!this.user) {
        this.error = true;
        this.errorMessage =
          'URL Author ID not found in LikeCoin button info API';
      }
    },
    onSubmit() {
      this.$emit('submit', {
        url: this.internalURL,
        likee: this.user,
        parentSuperLikeId: this.parentSuperLikeId,
      });
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
